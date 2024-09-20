import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_tag',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tags/{tagId}/DELETE`,
  _localizationGroup: 'tags',
} satisfies TQorePartialAction;
