import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'save_project_as_template',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/projects/{project_id}/saveAsTemplate/POST`,
  _localizationGroup: 'projects',
} satisfies TQorePartialAction;
