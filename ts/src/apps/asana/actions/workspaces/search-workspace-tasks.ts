import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'search_workspace_tasks',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/{workspace_id}/tasks/search/GET`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
