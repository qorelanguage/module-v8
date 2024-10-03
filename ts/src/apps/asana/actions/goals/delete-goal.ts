import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_goal',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/goals/{goal_id}/DELETE`,
  _localizationGroup: 'goals',
} satisfies TQorePartialAction;
