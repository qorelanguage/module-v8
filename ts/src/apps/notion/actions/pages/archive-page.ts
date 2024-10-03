import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'archive_page',
  swagger_path: `${NOTION_SWAGGER_API_PATH}pages/{id}/PATCH`,
  _localizationGroup: 'pages',
} satisfies TQorePartialAction;
