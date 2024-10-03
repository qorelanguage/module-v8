import { TQorePartialAction } from '../../../../global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_organization',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}organizations/POST`,
  _localizationGroup: 'organizations',
} satisfies TQorePartialAction;
