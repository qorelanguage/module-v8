import { JIRA_ACTIONS } from '../apps/jira';
import { JIRA_CONN_OPTIONS } from '../apps/jira/constants';

let connection: string;

describe('Tests Jira Actions', () => {
  const bannerText = `Test Banner Message-${Date.now()}`;
  // let projectId: string | null = null;
  let customFieldId: string | null = null;
  // let workflowSchemeId: string | null = null;
  // let versionId: string | null = null;

  beforeAll(() => {
    connection = testApi.createConnection<typeof JIRA_CONN_OPTIONS>('jira', {
      opts: {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWORD,
        cloud_id: process.env.JIRA_CLOUD_ID,
        swagger_base_path: `ex/jira/${process.env.JIRA_CLOUD_ID}`,
        oauth2_grant_type: 'none',
      },
    });

    expect(connection).toBeDefined();
  });

  // Banner Actions
  it('Should set the banner', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'setBanner');
    expect(action).toBeDefined();

    await testApi.execAppAction('jira', action.action, connection, {
      body: {
        isDismissible: true,
        isEnabled: true,
        message: bannerText,
        visibility: 'public',
      },
    });
  });

  it('Should get the banner', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'getBanner');
    expect(action).toBeDefined();

    const response = await testApi.execAppAction('jira', action.action, connection);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe(bannerText);
  });

  // // Advanced Settings
  it('Should get advanced settings', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'getAdvancedSettings');
    expect(action).toBeDefined();

    const response = await testApi.execAppAction('jira', action.action, connection);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Should set an application property', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'setApplicationProperty');
    expect(action).toBeDefined();
    const value = `Test Value ${Date.now()}`;
    const response = await testApi.execAppAction('jira', action.action, connection, {
      id: 'jira.title',
      body: {
        value,
      },
    });

    expect(response.body).toBeDefined();
    expect(response.body.value).toBe(value);
  });

  // Fields
  it('Should get all fields', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'getFields');
    expect(action).toBeDefined();

    const response = await testApi.execAppAction('jira', action.action, connection);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Should create a custom field', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'createCustomField');
    expect(action).toBeDefined();
    const name = `Test Custom Field ${Date.now()}`;
    const response = await testApi.execAppAction('jira', action.action, connection, {
      body: {
        name,
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:textarea',
        description: 'A description for the test custom field',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher',
      },
    });

    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(name);
    customFieldId = response.body.id;
  });

  it('Should update a custom field', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'updateCustomField');
    expect(action).toBeDefined();
    const newName = `Updated Custom Field ${Date.now()}`;
    const response = await testApi.execAppAction('jira', action.action, connection, {
      fieldId: customFieldId,
      body: {
        name: 'Updated Custom Field',
      },
    });

    expect(response.body).toBeDefined();
    expect(response.body.name).toBe(newName);
  });

  it('Should trash a custom field', async () => {
    const action = JIRA_ACTIONS.find((a) => a.action === 'trashCustomField');
    expect(action).toBeDefined();

    const response = await testApi.execAppAction('jira', action.action, connection, {
      id: customFieldId,
    });

    expect(response.body).toBeDefined();
  });

  // // Project Categories
  // it('Should get all project categories', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'getAllProjectCategories');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection);
  //   expect(response.body).toBeDefined();
  //   expect(response.body.length).toBeGreaterThan(0);
  // });

  // it('Should create a project category', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'createProjectCategory');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     body: {
  //       name: 'Test Category',
  //       description: 'A description for the test category',
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  //   projectId = response.body.id;
  //   console.log(projectId);
  // });

  // // Versions
  // it('Should get a version', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'getVersion');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     versionId,
  //   });

  //   expect(response.body).toBeDefined();
  //   expect(response.body.id).toBe(versionId);
  // });

  // it('Should update a version', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'updateVersion');
  //   expect(action).toBeDefined();

  //   const updatedVersionName = `Updated Version ${Date.now()}`;
  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     versionId,
  //     body: {
  //       name: updatedVersionName,
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  //   expect(response.body.name).toBe(updatedVersionName);
  //   versionId = response.body.id;
  // });

  // it('Should delete a version', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'deleteVersion');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     versionId,
  //   });

  //   expect(response.body).toBeDefined();
  // });

  // // Workflow Schemes
  // it('Should get all workflow schemes', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'getAllWorkflowSchemes');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection);
  //   expect(response.body).toBeDefined();
  //   expect(response.body.length).toBeGreaterThan(0);
  // });

  // it('Should create a workflow scheme', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'createWorkflowScheme');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     body: {
  //       name: 'Test Workflow Scheme',
  //       description: 'Test description',
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  //   workflowSchemeId = response.body.id;
  // });

  // it('Should update workflow scheme mappings', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'updateWorkflowSchemeMappings');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     workflowSchemeId,
  //     body: {
  //       mappings: [
  //         {
  //           issueType: 'Bug',
  //           workflow: 'Bug Workflow',
  //         },
  //       ],
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  // });

  // it('Should delete a workflow scheme', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'deleteWorkflowScheme');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     workflowSchemeId,
  //   });

  //   expect(response.body).toBeDefined();
  // });

  // // Worklogs
  // it('Should get worklogs for IDs', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'getWorklogsForIds');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     body: {
  //       ids: ['1', '2', '3'],
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  // });

  // it('Should get IDs of worklogs deleted since a timestamp', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'getIdsOfWorklogsDeletedSince');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     query: {
  //       since: 1630454400,
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  // });

  // it('Should get a workflow scheme', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'getWorkflowScheme');
  //   expect(action).toBeDefined();

  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     workflowSchemeId,
  //   });

  //   expect(response.body).toBeDefined();
  //   expect(response.body.id).toBe(workflowSchemeId);
  // });

  // it('Should update a workflow scheme', async () => {
  //   const action = JIRA_ACTIONS.find((a) => a.action === 'updateWorkflowScheme');
  //   expect(action).toBeDefined();

  //   const updatedSchemeName = `Updated Workflow Scheme ${Date.now()}`;
  //   const response = await testApi.execAppAction('jira', action.action, connection, {
  //     workflowSchemeId,
  //     body: {
  //       name: updatedSchemeName,
  //     },
  //   });

  //   expect(response.body).toBeDefined();
  //   expect(response.body.name).toBe(updatedSchemeName);
  // });
});
