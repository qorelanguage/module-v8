import { IQoreAppActionOption } from 'global/models/qore';

export interface ITicketInterface {
  allow_attachments?: boolean;
  allow_channelback?: boolean;
  assignee_email?: string;
  assignee_id?: number;
  attribute_value_ids?: any[];
  brand_id?: number;
  collaborator_ids?: any[];
  collaborators?: any[];
  comment?: Record<string, any>;
  created_at?: string;
  custom_fields?: any[];
  custom_status_id?: number;
  description?: string;
  due_at?: string;
  email_cc_ids?: any[];
  email_ccs?: Record<string, any>;
  external_id?: string;
  follower_ids?: any[];
  followers?: Record<string, any>;
  followup_ids?: any[];
  forum_topic_id?: number;
  from_messaging_channel?: boolean;
  group_id?: number;
  has_incidents?: boolean;
  ticket_id?: number;
  ids?: string;
  is_public?: boolean;
  macro_id?: number;
  macro_ids?: any[];
  metadata?: Record<string, any>;
  organization_id?: number;
  priority?: string;
  problem_id?: number;
  raw_subject?: string;
  recipient?: string;
  requester?: Record<string, any>;
  requester_id?: number;
  safe_update?: boolean;
  satisfaction_rating?: Record<string, any>;
  sharing_agreement_ids?: any[];
  status?: string;
  subject?: string;
  submitter_id?: number;
  tags?: any[];
  ticket_form_id?: number;
  type?: string;
  updated_at?: string;
  updated_stamp?: string;
  url?: string;
  via?: Record<string, any>;
  via_followup_source_id?: number;
  via_id?: number;
  voice_comment?: Record<string, any>;
}

export interface IAuditInterface {
  id?: number;
  ticket_id?: number;
  created_at?: string;
  author_id?: number;
  metadata?: Record<string, any>[];
  events?: any[][];
  via?: Record<string, any>[];
}

export interface IResponseTicketInterface {
  ticket: ITicketInterface;
  audit: IAuditInterface;
}

export interface ITicketsInterface {
  tickets: ITicketInterface[];
  next_page: null | number;
  previous_page: null | number;
  count: number;
}

export interface ITicketsCountInterface {
  refreshed_at: string;
  value: number;
}

export interface IUpdateCreateTicketInterface extends Partial<ITicketInterface> {}

export type ITicketType = 'requested' | 'ccd' | 'followed' | 'assigned' | 'recent';

export type ITicketsVariantType = 'followers' | 'collaborators' | 'email_ccs' | 'incidents';

export type TTicketsOptions = Partial<Record<keyof ITicketInterface, IQoreAppActionOption>>;
