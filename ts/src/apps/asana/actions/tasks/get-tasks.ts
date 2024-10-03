import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_tasks',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tasks/GET`,
  _localizationGroup: 'tasks',
} satisfies TQorePartialAction;
