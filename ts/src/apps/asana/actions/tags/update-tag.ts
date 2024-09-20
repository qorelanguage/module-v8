import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_tag',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tags/{tagId}/PUT`,
  _localizationGroup: 'tags',
} satisfies TQorePartialAction;
