import { Outlet, useNavigate } from "react-router-dom"
import { Layout, Menu, Dropdown, Badge, List } from "antd"
import { useAuthStore } from "../hooks/auth"
import { BellOutlined } from "@ant-design/icons"
import { menuItems } from "../constant/menuItems"
import { LogoutOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useNotificationStore } from "../hooks/notification"
import type { NotificationResponse } from "../service/notification/model"
import { NotificationService } from "../service/notification"

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const navigate = useNavigate()
  const { role } = useAuthStore()
  const logout = useAuthStore((s) => s.logout)
  const version = useNotificationStore((s) => s.version)

  const [notifications, setNotifications] = useState<NotificationResponse[]>([])

  const userPermissions = role?.permissions?.map((p) => p.code) || []

  const filteredMenu = menuItems.filter((m) =>
    userPermissions.includes(m.permission)
  )

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

    useEffect(() => {
    const load = async () => {
        const data = await NotificationService.getNotifications()
        setNotifications(data)
    }

    load()
    }, [version])


  const handleOpenNotif = async (open: boolean) => {
    if (open && notifications.length === 0) {
        const data = await NotificationService.getNotifications()
        setNotifications(data)
    }
  }

  const notifDropdown = (
    <div
      style={{
        width: 320,
        maxHeight: 400,
        overflowY: "auto",
        background: "white",
        borderRadius: 10,
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        padding: 8,
      }}
    >
      <List
        dataSource={notifications}
        locale={{ emptyText: "No notifications" }}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: "white",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {item.description}
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )

  return (
    <Layout className="h-screen">

      <Sider width={220} className="!bg-[#001529]">
        <div className="text-white p-4 font-bold">
          WebGIS
        </div>

       <Menu
        theme="dark"
        mode="inline"
        onClick={(e) => {
            if (e.key === "logout") {
            handleLogout()
            return
            }
            navigate(`/${e.key}`)
        }}
        items={[
            ...filteredMenu
            .filter((m) => !m.key.includes("map-editor"))
            .map((m) => ({
                key: m.key,
                label: m.label,
            })),

            {
            type: "divider",
            },

            {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            danger: true,
            },
        ]}
        />
      </Sider>

      <Layout>

        <Header className="bg-white flex items-center justify-between px-4">

          <div className="font-semibold">
            Dashboard
          </div>

          <Dropdown
            trigger={["click"]}
            dropdownRender={() => notifDropdown}
            onOpenChange={handleOpenNotif}
          >
            <div className="cursor-pointer">
              <Badge dot={notifications.length > 0}>
                <BellOutlined className="text-lg text-white!" />
              </Badge>
            </div>
          </Dropdown>

        </Header>

        <Content className="p-6">
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  )
}