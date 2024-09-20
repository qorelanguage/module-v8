import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_goal_parent_goals',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/goals/{goal_id}/parentGoals/GET`,
  _localizationGroup: 'goals',
} satisfies TQorePartialAction;
