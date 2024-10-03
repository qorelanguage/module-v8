import { createAction, Property } from 'core/framework';
import { httpClient, HttpMethod, AuthenticationType } from 'core/common';
import { dropboxAuth } from '../../';
import { IActionResponse } from '../../../../global/models/actions';

const dropboxMoveFileResponseType: IActionResponse = {
  metadata: {
    name: 'metadata',
    display_name: 'Metadata',
    desc: 'The metadata of the file',
    short_desc: 'The metadata of the file',
    type: {
      name: {
        name: 'name',
        display_name: 'Name',
        desc: 'The name of the file',
        short_desc: 'The name of the file',
        type: 'string',
        example_value: 'test.txt',
      },
      path_lower: {
        name: 'path_lower',
        display_name: 'Path Lower',
        desc: 'The path of the file',
        short_desc: 'The path of the file',
        type: 'string',
        example_value: '/test.txt',
      },
      path_display: {
        name: 'path_display',
        display_name: 'Path Display',
        desc: 'The path of the file',
        short_desc: 'The path of the file',
        type: 'string',
        example_value: '/test.txt',
      },
      id: {
        name: 'id',
        display_name: 'Id',
        desc: 'The id of the file',
        short_desc: 'The id of the file',
        type: 'string',
        example_value: 'id:123',
      },
      client_modified: {
        name: 'client_modified',
        display_name: 'Client Modified',
        desc: 'The date and time this file was last modified by the client',
        short_desc: 'The date and time this file was last modified by the client',
        type: 'string',
        example_value: '2021-06-01T12:00:00Z',
      },
      server_modified: {
        name: 'server_modified',
        display_name: 'Server Modified',
        desc: 'The date and time this file was last modified by the server',
        short_desc: 'The date and time this file was last modified by the server',
        type: 'string',
        example_value: '2021-06-01T12:00:00Z',
      },
      rev: {
        name: 'rev',
        display_name: 'Rev',
        desc: 'A unique identifier for the current revision of a file',
        short_desc: 'A unique identifier for the current revision of a file',
        type: 'string',
        example_value: 'rev:123',
      },
      size: {
        name: 'size',
        display_name: 'Size',
        desc: 'The size of the file in bytes',
        short_desc: 'The size of the file in bytes',
        type: 'number',
        example_value: 1024,
      },
      is_downloadable: {
        name: 'is_downloadable',
        display_name: 'Is Downloadable',
        desc: 'Whether the file can be downloaded',
        short_desc: 'Whether the file can be downloaded',
        type: 'boolean',
        example_value: true,
      },
      content_hash: {
        name: 'content_hash',
        display_name: 'Content Hash',
        desc: 'A hash of the file content',
        short_desc: 'A hash of the file content',
        type: 'string',
        example_value: 'hash:123',
      },
    },
  },
};

export const dropboxMoveFile = createAction({
  auth: dropboxAuth,
  name: 'move_dropbox_file',
  description: 'Move a file',
  displayName: 'Move file',
  responseType: dropboxMoveFileResponseType,
  props: {
    from_path: Property.ShortText({
      displayName: 'From Path',
      description: 'The current path of the file (e.g. /folder1/oldfile.txt)',
      required: true,
    }),
    to_path: Property.ShortText({
      displayName: 'To Path',
      description: 'The new path for the file (e.g. /folder2/newfile.txt)',
      required: true,
    }),
    autorename: Property.Checkbox({
      displayName: 'Auto Rename',
      description:
        "If there's a conflict, have the Dropbox server try to autorename the file to avoid conflict.",
      defaultValue: false,
      required: false,
    }),
    allow_ownership_transfer: Property.Checkbox({
      displayName: 'Allow Ownership Transfer',
      description: 'Allows moves by owner even if it would result in an ownership transfer.',
      defaultValue: false,
      required: false,
    }),
  },
  async run(context) {
    const params = {
      from_path: context.propsValue.from_path,
      to_path: context.propsValue.to_path,
      autorename: context.propsValue.autorename,
      allow_ownership_transfer: context.propsValue.allow_ownership_transfer,
    };

    const result = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `https://api.dropboxapi.com/2/files/move_v2`,
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
