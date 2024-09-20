import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'set_goal_metric_value',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/goals/{goal_id}/setMetricCurrentValue/POST`,
  _localizationGroup: 'goals',
} satisfies TQorePartialAction;
