import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { useState } from "react"
import PermissionPage from "../component/config/Permission"
import RolePage from "../component/config/Role"
import UserPage from "../component/config/User"

export default function ConfigPage() {
  const [key, setKey] = useState<string>("1")

  const onChange = (activeKey: string) => {
    setKey(activeKey)
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Permission",
    },
    {
      key: "2",
      label: "Role",
    },
    {
      key: "3",
      label: "User",
    },
  ]

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} className="flex"/>

      <div className="flex-1 min-h-0">
        {key === "1" && <PermissionPage />}

        {key === "2" && <RolePage />}

        {key === "3" && <UserPage />}
      </div>
    </div>
  )
}