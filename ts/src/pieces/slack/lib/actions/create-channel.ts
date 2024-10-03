import { WebClient } from '@slack/web-api';
import { createAction, Property } from 'core/framework';
import { slackAuth } from '../../';
import { IActionResponse } from 'global/models/actions';

const createChannelResponseType: IActionResponse = {
  ok: {
    type: 'boolean',
    name: 'ok',
    display_name: 'Success',
    short_desc: 'Indicates if the channel was successfully created',
    desc: 'Indicates if the channel was successfully created',
    example_value: true,
  },
  channel: {
    name: 'channel',
    display_name: 'Channel',
    short_desc: 'The newly created channel',
    desc: 'The newly created channel',
    type: {
      id: {
        type: 'string',
        name: 'id',
        display_name: 'Channel ID',
        short_desc: 'The unique identifier for the channel',
        desc: 'The unique identifier for the channel',
        example_value: 'C1234567890',
      },
      name: {
        type: 'string',
        name: 'name',
        display_name: 'Channel Name',
        short_desc: 'The name of the channel',
        desc: 'The name of the channel',
        example_value: 'general',
      },
      is_channel: {
        type: 'boolean',
        name: 'is_channel',
        display_name: 'Is Channel?',
        short_desc: 'Indicates if the channel is a channel',
        desc: 'Indicates if the channel is a channel',
        example_value: true,
      },
      is_group: {
        type: 'boolean',
        name: 'is_group',
        display_name: 'Is Group?',
        short_desc: 'Indicates if the channel is a group',
        desc: 'Indicates if the channel is a group',
        example_value: false,
      },
      is_im: {
        type: 'boolean',
        name: 'is_im',
        display_name: 'Is IM?',
        short_desc: 'Indicates if the channel is an IM',
        desc: 'Indicates if the channel is an IM',
        example_value: false,
      },
      is_mpim: {
        type: 'boolean',
        name: 'is_mpim',
        display_name: 'Is MPIM?',
        short_desc: 'Indicates if the channel is an MPIM',
        desc: 'Indicates if the channel is an MPIM',
        example_value: false,
      },
      is_private: {
        type: 'boolean',
        name: 'is_private',
        display_name: 'Is Private?',
        short_desc: 'Indicates if the channel is private',
        desc: 'Indicates if the channel is private',
        example_value: false,
      },
      created: {
        type: 'number',
        name: 'created',
        display_name: 'Created',
        short_desc: 'The date the channel was created',
        desc: 'The date the channel was created',
        example_value: 1629983662,
      },
      is_archived: {
        type: 'boolean',
        name: 'is_archived',
        display_name: 'Is Archived?',
        short_desc: 'Indicates if the channel is archived',
        desc: 'Indicates if the channel is archived',
        example_value: false,
      },
      is_general: {
        type: 'boolean',
        name: 'is_general',
        display_name: 'Is General?',
        short_desc: 'Indicates if the channel is general',
        desc: 'Indicates if the channel is general',
        example_value: true,
      },
      unlinked: {
        type: 'number',
        name: 'unlinked',
        display_name: 'Unlinked',
        short_desc: 'The date the channel was unlinked',
        desc: 'The date the channel was unlinked',
        example_value: 0,
      },
      name_normalized: {
        type: 'string',
        name: 'name_normalized',
        display_name: 'Normalized Channel Name',
        short_desc: 'The normalized name of the channel',
        desc: 'The normalized name of the channel',
        example_value: 'general',
      },
      is_shared: {
        type: 'boolean',
        name: 'is_shared',
        display_name: 'Is Shared?',
        short_desc: 'Indicates if the channel is shared',
        desc: 'Indicates if the channel is shared',
        example_value: false,
      },
      is_org_shared: {
        type: 'boolean',
        name: 'is_org_shared',
        display_name: 'Is Org Shared?',
        short_desc: 'Indicates if the channel is org shared',
        desc: 'Indicates if the channel is org shared',
        example_value: false,
      },
      is_pending_ext_shared: {
        type: 'boolean',
        name: 'is_pending_ext_shared',
        display_name: 'Is Pending External Shared?',
        short_desc: 'Indicates if the channel is pending external shared',
        desc: 'Indicates if the channel is pending external shared',
        example_value: false,
      },
      pending_shared: {
        type: 'list',
        name: 'pending_shared',
        display_name: 'Pending Shared',
        short_desc: 'The pending shared channels',
        desc: 'The pending shared channels',
        example_value: [
          {
            team_id: 'T1234567890',
            date_pending: 1629983662,
          },
        ],
      },
      context_team_id: {
        type: 'string',
        name: 'context_team_id',
        display_name: 'Context Team ID',
        short_desc: 'The context team ID',
        desc: 'The context team ID',
        example_value: 'T1234567890',
      },
      pending_connected_team_ids: {
        type: 'list',
        name: 'pending_connected_team_ids',
        display_name: 'Pending Connected Team IDs',
        short_desc: 'The pending connected team IDs',
        desc: 'The pending connected team IDs',
        example_value: ['T1234567890', 'T2345678901'],
      },
      is_member: {
        type: 'boolean',
        name: 'is_member',
        display_name: 'Is Member?',
        short_desc: 'Indicates if the user is a member of the channel',
        desc: 'Indicates if the user is a member of the channel',
        example_value: true,
      },
      last_read: {
        type: 'string',
        name: 'last_read',
        display_name: 'Last Read',
        short_desc: 'The timestamp of the last read',
        desc: 'The timestamp of the last read',
        example_value: '1629983662.000000',
      },
    },
  },
};

export const createChannelAction = createAction({
  auth: slackAuth,
  name: 'slack-create-channel',
  displayName: 'Create Channel',
  description: 'Creates a new channel.',
  props: {
    channelName: Property.ShortText({
      displayName: 'Channel Name',
      required: true,
    }),
    isPrivate: Property.Checkbox({
      displayName: 'Is Private?',
      required: false,
      defaultValue: false,
    }),
  },
  responseType: createChannelResponseType,
  async run({ auth, propsValue }) {
    const client = new WebClient(auth.access_token);

    return await client.conversations.create({
      name: propsValue.channelName,
      is_private: propsValue.isPrivate,
    });
  },
});
