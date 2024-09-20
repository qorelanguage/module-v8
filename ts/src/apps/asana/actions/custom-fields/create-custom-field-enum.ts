import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_custom_field_enum',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/custom_fields/{custom_field_id}/enum_options/POST`,
  _localizationGroup: 'custom_fields',
} satisfies TQorePartialAction;
