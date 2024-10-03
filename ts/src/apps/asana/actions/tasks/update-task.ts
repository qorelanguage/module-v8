import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_task',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tasks/{task_id}/PUT`,
  _localizationGroup: 'tasks',
} satisfies TQorePartialAction;
