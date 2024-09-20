import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_webhooks',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/webhooks/GET`,
  _localizationGroup: 'webhooks',
} satisfies TQorePartialAction;
