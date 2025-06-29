"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dropdown, Badge, Button, Empty, Typography, Divider } from "antd"
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { motion, AnimatePresence } from "framer-motion"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const { Text, Title } = Typography

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [visible, setVisible] = useState(false)

  // Mock notifications - replace with real data from your API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Interview Completed",
        message: "Your interview for Frontend Developer position has been completed successfully.",
        type: "success",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
      },
      {
        id: "2",
        title: "New Job Opportunity",
        message: "A new position matching your skills has been posted: Senior React Developer at TechCorp.",
        type: "info",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      },
      {
        id: "3",
        title: "Interview Reminder",
        message: "Don't forget about your upcoming interview scheduled for tomorrow at 2:00 PM.",
        type: "warning",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
      },
      {
        id: "4",
        title: "Application Status Update",
        message: "Your application for Backend Developer position has been reviewed.",
        type: "info",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
      },
    ]
    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleOutlined className="text-green-500" />
      case "warning":
        return <ExclamationCircleOutlined className="text-orange-500" />
      case "error":
        return <ExclamationCircleOutlined className="text-red-500" />
      default:
        return <ClockCircleOutlined className="text-blue-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const dropdownContent = (
    <div className="notifications-dropdown">
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <Title level={5} className="mb-0">
            Notifications
          </Title>
          {unreadCount > 0 && (
            <div className="flex gap-2">
              <Button type="link" size="small" onClick={markAllAsRead} className="text-blue-600 p-0">
                Mark all read
              </Button>
              <Button type="link" size="small" onClick={clearAll} className="text-red-600 p-0">
                Clear all
              </Button>
            </div>
          )}
        </div>
        {unreadCount > 0 && (
          <Text type="secondary" className="text-sm">
            You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Text>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`notification-item ${!notification.read ? "notification-unread" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{dayjs(notification.timestamp).fromNow()}</div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-notifications"
            >
              <div className="empty-notifications-icon">
                <BellOutlined />
              </div>
              <Title level={5} className="mb-2">
                No notifications
              </Title>
              <Text type="secondary">You're all caught up! Check back later for updates.</Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <>
          <Divider className="my-0" />
          <div className="p-3 text-center">
            <Button type="link" className="text-blue-600">
              View all notifications
            </Button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
      open={visible}
      onOpenChange={setVisible}
      overlayClassName="notification-dropdown-overlay"
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button
          icon={<BellOutlined />}
          className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400 transition-all duration-300"
          style={{
            transform: visible ? "scale(1.05)" : "scale(1)",
          }}
        />
      </Badge>
    </Dropdown>
  )
}

export default NotificationDropdown