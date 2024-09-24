import { ZENDESK_ACTIONS, ZENDESK_APP_NAME } from '../apps/zendesk';

let connection: string;

describe('Runs tests with Qore API', () => {
  describe('Tests Zendesk Actions', () => {
    beforeAll(() => {
      // Create a connection to the Zendesk app
      connection = testApi.createConnection('zendesk', {
        subdomain: 'd3v-qoretechnologies',
      });
    });

    // Go through the actions and run them, this will test that
    // each action returns a valid response and does not throw an error
    ZENDESK_ACTIONS.forEach((action) => {
      it(`Testing the ${action} action`, () => {
        const response = testApi.execAppAction(ZENDESK_APP_NAME, action.action, connection);

        console.log(response);

        expect(response).toBeDefined();
      });
    });
  });
});
