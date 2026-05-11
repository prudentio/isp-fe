import { Button, Form, Input, Typography } from "antd"
import { useState } from "react"
import { useAuthStore } from "../hooks/auth"
import { useNavigate } from "react-router-dom"

const { Title, Text } = Typography

export default function LoginPage() {
  const auth = useAuthStore()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true)
      await auth.login(values.username, values.password)
      navigate("/map")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex">

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Title level={3}>Login</Title>
          <Text type="secondary">
            Masuk ke sistem menggunakan akun kamu
          </Text>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="mt-6"
          >
            <Form.Item
              label="Email"
              name="username"
              rules={[{ required: true, message: "Email wajib diisi" }]}
            >
              <Input placeholder="admin@webgis.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password wajib diisi" }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Login
            </Button>
          </Form>
        </div>
      </div>

      <div className="flex-1 bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white px-10">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            WebGIS System
          </h1>
          <p className="text-white/90">
            Manage spatial data, roles, and permissions in one platform
          </p>
        </div>
      </div>
    </div>
  )
}