import { QorusRequest } from '@qoretechnologies/ts-toolkit';
import { ESIGNATURE_ACTIONS } from '../apps/esignature/constants';
import _sodium from 'libsodium-wrappers';

let connection: string;

describe('Tests eSignature Actions', () => {
  let accountId: string;
  let brandId: string;

  beforeAll(async () => {
    const refreshToken = process.env.DOCUSIGN_REFRESH_TOKEN;
    const clientId = process.env.DOCUSIGN_CLIENT_ID;
    const clientSecret = process.env.DOCUSIGN_CLIENT_SECRET;

    const { data: refreshTokenData } = await QorusRequest.post<any>(
      {
        params: {
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        path: '/oauth/token',
      },
      { url: 'https://account-d.docusign.com', endpointId: 'Docusign' }
    );

    const accessToken = refreshTokenData?.access_token;
    const newRefreshToken = refreshTokenData?.refresh_token;

    await updateDocusignSecret(newRefreshToken);

    const { data: userInfo } = await QorusRequest.get<any>(
      {
        path: '/oauth/userinfo',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      {
        url: 'https://account-d.docusign.com',
        endpointId: 'Docusign',
      }
    );

    const base_uri = userInfo.accounts[0].base_uri.split('//')[1];
    accountId = userInfo.accounts[0].account_id;
    connection = testApi.createConnection('docusignesignature', {
      opts: {
        token: accessToken,
        base_uri,
        account_id: accountId,
      },
    });
  });

  it('Should create a new brand', async () => {
    const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Brands_PostBrands');

    expect(action).toBeDefined();
    const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
      accountId,
      body: {
        brandName: 'TestBrand',
      },
    });
    expect(body).toBeDefined();
    expect(body.brands).toBeDefined();
    expect(body.brands.length).toBeGreaterThan(0);
    brandId = body.brands[0].brandId;
  });

  it('Should list all brands', async () => {
    const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Brands_GetBrands');

    expect(action).toBeDefined();
    const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
      accountId,
    });
    expect(body).toBeDefined();
  });

  it('Should delete a brand', async () => {
    const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Brands_DeleteBrands');

    expect(action).toBeDefined();
    const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
      accountId,
      body: {
        brands: [{ brandId }],
      },
    });
    expect(body).toBeDefined();
  });

  // it('Should list all Envelopes', async () => {
  //   const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Envelopes_GetEnvelopes');

  //   expect(action).toBeDefined();
  //   const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
  //     accountId,
  //   });
  //   expect(body).toBeDefined();
  // });

  // it('Should list all documents', async () => {
  //   const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Documents_GetDocuments');

  //   expect(action).toBeDefined();
  //   const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
  //     accountId,
  //   });
  //   expect(body).toBeDefined();
  // });

  // it('Should list all recipients', async () => {
  //   const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Recipients_GetRecipients');

  //   expect(action).toBeDefined();
  //   const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
  //     accountId,
  //   });
  //   expect(body).toBeDefined();
  // });

  // it('Should list all templates', async () => {
  //   const action = ESIGNATURE_ACTIONS.find((a) => a.action === 'Templates_GetTemplates');

  //   expect(action).toBeDefined();
  //   const { body } = await testApi.execAppAction('docusignesignature', action.action, connection, {
  //     accountId,
  //   });
  //   expect(body).toBeDefined();
  // });
});

const updateDocusignSecret = async (newRefreshToken: string): Promise<void> => {
  const docusignSecretName = process.env.GH_MODULE_DOCUSIGN_SECRET_NAME;
  const ghModuleRepoName = process.env.GH_MODULE_REPO_NAME;
  const ghModuleRepoOwner = process.env.GH_MODULE_REPO_OWNER;
  const ghPatForSecrets = process.env.GH_PAT_FOR_SECRETS;

  const gitHubConnection = testApi.createConnection('github', {
    opts: {
      token: ghPatForSecrets,
    },
  });

  const { body } = await testApi.execAppAction(
    'github',
    'actions-get-repo-public-key',
    gitHubConnection,
    {
      repo: ghModuleRepoName,
      owner: ghModuleRepoOwner,
    }
  );

  const encryptedRefreshToken = await encryptSecret(newRefreshToken, body.key);

  await testApi.execAppAction('github', 'actions-create-or-update-repo-secret', gitHubConnection, {
    owner: ghModuleRepoOwner,
    repo: ghModuleRepoName,
    secret_name: docusignSecretName,
    body: {
      encrypted_value: encryptedRefreshToken,
      key_id: body.key_id,
    },
  });
};

const encryptSecret = (secret: string, publicKey: string): string => {
  const publicKeyBinary = Buffer.from(publicKey, 'base64');
  const encryptedMessage = _sodium.crypto_box_seal(Buffer.from(secret), publicKeyBinary);

  return Buffer.from(encryptedMessage).toString('base64');
};
