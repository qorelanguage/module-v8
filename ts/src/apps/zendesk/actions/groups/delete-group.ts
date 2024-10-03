import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'delete_group',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}groups/{group_id}/DELETE`,
  _localizationGroup: 'groups',
} satisfies TQorePartialAction;
