import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_custom_field',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/custom_fields/POST`,
  _localizationGroup: 'custom_fields',
} satisfies TQorePartialAction;
