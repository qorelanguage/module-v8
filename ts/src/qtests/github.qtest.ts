import { GITHUB_ACTIONS } from '../apps/github';

let connection: string;

describe('Tests Github Actions', () => {
  beforeAll(() => {
    // Create a connection to the Zendesk app
    connection = testApi.createConnection('github', {
      opts: {
        token: process.env.GH_PAT,
      },
    });

    expect(connection).toBeDefined();
  });

  // Go through the actions and run them, this will test that
  // each action returns a valid response and does not throw an error
  GITHUB_ACTIONS.forEach((action) => {
    it(`Testing the ${action.action} action`, () => {
      const response = testApi.execAppAction('github', action.action, connection);

      // There should be 2 issues and 1 pull request
      expect(response).toBeDefined();

      // Check the response for the issues/list action
      if (action.swagger_path === '/issues/GET') {
        console.log(response.body);
        expect(response?.body?.length).toBe(3);
      }
    });
  });
});
