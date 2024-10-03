import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_task',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tasks/POST`,
  _localizationGroup: 'tasks',
} satisfies TQorePartialAction;
