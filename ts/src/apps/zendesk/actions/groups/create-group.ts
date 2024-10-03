import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_group',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}groups/POST`,
  _localizationGroup: 'groups',
} satisfies TQorePartialAction;
