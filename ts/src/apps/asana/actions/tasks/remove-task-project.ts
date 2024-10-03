import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'remove_task_project',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tasks/{task_id}/removeProject/POST`,
  _localizationGroup: 'tasks',
} satisfies TQorePartialAction;
