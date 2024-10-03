import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_workspace_project',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/{workspace_id}/projects/POST`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
