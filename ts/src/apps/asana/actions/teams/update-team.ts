import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_team',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/teams/PUT`,
  _localizationGroup: 'teams',
} satisfies TQorePartialAction;
