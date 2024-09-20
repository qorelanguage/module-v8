import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_events',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/events/GET`,
  _localizationGroup: 'events',
} satisfies TQorePartialAction;
