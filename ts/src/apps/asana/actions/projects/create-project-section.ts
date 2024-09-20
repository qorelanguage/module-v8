import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_project_section',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/sections/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
