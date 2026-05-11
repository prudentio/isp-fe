export enum NotificationEntityEnum {
  POINT = "POINT",
  COVERAGE = "COVERAGE",
}

export enum EditEnum {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

export interface NotificationRequest {
  id: string
  entity: NotificationEntityEnum
  action?: EditEnum
}

export interface NotificationResponse {
  id: string
  description: string
  createdBy: string
  createdAt: string
}