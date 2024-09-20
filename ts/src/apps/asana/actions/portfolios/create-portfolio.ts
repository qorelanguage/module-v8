import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_portfolio',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/portfolios/POST`,
  _localizationGroup: 'portfolios',
} satisfies TQorePartialAction;
