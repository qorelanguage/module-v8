import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_webhook',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/webhooks/POST`,
  _localizationGroup: 'webhooks',
} satisfies TQorePartialAction;
