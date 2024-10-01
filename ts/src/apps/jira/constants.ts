import { IQoreConnectionOptions } from '../zendesk';

export const JIRA_APP_NAME = 'Jira';
export const JIRA_ALLOWED_PATHS = [
  '/rest/api/3/announcementBanner',
  '/rest/api/3/application-properties/advanced-settings',
  '/rest/api/3/field/{id}/trash',
  '/rest/api/3/workflowscheme',
  '/rest/api/3/worklog/list',
  '/rest/api/3/field/{fieldId}',
  '/rest/api/3/application-properties/{id}',
  // '/rest/api/3/field/{id}',
  '/rest/api/3/field',
  '/rest/api/3/issue/{issueId}',
  '/rest/api/3/issue/{issueId}/comment',
  '/rest/api/3/issue/{issueId}/attachments',
  '/rest/api/3/issue/{issueId}/votes',
  '/rest/api/3/issue/{issueId}/worklog',
  '/rest/api/3/project/{projectId}',
  '/rest/api/3/projectCategory',
  '/rest/api/3/version/{id}',
  '/rest/api/3/worklog/deleted',
  '/rest/api/3/workflowscheme/{id}',
  '/rest/api/3/workflowscheme/update/mappings',
];

export const JIRA_SWAGGER_API_PATH = '/rest/api/3/';

export const JIRA_CONN_OPTIONS = {
  subdomain: {
    display_name: 'Subdomain',
    short_desc: 'The subdomain for the URL',
    desc: 'The subdomain for the URL',
    type: 'string',
  },
} satisfies IQoreConnectionOptions;
