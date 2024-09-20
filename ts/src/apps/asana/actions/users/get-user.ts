import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_user',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/users/{user_id}/GET`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
