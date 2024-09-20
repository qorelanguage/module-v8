import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_goal',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/goals/{goal_id}/PUT`,
  _localizationGroup: 'goals',
} satisfies TQorePartialAction;