import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_user_to_team',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/teams/{team_id}/addUser/POST`,
  _localizationGroup: 'teams',
} satisfies TQorePartialAction;
