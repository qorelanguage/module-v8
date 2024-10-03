import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_team_project',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/teams/{team_id}/projects/POST`,
  _localizationGroup: 'teams',
} satisfies TQorePartialAction;
