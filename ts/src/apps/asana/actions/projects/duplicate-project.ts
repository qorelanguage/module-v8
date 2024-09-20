import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'duplicate_project',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/duplicate/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
