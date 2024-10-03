import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_project_sections',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/sections/GET`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
