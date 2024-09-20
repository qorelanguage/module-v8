import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_webhook',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/webhooks/{webhook_id}/DELETE`,
  _localizationGroup: 'webhooks',
} satisfies TQorePartialAction;
