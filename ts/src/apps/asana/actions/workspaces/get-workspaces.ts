import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_workspaces',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/workspaces/GET`,
  _localizationGroup: 'workspaces',
} satisfies TQorePartialAction;
