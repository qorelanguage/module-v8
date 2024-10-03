import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get-project-task-count',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/task_counts/GET`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
