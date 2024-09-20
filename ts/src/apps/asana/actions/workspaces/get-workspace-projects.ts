import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_workspace_projects',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/{workspace_id}/projects/GET`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
