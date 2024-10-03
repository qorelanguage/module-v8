import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'add_portfolio_members',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/portfolios/{portfolio_id}/addMembers/POST`,
  _localizationGroup: 'portfolios',
} satisfies TQorePartialAction;
