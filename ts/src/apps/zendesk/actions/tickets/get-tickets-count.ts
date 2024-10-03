import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_ticket_count',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}tickets/count/GET`,
  _localizationGroup: 'tickets',
} satisfies TQorePartialAction;
