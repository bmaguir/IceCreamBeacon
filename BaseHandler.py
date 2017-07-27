import webapp2
import string
import random
from webapp2_extras import sessions


class BaseHandler(webapp2.RequestHandler):
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        session = self.session_store.get_session(max_age=None)
        # set users id if they don't have one
        if not session.get('id'):
            session['id'] = self.create_random_id()
        return session

    @staticmethod
    def create_random_id():
        lst = [random.choice(string.ascii_letters + string.digits) for n in xrange(30)]
        random_string = "".join(lst)
        return random_string
