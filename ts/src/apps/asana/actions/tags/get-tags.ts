import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_tags',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/tags/GET`,
  _localizationGroup: 'tags',
} satisfies TQorePartialAction;
