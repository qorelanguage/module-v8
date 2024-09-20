import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_workspace_tag',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/{workspace_id}/tags/POST`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
