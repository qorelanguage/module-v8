import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_user',
  swagger_path: `${NOTION_SWAGGER_API_PATH}users/{id}/GET`,
  _localizationGroup: 'users',
} satisfies TQorePartialAction;
