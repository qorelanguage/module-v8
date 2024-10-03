import { IQoreAppActionOption } from 'global/models/qore';

export interface IAttachmentInterface {
  content_type?: string;
  content_url?: string;
  deleted?: boolean;
  file_name?: string;
  height?: string;
  id?: number;
  inline?: boolean;
  malware_access_override?: boolean;
  malware_scan_result?: string;
  mapped_content_url?: string;
  size?: number;
  thumbnails?: any[];
  url?: string;
  width?: string;
  token?: string;
}

export interface IResponseAttachmentInterface {
  attachment: IAttachmentInterface;
}

export interface IAttachmentsInterface {
  attachments: IAttachmentInterface[];
  next_page: null | number;
  previous_page: null | number;
  count: number;
}

export interface IUpdateCreateattachmentInterface extends Partial<IAttachmentInterface> {}

export type TAttachmentOptions = Partial<Record<keyof IAttachmentInterface, IQoreAppActionOption>>;
