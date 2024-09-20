import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_user',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}users/POST`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
