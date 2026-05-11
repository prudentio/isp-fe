import { useEffect, useState } from "react"
import { Table, Typography } from "antd"
import { AuditLogService } from "../../service/audit-log"

const { Title } = Typography

type ApplicationLog = {
  id: string
  serviceName: string
  level: string
  message: string
  endpoint?: string | null
  method?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null
  createdAt: string
}
 
export default function LogPage() {
  const [logs, setLogs] = useState<ApplicationLog[]>([])
  const [loading, setLoading] = useState(false)

  const loadLogs = async () => {
    const data = await AuditLogService.getLogs()
    return data
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const data = await loadLogs()
        setLogs(data)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const columns = [
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Endpoint",
      dataIndex: "endpoint",
      key: "endpoint",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) =>
        new Date(value).toLocaleString(),
    },
    {
        title: "Metadata",
        dataIndex: "metadata",
        key: "metadata",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (value?: Record<string, any> | null) => (
            <pre
            style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 12,
            }}
            >
            {value
                ? JSON.stringify(value, null, 2)
                : "-"
            }
            </pre>
        ),
    },
  ]

  return (
    <div className="p-6 size-full">
      <Title level={3}>
        Application Logs
      </Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={logs}
        loading={loading}
        pagination={{
            pageSize: 5,
        }}
      />
    </div>
  )
}