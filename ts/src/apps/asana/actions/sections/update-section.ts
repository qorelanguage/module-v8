import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_section',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/sections/{section_id}/PUT`,
  _localizationGroup: 'sections',
} satisfies TQorePartialAction;
