import { IQoreAppActionOption } from 'global/models/qore';

export interface IOrganizationInterface {
  created_at?: string;
  details?: string;
  domain_names?: any[];
  external_id?: string;
  group_id?: number;
  id?: number;
  name?: string;
  notes?: string;
  organization_fields?: Record<string, any>;
  shared_comments?: boolean;
  shared_tickets?: boolean;
  tags?: any[];
  updated_at?: string;
  url?: string;
}

export interface IResponseOrganizationInterface {
  organization: IOrganizationInterface;
}

export interface IOrganizationsInterface {
  organizations: IOrganizationInterface[];
  next_page: null | number;
  previous_page: null | number;
  count: number;
}

export interface IUpdateCreateOrganizationInterface extends Partial<IOrganizationInterface> {}

export type TOrganizationOptions = Partial<
  Record<keyof IOrganizationInterface, IQoreAppActionOption>
>;
