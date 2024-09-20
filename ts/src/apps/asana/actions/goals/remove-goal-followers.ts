import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'remove_goal_followers',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/goals/{goal_id}/removeFollowers/POST`,
  _localizationGroup: 'goals',
} satisfies TQorePartialAction;
