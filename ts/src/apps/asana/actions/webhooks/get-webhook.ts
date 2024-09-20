import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_webhook',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/webhooks/{webhook_id}/GET`,
  _localizationGroup: 'webhooks',
} satisfies TQorePartialAction;
