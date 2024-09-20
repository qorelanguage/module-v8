import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_comment',
  swagger_path: `${NOTION_SWAGGER_API_PATH}comments/POST`,
  _localizationGroup: 'comments',
} satisfies TQorePartialAction;
