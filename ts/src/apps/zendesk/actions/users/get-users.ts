import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_users',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}users/GET`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
