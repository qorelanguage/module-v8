import { ZENDESK_ACTIONS, ZENDESK_CONN_OPTIONS } from '../apps/zendesk';

let connection: string;

describe('Runs tests with Qore API', () => {
  describe('Tests Zendesk Actions', () => {
    beforeAll(() => {
      // Create a connection to the Zendesk app
      connection = testApi.createConnection<typeof ZENDESK_CONN_OPTIONS>('zendesk', {
        opts: {
          subdomain: process.env.ZENDESK_SUBDOMAIN,
          username: process.env.ZENDESK_USER,
          password: process.env.ZENDESK_API_KEY,
          oauth2_grant_type: null,
        },
      });

      expect(connection).toBeDefined();
    });

    // Go through the actions and run them, this will test that
    // each action returns a valid response and does not throw an error
    ZENDESK_ACTIONS.forEach((action) => {
      it(`Testing the ${action.action} action`, () => {
        const response = testApi.execAppAction('zendesk', action.action, connection);

        console.log(response);

        expect(response).toBeDefined();
      });
    });
  });
});
