import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_task_projects',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tasks/{task_id}/projects/GET`,
  _localizationGroup: 'tasks',
} satisfies TQorePartialAction;
