import { Client } from '@notionhq/client';
import { notionAuth } from '../..';
import { createAction } from '../../../../core/framework';
import { getUserResponseType } from './get-user';

export const getCurrentUser = createAction({
  auth: notionAuth,
  name: 'get_current_user',
  displayName: 'Get Current User',
  description: 'Retrieve your token’s bot user information',
  props: {},
  responseType: getUserResponseType,
  async run(context) {
    const notion = new Client({
      auth: context.auth.access_token,
      notionVersion: '2022-02-22',
    });

    return await notion.users.me({});
  },
});
