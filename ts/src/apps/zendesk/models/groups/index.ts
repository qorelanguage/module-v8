import { IQoreAppActionOption } from 'global/models/qore';

export interface IGroupInterface {
  created_at?: string;
  default?: boolean;
  deleted?: boolean;
  description?: string;
  id?: number;
  is_public?: boolean;
  name?: string;
  updated_at?: string;
  url?: string;
}

export interface IResponseGroupInterface {
  group: IGroupInterface;
}

export interface IGroupsInterface {
  groups: IGroupInterface[];
  next_page: null | number;
  previous_page: null | number;
  count: number;
}

export interface IUpdateCreateGroupInterface extends Partial<IGroupInterface> {}

export type TGroupsOptions = Partial<Record<keyof IGroupInterface, IQoreAppActionOption>>;
