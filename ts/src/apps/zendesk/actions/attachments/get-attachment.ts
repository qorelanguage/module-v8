import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_attachment',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}attachments/{attachment_id}/GET`,
  _localizationGroup: 'attachments',
} satisfies TQorePartialAction;
