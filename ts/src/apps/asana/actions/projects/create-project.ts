import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'create_project',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
