import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'remove_project_custom_field',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/removeCustomFieldSetting/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
