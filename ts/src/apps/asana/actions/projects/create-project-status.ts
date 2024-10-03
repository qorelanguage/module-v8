import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_project_status',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/project_statuses/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
