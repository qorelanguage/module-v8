import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_organization',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}organizations/{organization_id}/DELETE`,
  _localizationGroup: 'organizations',
} satisfies TQorePartialAction;
