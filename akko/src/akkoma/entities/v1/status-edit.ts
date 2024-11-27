import { type Status } from "./status";

export type StatusEdit = Pick<
  Status,
  | "content"
  | "spoilerText"
  | "sensitive"
  | "createdAt"
  | "account"
  | "mediaAttachments"
  | "emojis"
>;
