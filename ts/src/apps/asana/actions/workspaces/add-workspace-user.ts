import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_workspace_user',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/{workspace_id}/addUser/POST`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
