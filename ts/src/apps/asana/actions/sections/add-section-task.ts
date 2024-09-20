import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_section_task',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/sections/{section_id}/addTask/POST`,
  _localizationGroup: 'sections',
} satisfies TQorePartialAction;
