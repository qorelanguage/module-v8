import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'insert_project_section',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/sections/insert/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
