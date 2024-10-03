import { QorusRequest } from '@qoretechnologies/ts-toolkit';
import { TQoreAppActionFunctionContext } from 'global/models/qore';
import { Debugger, DebugLevels } from '../../utils/Debugger';

const BasicAuth = Buffer.from(
  `${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`
).toString('base64');

export interface IZendeskContext {
  subdomain: string;
}

export const zendeskRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object,
  params?: Record<string, any>,
  options?: TQoreAppActionFunctionContext<IZendeskContext>
) => {
  const uri = `/api/v2${endpoint}`;
  const authorization = !options?.conn_opts?.token
    ? `Basic ${BasicAuth}`
    : `Bearer ${options?.conn_opts?.token}`;
  const requestMethod =
    method === 'DELETE' ? 'deleteReq' : (method.toLowerCase() as 'get' | 'post' | 'put');
  const url = `https://${options?.conn_opts?.subdomain || process.env.ZENDESK_TEST_DOMAIN}.zendesk.com`;

  try {
    Debugger.level = DebugLevels.Info;
    Debugger.info(`Zendesk request: ${authorization} ${requestMethod} ${uri}`);

    const response: Record<string, any> = await QorusRequest[requestMethod](
      {
        path: uri,
        ...(body && { data: body }),
        ...(params && { params }),
        headers: {
          Authorization: authorization,
        },
      },
      {
        url,
        endpointId: 'zendesk',
      }
    );

    Debugger.info(`Request complete: ${response}`);

    return response?.data || {};
  } catch (error) {
    console.error('Error with Zendesk request:', error);
    throw error;
  }
};
