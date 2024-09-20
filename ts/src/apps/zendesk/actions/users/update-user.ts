import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_user',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}users/{user_id}/PUT`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
