import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_task_dependents',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tasks/{task_id}/addDependents/POST`,
  _localizationGroup: 'tasks',
} satisfies TQorePartialAction;
