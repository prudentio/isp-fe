import { mainServiceFetch } from "../base"
import type {
  NotificationRequest,
  NotificationResponse,
} from "./model"

async function sendNotification(payload: NotificationRequest) {
  const res = await mainServiceFetch<NotificationResponse>(
    "/notification",
    {
      method: "POST",
      data: payload,
    }
  )

  return res.data
}

async function getNotifications() {
  const res = await mainServiceFetch<NotificationResponse[]>(
    "/notification",
    {
      method: "GET",
    }
  )

  return res.data
}

export const NotificationService = {
  sendNotification,
  getNotifications,
}