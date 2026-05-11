import { useEffect, useState } from "react"
import {
  Button,
  Table,
  Space,
  Typography,
  Modal,
  Input,
  Form,
} from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { PermissionService } from "../../service/permission"

const { Title } = Typography

type Permission = {
  id: string
  code: string
}

export default function PermissionPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [selected, setSelected] = useState<Permission | null>(null)

  const [form] = Form.useForm()

  const loadPermissions = async () => {
    const data = await PermissionService.getPermissions()
    return data
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const data = await loadPermissions()
        setPermissions(data)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const openCreate = () => {
    setMode("create")
    setSelected(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (record: Permission) => {
    setMode("edit")
    setSelected(record)
    form.setFieldsValue({ code: record.code })
    setOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    if (mode === "create") {
      await PermissionService.createPermission(values)
    } else {
      await PermissionService.updatePermission(selected!.id, values)
    }

    const data = await loadPermissions()
    setPermissions(data)

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Permission?",
      content: "This action cannot be undone",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await PermissionService.deletePermission(id)

        const data = await loadPermissions()
        setPermissions(data)
      },
    })
  }

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Permission) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => openEdit(record)}
          />

          <Button
            icon={<DeleteOutlined />}
            danger
            type="text"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          Permissions
        </Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
        >
          Create
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={permissions}
        loading={loading}
        pagination={{
            pageSize: 7,
        }}
      />

      <Modal
        open={open}
        title={mode === "create" ? "Create Permission" : "Edit Permission"}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Code wajib diisi" }]}
          >
            <Input placeholder="e.g. MAP_VIEW" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}