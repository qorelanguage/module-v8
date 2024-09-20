import { createAction, Property } from 'core/framework';
import { httpClient, HttpMethod, AuthenticationType } from 'core/common';
import { dropboxAuth } from '../../';
import { IActionResponse } from '../../../../global/models/actions';

const dropboxListAFolderResponseType: IActionResponse = {
  entries: {
    name: 'entries',
    display_name: 'Entries',
    desc: 'The list of entries in the folder',
    short_desc: 'The list of entries in the folder',
    type: 'list',
    example_value: [
      {
        name: 'copied-test-file.txt',
        path_lower: '/testing/copied-test-file.txt',
        path_display: '/testing/copied-test-file.txt',
        id: 'id:PN3VV_MUE2QAAAAAAAAASw',
      },
    ],
  },
};

export const dropboxListAFolder = createAction({
  auth: dropboxAuth,
  name: 'list_dropbox_folder',
  description: 'List the contents of a folder',
  displayName: 'List a folder',
  responseType: dropboxListAFolderResponseType,
  props: {
    path: Property.ShortText({
      displayName: 'Path',
      description:
        'The path of the folder to be listed (e.g. /folder1). Use an empty string for the root folder.',
      required: true,
    }),
    recursive: Property.Checkbox({
      displayName: 'Recursive',
      description:
        'If set to true, the list folder operation will be applied recursively to all subfolders and the response will contain contents of all subfolders.',
      defaultValue: false,
      required: false,
    }),
    limit: Property.Number({
      displayName: 'Limit',
      description:
        'The maximum number of results to return (between 1 and 2000). Default is 2000 if not specified.',
      required: false,
    }),
  },
  async run(context) {
    const params = {
      path: context.propsValue.path,
      recursive: context.propsValue.recursive,
      limit: context.propsValue.limit || 2000,
    };

    const result = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `https://api.dropboxapi.com/2/files/list_folder`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: params,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: context.auth.access_token,
      },
    });

    return result.body;
  },
});
