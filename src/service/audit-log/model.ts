export interface AuditResponse {
  id: string;
  serviceName: string;
  module: string;
  action: string;
  description: string;
  createdBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface ApplicationLogResponse {
  id: string;
  serviceName: string;
  level: string;
  message: string;
  endpoint?: string | null;
  method?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null;
  createdAt: string;
}