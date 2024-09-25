import { ZENDESK_ACTIONS } from '../apps/zendesk';

let connection: string;

describe('Runs tests with Qore API', () => {
  describe('Tests Zendesk Actions', () => {
    beforeAll(() => {
      // Create a connection to the Zendesk app
      connection = testApi.createConnection('zendesk', {
        opts: {
          subdomain: 'd3v-qoretechnologies',
          username: 'filip.witosz@qoretechnologies.com/token',
          password: 'xF1TpVCygW6ZjWXesPiR7jLFAfB3PV2UJMh4DJQ2',
          oauth2_grant_type: 'password',
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
