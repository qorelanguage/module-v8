import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_webhook',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/webhooks/{webhook_id}/PUT`,
  _localizationGroup: 'webhooks',
} satisfies TQorePartialAction;
