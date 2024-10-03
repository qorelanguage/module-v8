import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'list_users',
  swagger_path: `${NOTION_SWAGGER_API_PATH}users/GET`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
