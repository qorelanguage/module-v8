import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_project',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/PUT`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
