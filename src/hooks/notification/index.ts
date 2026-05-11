import { create } from "zustand"

type NotificationStore = {
  version: number

  bumpVersion: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  version: 0,

  bumpVersion: () =>
    set((state) => ({
      version: state.version + 1,
    })),
}))