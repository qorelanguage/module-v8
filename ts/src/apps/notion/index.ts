import { mapActionsToApp } from '../../global/helpers';
import { IQoreAppWithActions } from '../../global/models/qore';
import L from '../../i18n/i18n-node';
import { Locales } from '../../i18n/i18n-types';
import * as notionActions from './actions';
import { NOTION_APP_NAME } from './constants';
/*
 * Returns the app object with all the actions ready to use, using translations
 * @param locale - the locale
 * @returns IQoreAppWithActions
 */
export default (locale: Locales) =>
  ({
    display_name: L[locale].apps.Notion.displayName(),
    short_desc: L[locale].apps.Notion.shortDesc(),
    name: NOTION_APP_NAME,
    actions: mapActionsToApp(NOTION_APP_NAME, notionActions, locale),
    desc: L[locale].apps.Notion.longDesc(),
    logo:
      'PHN2ZyB3aWR0aD0iMTI3IiBoZWlnaHQ9IjEyNyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3Ln' +
      'czLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTYuMDE3IDQuMzEzbDU1LjMzMyAtNC4wODdjNi43OTcgLTAuNTgzIDguNTQzIC0wLjE5IDEy' +
      'LjgxNyAyLjkxN2wxNy42NjMgMTIuNDQzYzIuOTEzIDIuMTQgMy44ODMgMi43MjMgMy44ODMgNS4wNTN2NjguMjQzYzAgNC4yNzcgLTEuNTUzID' +
      'YuODA3IC02Ljk5IDcuMTkzTDI0LjQ2NyA5OS45NjdjLTQuMDggMC4xOTMgLTYuMDIzIC0wLjM5IC04LjE2IC0zLjExM0wzLjMgNzkuOTRjLTIu' +
      'MzMzIC0zLjExMyAtMy4zIC01LjQ0MyAtMy4zIC04LjE2N1YxMS4xMTNjMCAtMy40OTcgMS41NTMgLTYuNDEzIDYuMDE3IC02Ljh6IiBmaWxsPS' +
      'IjZmZmIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02MS4zNSAwLjIyN2wtNTUuMzMzIDQ' +
      'uMDg3QzEuNTUzIDQuNyAwIDcuNjE3IDAgMTEuMTEzdjYwLjY2YzAgMi43MjMgMC45NjcgNS4wNTMgMy4zIDguMTY3bDEzLjAwNyAxNi45MTNjM' +
      'i4xMzcgMi43MjMgNC4wOCAzLjMwNyA4LjE2IDMuMTEzbDY0LjI1NyAtMy44OWM1LjQzMyAtMC4zODcgNi45OSAtMi45MTcgNi45OSAtNy4xOTN' +
      'WMjAuNjRjMCAtMi4yMSAtMC44NzMgLTIuODQ3IC0zLjQ0MyAtNC43MzNMNzQuMTY3IDMuMTQzYy00LjI3MyAtMy4xMDcgLTYuMDIgLTMuNSAt' +
      'MTIuODE3IC0yLjkxN3pNMjUuOTIgMTkuNTIzYy01LjI0NyAwLjM1MyAtNi40MzcgMC40MzMgLTkuNDE3IC0xLjk5TDguOTI3IDExLjUwN2MtM' +
      'C43NyAtMC43OCAtMC4zODMgLTEuNzUzIDEuNTU3IC0xLjk0N2w1My4xOTMgLTMuODg3YzQuNDY3IC0wLjM5IDYuNzkzIDEuMTY3IDguNTQgMi' +
      '41MjdsOS4xMjMgNi42MWMwLjM5IDAuMTk3IDEuMzYgMS4zNiAwLjE5MyAxLjM2bC01NC45MzMgMy4zMDcgLTAuNjggMC4wNDd6TTE5LjgwMyA' +
      '4OC4zVjMwLjM2N2MwIC0yLjUzIDAuNzc3IC0zLjY5NyAzLjEwMyAtMy44OTNMODYgMjIuNzhjMi4xNCAtMC4xOTMgMy4xMDcgMS4xNjcgMy4x' +
      'MDcgMy42OTN2NTcuNTQ3YzAgMi41MyAtMC4zOSA0LjY3IC0zLjg4MyA0Ljg2M2wtNjAuMzc3IDMuNWMtMy40OTMgMC4xOTMgLTUuMDQzIC0wL' +
      'jk3IC01LjA0MyAtNC4wODN6bTU5LjYgLTU0LjgyN2MwLjM4NyAxLjc1IDAgMy41IC0xLjc1IDMuN2wtMi45MSAwLjU3N3Y0Mi43NzNjLTIuNT' +
      'I3IDEuMzYgLTQuODUzIDIuMTM3IC02Ljc5NyAyLjEzNyAtMy4xMDcgMCAtMy44ODMgLTAuOTczIC02LjIxIC0zLjg4N2wtMTkuMDMgLTI5Ljk' +
      '0djI4Ljk2N2w2LjAyIDEuMzYzczAgMy41IC00Ljg1NyAzLjVsLTEzLjM5IDAuNzc3Yy0wLjM5IC0wLjc4IDAgLTIuNzIzIDEuMzU3IC0zLjEx' +
      'bDMuNDk3IC0wLjk3di0zOC4zTDMwLjQ4IDQwLjY2N2MtMC4zOSAtMS43NSAwLjU4IC00LjI3NyAzLjMgLTQuNDczbDE0LjM2NyAtMC45NjcgM' +
      'TkuOCAzMC4zMjd2LTI2LjgzbC01LjA0NyAtMC41OGMtMC4zOSAtMi4xNDMgMS4xNjMgLTMuNyAzLjEwMyAtMy44OWwxMy40IC0wLjc4eiIgZm' +
      'lsbD0iIzAwMCIvPgo8L3N2Zz4K',
    logo_file_name: 'notion-logo.svg',
    logo_mime_type: 'image/svg+xml',
    swagger: 'schemas/notion.swagger.yaml',
    swagger_options: {
        'parse_flags': 128,
    },
    rest: {
      url: 'https://api.notion.com',
      data: 'json',
      oauth2_grant_type: 'authorization_code',
      oauth2_auth_url: 'https://api.notion.com/v1/oauth/authorize',
      oauth2_token_url: 'https://api.notion.com/v1/oauth/token',
      oauth2_scopes: ['read', 'write'],
      ping_method: 'GET',
      ping_path: '/v1/users/me',
    },
  }) satisfies IQoreAppWithActions;
