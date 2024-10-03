import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_story',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/stories/{story_id}/GET`,
  _localizationGroup: 'sections',
} satisfies TQorePartialAction;
