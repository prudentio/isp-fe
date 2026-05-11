import { useEffect, useState } from "react"
import { Table, Typography } from "antd"
import { AuditLogService } from "../../service/audit-log"


const { Title } = Typography

type Audit = {
  id: string
  serviceName: string
  module: string
  action: string
  description: string
  createdBy: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null
  createdAt: string
}

export default function AuditPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(false)

  const loadAudits = async () => {
    const data = await AuditLogService.getAudits()
    return data
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const data = await loadAudits()
        setAudits(data)
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
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
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
        Audit Logs
      </Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={audits}
        loading={loading}
        pagination={{
            pageSize: 5,
        }}
      />
    </div>
  )
}