import { TQorePartialAction } from '../../../../global/models/qore';
import { ASANA_SWAGGER_API_PATH } from '../../constants';

export default {
  action: 'get_job',
  swagger_path: `${ASANA_SWAGGER_API_PATH}/jobs/{job_id}/GET`,
  _localizationGroup: 'jobs',
} satisfies TQorePartialAction;
