import { TQorePartialAction } from '../../../../global/models/qore';
import { NOTION_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'append_block_children',
  swagger_path: `${NOTION_SWAGGER_API_PATH}blocks/{id}/children/PATCH`,
  _localizationGroup: 'blocks',
} satisfies TQorePartialAction;
