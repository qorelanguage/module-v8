import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_workspace_memberships',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/{workspace_id}/workspace_memberships/GET`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
