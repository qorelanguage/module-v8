import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'remove_user_from_team',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/teams/{team_id}/removeUser/POST`,
  _localizationGroup: 'teams',
} satisfies TQorePartialAction;
