import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_team_projects',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/teams/{team_id}/projects/GET`,
  _localizationGroup: 'teams',
} satisfies TQorePartialAction;
