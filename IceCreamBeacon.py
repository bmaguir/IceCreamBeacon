# [START imports]
import os
import urllib
import logging
import json
from datetime import datetime, timedelta
import time
from google.appengine.api import users
from google.appengine.ext import ndb

from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.ext import testbed
import webapp2

from BaseHandler import BaseHandler


# [END imports]

DEFAULT_BEACONLIST_NAME = "DUBLIN"


# [START Beacon]
class Beacon(ndb.Model):
    """Model for representing Beacons, includes location, timestamp, owner_id, """
    owner_id = ndb.StringProperty(indexed=True)
    timestamp = ndb.DateTimeProperty(auto_now_add=True)
    latitude = ndb.FloatProperty(indexed=True)
    longitude = ndb.FloatProperty(indexed=True)
    removed = ndb.BooleanProperty(indexed=True, default=False)
    address = ndb.StringProperty(indexed=True)
    location = ndb.GeoPt

    @staticmethod
    def format_results_list(results_list):
        output_list = []
        for result in results_list:
            output_list.append(
                {'timestamp': time.mktime(result.timestamp.timetuple()),
                 'location': {'lat': result.latitude, 'lng': result.longitude},
                 'id': result.key.id()
                 }
            )
        return output_list

    @staticmethod
    def query_beacons(city):
        results = Beacon.query(Beacon.removed == False, Beacon.timestamp > datetime.today() - timedelta(hours=1),
                               ancestor=beacon_list_key(city)).fetch()
        return Beacon.format_results_list(results)

    @staticmethod
    def remove_beacon(owner_id):
        for result in Beacon.query(Beacon.owner_id == owner_id).fetch():
            if not result.removed:
                result.removed = True
                result.put()

    @staticmethod
    def add_beacon(owner_id, lat, lng, city, address=None):
        Beacon.remove_beacon(owner_id)
        new_beacon = Beacon(parent=beacon_list_key(city))
        new_beacon.owner_id = owner_id
        new_beacon.longitude = float(lng)
        new_beacon.latitude = float(lat)
        new_beacon.location = ndb.GeoPt(lat, lng)
        if address:
            new_beacon.address = address
        return new_beacon.put()

# [END Beacon]


def beacon_list_key(beacon_list=DEFAULT_BEACONLIST_NAME):
    """Constructs a Datastore key for a Guestbook entity.

    We use guestbook_name as the key.
    """
    return ndb.Key('BeaconList', beacon_list)


# [START main_page]
class MainPage(webapp2.RequestHandler):

    def get(self):
        self.response.write()
# [END main_page]


class IceCreamBeacon(BaseHandler):
    def get(self):
        params = self.request.params
        query_results = Beacon.query_beacons(params['city'])
        logging.info(query_results)
        self.response.write(json.dumps(query_results))

    def get_user_id(self):
        return self.session['id']

    def post(self):
        post_data = self.request.POST
        logging.info(post_data)
        try:
            if Beacon.add_beacon(self.get_user_id(), float(post_data['latitude']), float(post_data['longitude']),
                                 post_data['city'], post_data.get("address", None)):
                return_string = "success"
            else:
                return_string = "post Failed"
        except KeyError as e:
            logging.warn("403, key error")
            logging.warn(e)
            return_string = "invalid request"
            logging.warn(post_data.items())
        except ValueError:
            logging.warn("403, key error")
            return_string = "invalid request"
            logging.warn(post_data.items())
        self.response.write(return_string)

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'ocwbKCiuAJLRJgM1bWNV1TPSH0F2Lb',}

# [START app]
app = webapp2.WSGIApplication([
    ('/api/test', MainPage),
    ('/api/Beacon', IceCreamBeacon)
], debug=True, config=config)
# [END app]
