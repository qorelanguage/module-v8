import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_goal_followers',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/goals/{goal_id}/addFollowers/POST`,
  _localizationGroup: 'goals',
} satisfies TQorePartialAction;
