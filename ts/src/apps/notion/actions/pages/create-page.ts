import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_page',
  swagger_path: `${NOTION_SWAGGER_API_PATH}pages/POST`,
  _localizationGroup: 'pages',
} satisfies TQorePartialAction;
