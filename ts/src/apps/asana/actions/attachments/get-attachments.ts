import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_attachments',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/attachments/GET`,
  _localizationGroup: 'attachments',
} satisfies TQorePartialAction;
