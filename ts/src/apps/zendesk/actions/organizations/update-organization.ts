import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'update_organization',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}organizations/{organization_id}/PUT`,
  _localizationGroup: 'organizations',
} satisfies TQorePartialAction;
