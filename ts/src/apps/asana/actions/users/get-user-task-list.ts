import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_user_task_list',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/users/{user_id}/user_task_list/GET`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
