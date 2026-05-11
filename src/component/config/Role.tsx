import { useEffect, useState } from "react"
import {
  Button,
  Table,
  Space,
  Typography,
  Modal,
  Input,
  Form,
  Tag,
  Select,
} from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { RoleService } from "../../service/role"
import { PermissionService } from "../../service/permission"
import type { RoleResponse } from "../../service/role/model"
import type { PermissionResponse } from "../../service/permission/model"

const { Title } = Typography

export default function RolePage() {
  const [roles, setRoles] = useState<RoleResponse[]>([])
  const [permissions, setPermissions] = useState<PermissionResponse[]>([])
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [selected, setSelected] = useState<RoleResponse | null>(null)

  const [form] = Form.useForm()

  const loadRoles = async () => {
    const data = await RoleService.getRoles()
    return data
  }

  const loadPermissions = async () => {
    const data = await PermissionService.getPermissions()
    return data
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const [roleData, permissionData] = await Promise.all([
          loadRoles(),
          loadPermissions(),
        ])

        setRoles(roleData)
        setPermissions(permissionData)
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

  const openEdit = (record: RoleResponse) => {
    setMode("edit")
    setSelected(record)

    form.setFieldsValue({
      name: record.name,
      permissionIds: record.permissions.map((p) => p.id),
    })

    setOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    if (mode === "create") {
      await RoleService.createRole(values)
    } else {
      await RoleService.updateRolePermissions(
        selected!.id,
        values.permissionIds
      )
    }

    const data = await loadRoles()
    setRoles(data)

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Role?",
      content: "This action cannot be undone",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await RoleService.deleteRole(id)
        const data = await loadRoles()
        setRoles(data)
      },
    })
  }

  const columns = [
    {
      title: "Role",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_: unknown, record: RoleResponse) => (
        <div className="flex flex-wrap gap-1">
          {record.permissions.map((p) => (
            <Tag key={p.id} color="blue">
              {p.code}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: RoleResponse) => (
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
        <Title level={3} className="!mb-0">
          Roles
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
        dataSource={roles}
        loading={loading}
        pagination={{
            pageSize: 7,
        }}
      />

      <Modal
        open={open}
        title={mode === "create" ? "Create Role" : "Edit Role"}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Role Name"
            name="name"
            rules={[{ required: true, message: "Role name wajib diisi" }]}
          >
            <Input placeholder="e.g. ADMIN" />
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissionIds"
            rules={[{ required: true, message: "Pilih permission" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              options={permissions.map((p) => ({
                label: p.code,
                value: p.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}