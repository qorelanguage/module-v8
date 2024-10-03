import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'search',
  swagger_path: `${NOTION_SWAGGER_API_PATH}search/POST`,
  _localizationGroup: 'search',
} satisfies TQorePartialAction;
