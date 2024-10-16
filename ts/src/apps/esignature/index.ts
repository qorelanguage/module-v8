import { QorusRequest } from '@qoretechnologies/ts-toolkit';
import { OpenAPIV2 } from 'openapi-types';
import { buildActionsFromSwaggerSchema, mapActionsToApp } from '../../global/helpers';
import { IQoreAppWithActions } from '../../global/models/qore';
import L from '../../i18n/i18n-node';
import { Locales } from '../../i18n/i18n-types';
import eSignature from '../../schemas/esignature.swagger.json';
import { IQoreConnectionOptions } from '../zendesk';
import { ESIGNATURE_APP_NAME } from './constants';
/*
 * Returns the app object with all the actions ready to use, using translations
 * @param locale - the locale
 * @returns IQoreAppWithActions
 */

export const ESIGNATURE_CONN_OPTIONS = {
  account_id: {
    display_name: 'Account ID',
    short_desc: 'The account ID',
    desc: 'The account ID',
    type: 'string',
  },
  base_uri: {
    display_name: 'Base URI',
    short_desc: 'The base URI',
    desc: 'The base URI',
    type: 'string',
  },
} satisfies IQoreConnectionOptions;

export default (locale: Locales) =>
  ({
    display_name: L[locale].apps[ESIGNATURE_APP_NAME].displayName(),
    short_desc: L[locale].apps[ESIGNATURE_APP_NAME].shortDesc(),
    name: ESIGNATURE_APP_NAME,
    desc: L[locale].apps[ESIGNATURE_APP_NAME].longDesc(),
    actions: mapActionsToApp(
      ESIGNATURE_APP_NAME,
      buildActionsFromSwaggerSchema(eSignature as OpenAPIV2.Document, ['/v2.1/accounts']),
      locale
    ),
    logo:
      'PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE1NDcgMTU0OSIg' +
      'd2lkdGg9IjE1NDciIGhlaWdodD0iMTU0OSI+Cgk8dGl0bGU+ZG9jdS1zdmc8L3RpdGxlPgoJPHN0eWxlPgoJCS5zMCB7IGZpbGw6ICM0YzAw' +
      'ZmYgfSAKCQkuczEgeyBmaWxsOiAjZmY1MjUyIH0gCgkJLnMyIHsgZmlsbDogIzAwMDAwMCB9IAoJPC9zdHlsZT4KCTxnIGlkPSJMYXllciI+' +
      'CgkJPHBhdGggaWQ9IkxheWVyIiBjbGFzcz0iczAiIGQ9Im0xMTEzLjQgMTExNC45djM5NS42YzAgMjAuOC0xNi43IDM3LjYtMzcuNSAzNy42' +
      'aC0xMDM4LjRjLTIwLjcgMC0zNy41LTE2LjgtMzcuNS0zNy42di0xMDM5YzAtMjAuNyAxNi44LTM3LjUgMzcuNS0zNy41aDM5NC4zdjY0My40' +
      'YzAgMjAuNyAxNi44IDM3LjUgMzcuNSAzNy41eiIvPgoJCTxwYXRoIGlkPSJMYXllciIgY2xhc3M9InMxIiBkPSJtMTU0NiA1NTcuMWMwIDMz' +
      'Mi40LTE5My45IDU1Ny00MzIuNiA1NTcuOHYtNDE4LjhjMC0xMi00LjgtMjQtMTMuNS0zMS45bC0yMTcuMS0yMTcuNGMtOC44LTguOC0yMC0x' +
      'My42LTMyLTEzLjZoLTQxOC4ydi0zOTQuOGMwLTIwLjggMTYuOC0zNy42IDM3LjUtMzcuNmg1ODUuMWMyNzcuNy0wLjggNDkwLjggMjIzIDQ5' +
      'MC44IDU1Ni4zeiIvPgoJCTxwYXRoIGlkPSJMYXllciIgY2xhc3M9InMyIiBkPSJtMTA5OS45IDY2My40YzguNyA4LjcgMTMuNSAxOS45IDEz' +
      'LjUgMzEuOXY0MTguOGgtNjQzLjNjLTIwLjcgMC0zNy41LTE2LjgtMzcuNS0zNy41di02NDMuNGg0MTguMmMxMiAwIDI0IDQuOCAzMiAxMy42' +
      'eiIvPgoJPC9nPgo8L3N2Zz4=',
    logo_file_name: 'esignature-logo.svg',
    logo_mime_type: 'image/svg+xml',
    swagger: 'schemas/esignature.swagger.json',
    rest: {
      url: '{{base_uri}}/accounts/{{account_id}}',
      data: 'json',
      oauth2_grant_type: 'authorization_code',
      oauth2_auth_url: 'https://account-d.docusign.com/oauth/auth',
      oauth2_token_url: 'https://account-d.docusign.com/oauth/token',
      oauth2_scopes: ['read', 'write'],
      ping_method: 'GET',
      ping_path: '',
    },
    rest_modifiers: {
      options: ESIGNATURE_CONN_OPTIONS,
      set_options_post_auth: async (context) => {
        // We need to make a call to the docusign user info endpoint to get the base_uri\
        // and account_id
        const userInfo = await QorusRequest.get<Record<string, any>>(
          {
            path: '/oauth/userinfo',
            headers: {
              Authorization: `Bearer ${context.conn_opts.token}`,
            },
          },
          {
            url: 'https://account-d.docusign.com',
            endpointId: 'Docusing',
          }
        );

        if ('base_uri' in userInfo && 'account_id' in userInfo) {
          return {
            base_uri: userInfo.accounts[0].base_uri,
            account_id: userInfo.accounts[0].account_id,
          };
        }

        throw new Error(
          'Could not get the base_uri and account_id from the user info endpoint of docusign eSignature'
        );
      },
      url_template_options: ['account_id', 'base_uri'],
    },
  }) satisfies IQoreAppWithActions<typeof ESIGNATURE_CONN_OPTIONS>;
