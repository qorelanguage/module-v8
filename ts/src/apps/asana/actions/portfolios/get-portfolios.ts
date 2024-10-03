import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_portfolios',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/portfolios/GET`,
  _localizationGroup: 'portfolios',
} satisfies TQorePartialAction;
