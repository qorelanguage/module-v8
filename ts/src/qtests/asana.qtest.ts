import { ASANA_ACTIONS } from '../apps/asana';

let connection: string;

describe('Tests Asana Actions', () => {
  beforeAll(() => {
    connection = testApi.createConnection('asana', {
      opts: {
        token: process.env.ASANA_PAT,
      },
    });
    expect(connection).toBeDefined();
  });

  it('Should list all workspaces', () => {
    const action = ASANA_ACTIONS.find((a) => a.action === 'getWorkspaces');
    const response = testApi.execAppAction('asana', action.action, connection);

    console.log(response);

    expect(response).toBeDefined();
  });
});
