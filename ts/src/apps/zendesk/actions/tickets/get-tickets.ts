import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_tickets',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}tickets/GET`,
  _localizationGroup: 'tickets',
} satisfies TQorePartialAction;
