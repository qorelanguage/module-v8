import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_user',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}users/{id}/DELETE`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
