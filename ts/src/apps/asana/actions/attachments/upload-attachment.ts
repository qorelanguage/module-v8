import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'upload_attachment',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/attachments/POST`,
  _localizationGroup: 'attachments',
} satisfies TQorePartialAction;