import { OpenAPIV2 } from 'openapi-types';
import { buildActionsFromSwaggerSchema, mapActionsToApp } from '../../global/helpers';
import { IQoreAppWithActions } from '../../global/models/qore';
import L from '../../i18n/i18n-node';
import { Locales } from '../../i18n/i18n-types';
import eSignature from '../../schemas/esignature.swagger.json';
import { ESIGNATURE_APP_NAME, ESIGNATURE_LOCALIZATION_KEY } from './constants';
/*
 * Returns the app object with all the actions ready to use, using translations
 * @param locale - the locale
 * @returns IQoreAppWithActions
 */
export default (locale: Locales) =>
  ({
    display_name: L[locale].apps[ESIGNATURE_LOCALIZATION_KEY].displayName(),
    short_desc: L[locale].apps[ESIGNATURE_LOCALIZATION_KEY].shortDesc(),
    name: ESIGNATURE_APP_NAME,
    desc: L[locale].apps[ESIGNATURE_LOCALIZATION_KEY].longDesc(),
    actions: mapActionsToApp(
      ESIGNATURE_LOCALIZATION_KEY,
      buildActionsFromSwaggerSchema(eSignature as OpenAPIV2.Document, []),
      locale
    ),
    logo: '',
    logo_file_name: 'esignature-logo.svg',
    logo_mime_type: 'image/svg+xml',
    swagger: 'schemas/esignature.swagger.json',
    rest: {
      url: '',
      data: 'json',
      oauth2_grant_type: 'authorization_code',
      oauth2_auth_url: 'https://account-d.docusign.com/oauth/auth',
      oauth2_token_url: 'https://account-d.docusign.com/oauth/token',
      oauth2_scopes: ['read', 'write'],
      ping_method: 'GET',
      ping_path: '',
    },
  }) satisfies IQoreAppWithActions;
