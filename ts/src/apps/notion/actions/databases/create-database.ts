import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_database',
  swagger_path: `${NOTION_SWAGGER_API_PATH}databases/POST`,
  _localizationGroup: 'databases',
} satisfies TQorePartialAction;
