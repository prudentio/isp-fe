import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { useState } from "react"
import AuditPage from "../component/audit-log/Audit"
import LogPage from "../component/audit-log/Log"

export default function AuditLogPage() {
  const [key, setKey] = useState<string>("1")

  const onChange = (activeKey: string) => {
    setKey(activeKey)
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Audit",
    },
    {
      key: "2",
      label: "Log",
    },
  ]

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} className="flex"/>

        <div className="flex-1 min-h-0">
            {key === "1" && <AuditPage />}

            {key === "2" && <LogPage />}
        </div>
    </div>
  )
}