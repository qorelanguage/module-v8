import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_team',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/teams/POST`,
  _localizationGroup: 'teams',
} satisfies TQorePartialAction;
