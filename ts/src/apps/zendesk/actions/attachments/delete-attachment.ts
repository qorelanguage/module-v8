import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_attachment',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}uploads/{token}/DELETE`,
  _localizationGroup: 'attachments',
} satisfies TQorePartialAction;
