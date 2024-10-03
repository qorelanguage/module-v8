import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_projects',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/DELETE`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
