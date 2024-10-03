import { IQoreAppActionOption } from 'global/models/qore';

export interface IUserInterface {
  active?: boolean;
  alias?: string;
  chat_only?: boolean;
  created_at?: string;
  custom_role_id?: number;
  default_group_id?: number;
  details?: string;
  email?: string;
  external_id?: string;
  iana_time_zone?: string;
  id?: number;
  last_login_at?: string;
  locale?: string;
  locale_id?: number;
  moderator?: boolean;
  name?: string;
  notes?: string;
  only_private_comments?: boolean;
  organization_id?: number;
  phone?: string;
  photo?: Record<string, any>;
  remote_photo_url?: string;
  report_csv?: boolean;
  restricted_agent?: boolean;
  role?: string;
  role_type?: number;
  shared?: boolean;
  shared_agent?: boolean;
  shared_phone_number?: boolean;
  signature?: string;
  suspended?: boolean;
  tags?: any[];
  ticket_restriction?: string;
  time_zone?: string;
  two_factor_auth_enabled?: boolean;
  updated_at?: string;
  url?: string;
  user_fields?: Record<string, any>;
  verified?: boolean;
}

export interface IResponseUserInterface {
  user: IUserInterface;
}

export interface IUsersInterface {
  users?: IUserInterface[];
  next_page?: null | number;
  previous_page?: null | number;
  count?: number;
}

export interface IUpdateCreateUserInterface extends Partial<IUserInterface> {}
export type TUserOptions = Partial<Record<keyof IUserInterface, IQoreAppActionOption>>;
