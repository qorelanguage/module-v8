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

  it('Should get all issues', () => {
    const { body } = testApi.execAppAction('github', 'issues/list', connection, {
      query: {
        filter: 'all',
      },
    });

    expect(body).toBeDefined();
    expect(body.length).toBe(2);
  });
});
