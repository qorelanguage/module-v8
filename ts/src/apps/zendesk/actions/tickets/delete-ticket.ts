import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_ticket',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}tickets/{id}/DELETE`,
  _localizationGroup: 'tickets',
} satisfies TQorePartialAction;
