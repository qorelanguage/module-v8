import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_comments',
  swagger_path: `${NOTION_SWAGGER_API_PATH}comments/GET`,
  _localizationGroup: 'comments',
} satisfies TQorePartialAction;
