import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_ticket',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}tickets/POST`,
  _localizationGroup: 'tickets',
} satisfies TQorePartialAction;
