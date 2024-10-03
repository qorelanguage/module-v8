import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_ticket',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}tickets/{id}/PUT`,
  _localizationGroup: 'tickets',
} satisfies TQorePartialAction;
