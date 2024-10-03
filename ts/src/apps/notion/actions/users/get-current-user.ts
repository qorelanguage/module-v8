import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_current_user',
  swagger_path: `${NOTION_SWAGGER_API_PATH}users/me/GET`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
