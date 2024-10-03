import { TQorePartialAction } from 'global/models/qore';
import { ZENDESK_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_groups',
  swagger_path: `${ZENDESK_SWAGGER_API_PATH}groups/GET`,
  _localizationGroup: 'groups',
} satisfies TQorePartialAction;
