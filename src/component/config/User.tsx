import { useEffect, useState } from "react"
import {
  Button,
  Table,
  Space,
  Typography,
  Modal,
  Input,
  Form,
  Select,
} from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons"

import { UserService } from "../../service/user"
import { RoleService } from "../../service/role"

import type { UserResponse } from "../../service/user/model"
import type { RoleResponse } from "../../service/role/model"

const { Title } = Typography

export default function UserPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [roles, setRoles] = useState<RoleResponse[]>([])
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [selected, setSelected] = useState<UserResponse | null>(null)

  const [form] = Form.useForm()

  const loadUsers = async () => {
    return await UserService.getUsers()
  }

  const loadRoles = async () => {
    return await RoleService.getRoles()
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const [userData, roleData] = await Promise.all([
          loadUsers(),
          loadRoles(),
        ])

        setUsers(userData)
        setRoles(roleData)
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

  const openEdit = (record: UserResponse) => {
    setMode("edit")
    setSelected(record)

    form.setFieldsValue({
      username: record.username,
      roleId: record.role.id,
    })

    setOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    // remove empty password on edit
    if (!values.password) {
      delete values.password
    }

    if (mode === "create") {
      await UserService.createUser(values)
    } else {
      await UserService.updateUser(selected!.id, values)
    }

    const data = await loadUsers()
    setUsers(data)

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete User?",
      content: "This action cannot be undone",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await UserService.deleteUser(id)
        const data = await loadUsers()
        setUsers(data)
      },
    })
  }

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      key: "role",
      render: (_: unknown, record: UserResponse) => record.role.name,
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_: unknown, record: UserResponse) =>
        record.role.permissions.map((p) => p.code).join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: UserResponse) => (
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
          Users
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
        dataSource={users}
        loading={loading}
        pagination={{
            pageSize: 7,
        }}
      />

      <Modal
        open={open}
        title={mode === "create" ? "Create User" : "Edit User"}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={mode === "create" ? [{ required: true }] : []}
          >
            <Input.Password placeholder="password (optional for edit)" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select role"
              options={roles.map((r) => ({
                label: r.name,
                value: r.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}