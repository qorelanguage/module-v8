import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';
export default {
  action: 'get_organization',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}organizations/{organization_id}/GET`,
  _localizationGroup: 'organizations',
} satisfies TQorePartialAction;
