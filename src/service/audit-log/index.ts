import { mainServiceFetch } from "../base"
import type { ApplicationLogResponse, AuditResponse } from "./model"

async function getAudits() {
  const res = await mainServiceFetch<AuditResponse[]>(
    "/audit-log/audit",
    {
      method: "GET",
    }
  )

  return res.data
}

async function getLogs() {
  const res = await mainServiceFetch<ApplicationLogResponse[]>(
    "/audit-log/log",
    {
      method: "GET",
    }
  )

  return res.data
}

export const AuditLogService = {
  getAudits,
  getLogs
}