import { HUBSPOT_AUTH } from './configs';
import axios from 'axios';
export const hubspotRequest = async (
  endpoint: string,
  method: string,
  body?: object,
  params?: Record<string, any>
) => {
  const uri = `https://api.hubspot.com/crm/v3${endpoint}`;
  let response: Record<string, any> | undefined;

  try {
    switch (method) {
      case 'GET':
        response = await axios.get(uri, {
          params,
          headers: {
            Authorization: `Bearer ${HUBSPOT_AUTH}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      case 'DELETE':
        response = await axios.delete(uri, {
          data: body,
          headers: {
            Authorization: `Bearer ${HUBSPOT_AUTH}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      case 'PUT':
        response = await axios.put(uri, body, {
          headers: {
            Authorization: `Bearer ${HUBSPOT_AUTH}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      case 'POST':
      default:
        response = await axios.post(uri, body, {
          headers: {
            Authorization: `Bearer ${HUBSPOT_AUTH}`,
            'Content-Type': 'application/json',
          },
        });
        break;
    }

    return response?.data || {};
  } catch (error) {
    console.error('Error with hubspot request:', error);
    throw error;
  }
};
