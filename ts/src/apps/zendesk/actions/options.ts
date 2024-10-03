import { IActionOptions } from 'global/models/actions';
import { IQoreAppActionOption } from 'global/models/qore';
import { L } from '../../../i18n/i18n-node';

export const groupCreateUpdate: IActionOptions = {
  created_at: {
    display_name: L.en.apps.Zendesk.actions.groups.created_at.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.created_at.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.created_at.longDesc(),
    type: 'string',
    required: true,
    example_value: '2021-09-01T00:00:00Z',
  },
  default: {
    display_name: L.en.apps.Zendesk.actions.groups.default.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.default.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.default.longDesc(),
    type: 'boolean',
    required: true,
    example_value: true,
  },
  description: {
    display_name: L.en.apps.Zendesk.actions.groups.description.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.description.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.description.longDesc(),
    type: 'string',
    required: true,
    example_value: 'Support',
  },
  deleted: {
    display_name: L.en.apps.Zendesk.actions.groups.deleted.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.deleted.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.deleted.longDesc(),
    type: 'boolean',
    required: true,
    example_value: false,
  },
  id: {
    display_name: L.en.apps.Zendesk.actions.groups.id.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.id.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.id.longDesc(),
    type: 'number',
    required: true,
    example_value: 123,
  },
  is_public: {
    display_name: L.en.apps.Zendesk.actions.groups.is_public.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.is_public.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.is_public.longDesc(),
    type: 'boolean',
    required: true,
    example_value: true,
  },
  name: {
    display_name: L.en.apps.Zendesk.actions.groups.name.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.name.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.name.longDesc(),
    type: 'string',
    required: true,
    example_value: 'Support',
  },
  updated_at: {
    display_name: L.en.apps.Zendesk.actions.groups.updated_at.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.updated_at.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.updated_at.longDesc(),
    type: 'string',
    required: true,
    example_value: '2021-09-01T00:00:00Z',
  },
  url: {
    display_name: L.en.apps.Zendesk.actions.groups.url.displayName(),
    short_desc: L.en.apps.Zendesk.actions.groups.url.shortDesc(),
    desc: L.en.apps.Zendesk.actions.groups.url.longDesc(),
    type: 'string',
    required: true,
    example_value: 'https://example.com/groups/123',
  },
};

export const organizationCreateUpdate: IActionOptions = {
  name: {
    display_name: L.en.apps.Zendesk.actions.organizations.name.displayName(),
    short_desc: L.en.apps.Zendesk.actions.organizations.name.shortDesc(),
    desc: L.en.apps.Zendesk.actions.organizations.name.longDesc(),
    type: 'string',
    required: true,
    example_value: 'Acme Corporation',
  },
};

export const userCreateUpdate: IActionOptions = {
  custom_role_id: {
    display_name: L.en.apps.Zendesk.actions.users.custom_role_id.displayName(),
    short_desc: L.en.apps.Zendesk.actions.users.custom_role_id.shortDesc(),
    desc: L.en.apps.Zendesk.actions.users.custom_role_id.longDesc(),
    type: 'number',
    required: true,
    example_value: 123,
  },
  email: {
    display_name: L.en.apps.Zendesk.actions.users.email.displayName(),
    short_desc: L.en.apps.Zendesk.actions.users.email.shortDesc(),
    desc: L.en.apps.Zendesk.actions.users.email.longDesc(),
    type: 'string',
    required: true,
    example_value: 'john@example.com',
  },
  name: {
    display_name: L.en.apps.Zendesk.actions.users.name.displayName(),
    short_desc: L.en.apps.Zendesk.actions.users.name.shortDesc(),
    desc: L.en.apps.Zendesk.actions.users.name.longDesc(),
    type: 'string',
    required: true,
    example_value: 'John Doe',
  },
  role: {
    display_name: L.en.apps.Zendesk.actions.users.role.displayName(),
    short_desc: L.en.apps.Zendesk.actions.users.role.shortDesc(),
    desc: L.en.apps.Zendesk.actions.users.role.longDesc(),
    type: 'string',
    required: true,
    example_value: 'end-user',
  },
};

export const ZendeskOptions = {
  users: {
    userCreateUpdate,
    userId: {
      display_name: L.en.apps.Zendesk.actions.users.user_id.displayName(),
      short_desc: L.en.apps.Zendesk.actions.users.user_id.shortDesc(),
      desc: L.en.apps.Zendesk.actions.users.user_id.longDesc(),
      type: 'number',
      required: true,
      example_value: 123,
    },
    count: {
      display_name: 'Count',
      short_desc: 'Count',
      desc: 'Count',
      type: 'boolean',
      required: false,
      example_value: true,
    },
    showMandyIds: {
      display_name: 'Show Many Tickets',
      short_desc: 'Show Many Tickets',
      desc: 'Show Many Tickets',
      type: 'string',
      required: false,
      example_value: '10,5,22',
    },
    type: {
      display_name: 'User Type',
      short_desc: 'User Type',
      desc: 'User Type',
      type: 'string',
      required: false,
      example_value: 'followers',
    },
  },

  attachments: {
    token: {
      display_name: L.en.apps.Zendesk.actions.attachments.token.displayName(),
      short_desc: L.en.apps.Zendesk.actions.attachments.token.shortDesc(),
      desc: L.en.apps.Zendesk.actions.attachments.token.longDesc(),
      type: 'string',
      required: true,
      example_value: '44adee',
    },
    id: {
      display_name: L.en.apps.Zendesk.actions.attachments.id.displayName(),
      short_desc: L.en.apps.Zendesk.actions.attachments.id.shortDesc(),
      desc: L.en.apps.Zendesk.actions.attachments.id.longDesc(),
      type: 'number',
      required: true,
      example_value: 123,
    },
  },

  groups: {
    groupCreateUpdate,
    id: {
      display_name: L.en.apps.Zendesk.actions.groups.id.displayName(),
      short_desc: L.en.apps.Zendesk.actions.groups.id.shortDesc(),
      desc: L.en.apps.Zendesk.actions.groups.id.longDesc(),
      type: 'number',
      required: true,
      example_value: 123,
    },
  },
  organization: {
    organizationCreateUpdate,
    organizationId: {
      display_name: 'Organization ID',
      short_desc: 'Organization ID',
      desc: 'Organization ID',
      type: 'number',
      required: true,
      example_value: 123,
    },
    count: {
      display_name: 'Count',
      short_desc: 'Count',
      desc: 'Count',
      type: 'boolean',
      required: false,
      example_value: true,
    },
  },
  tickets: {
    ticket_id: {
      display_name: L.en.apps.Zendesk.actions.tickets.ticket_id.displayName(),
      short_desc: L.en.apps.Zendesk.actions.tickets.ticket_id.shortDesc(),
      desc: L.en.apps.Zendesk.actions.tickets.ticket_id.longDesc(),
      type: 'number',
      required: true,
      example_value: 123,
    },
    count: {
      display_name: 'Count',
      short_desc: 'Count',
      desc: 'Count',
      type: 'boolean',
      required: false,
      example_value: true,
    },
    showMandyIds: {
      display_name: 'Show Many Tickets',
      short_desc: 'Show Many Tickets',
      desc: 'Show Many Tickets',
      type: 'string',
      required: false,
      example_value: '10,5,22',
    },
    type: {
      display_name: 'Ticket Type',
      short_desc: 'Ticket Type',
      desc: 'Ticket Type',
      type: 'string',
      required: false,
      example_value: 'followers',
    },
    variant: {
      display_name: 'Ticket Variant',
      short_desc: 'Ticket Variant',
      desc: 'Ticket Variant',
      type: 'string',
      required: false,
      example_value: 'followers',
    },
    onlyDeleted: {
      display_name: 'Deleted Tickets',
      short_desc: 'Deleted Tickets',
      desc: 'Show only deleted tickets?',
      type: 'boolean',
      required: false,
      example_value: true,
    },
  },
} satisfies Record<
  string,
  Record<string, IQoreAppActionOption | Record<string, IQoreAppActionOption>>
>;
