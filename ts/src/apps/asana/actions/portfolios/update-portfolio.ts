import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_portfolio',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/portfolios/{portfolio_id}/PUT`,
  _localizationGroup: 'portfolios',
} satisfies TQorePartialAction;
