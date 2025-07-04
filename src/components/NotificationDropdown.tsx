"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dropdown, Badge, Button, Empty, Typography, Divider, Modal, List, Avatar } from "antd"
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SettingOutlined
} from "@ant-design/icons"
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
  action?: {
    label: string
    onClick: () => void
  }
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [visible, setVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

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
        action: {
          label: "View Results",
          onClick: () => console.log("View results clicked")
        }
      },
      {
        id: "2",
        title: "New Job Opportunity",
        message: "A new position matching your skills has been posted: Senior React Developer at TechCorp.",
        type: "info",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        action: {
          label: "View Job",
          onClick: () => console.log("View job clicked")
        }
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
      {
        id: "5",
        title: "Profile Updated",
        message: "Your profile information has been successfully updated.",
        type: "success",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
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

  const getNotificationAvatar = (type: string) => {
    switch (type) {
      case "success":
        return <Avatar icon={<TrophyOutlined />} className="bg-green-500" />
      case "warning":
        return <Avatar icon={<ClockCircleOutlined />} className="bg-orange-500" />
      case "error":
        return <Avatar icon={<ExclamationCircleOutlined />} className="bg-red-500" />
      default:
        return <Avatar icon={<FileTextOutlined />} className="bg-blue-500" />
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.action) {
      notification.action.onClick()
    }
  }

  const dropdownContent = (
    <div className="notifications-dropdown w-96 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-2">
          <Title level={5} className="mb-0 text-gray-900 dark:text-gray-100">
            Notifications
          </Title>
          {unreadCount > 0 && (
            <div className="flex gap-2">
              <Button 
                type="link" 
                size="small" 
                onClick={markAllAsRead} 
                className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              >
                Mark all read
              </Button>
              <Button 
                type="link" 
                size="small" 
                onClick={clearAll} 
                className="text-red-600 hover:text-red-700 p-0 h-auto"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        {unreadCount > 0 && (
          <Text type="secondary" className="text-sm text-gray-600 dark:text-gray-400">
            You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Text>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto bg-white dark:bg-gray-800">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`notification-item cursor-pointer transition-all duration-200 ${
                  !notification.read 
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="notification-title font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {notification.title}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <div className="notification-message text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                      {notification.message}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="notification-time text-xs text-gray-500 dark:text-gray-400">
                        {dayjs(notification.timestamp).fromNow()}
                      </div>
                      {notification.action && (
                        <Button 
                          type="link" 
                          size="small" 
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            notification.action!.onClick()
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-notifications p-8 text-center"
            >
              <div className="empty-notifications-icon mb-4">
                <BellOutlined className="text-4xl text-gray-400" />
              </div>
              <Title level={5} className="mb-2 text-gray-600 dark:text-gray-400">
                No notifications
              </Title>
              <Text type="secondary" className="text-gray-500 dark:text-gray-500">
                You're all caught up! Check back later for updates.
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 5 && (
        <>
          <Divider className="my-0" />
          <div className="p-3 text-center bg-white dark:bg-gray-800">
            <Button 
              type="link" 
              className="text-blue-600 hover:text-blue-700"
              onClick={() => {
                setVisible(false)
                setModalVisible(true)
              }}
            >
              View all notifications ({notifications.length})
            </Button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
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
            className="border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-400 transition-all duration-300 w-10 h-10 flex items-center justify-center"
            style={{
              transform: visible ? "scale(1.05)" : "scale(1)",
            }}
          />
        </Badge>
      </Dropdown>

      {/* Full Notifications Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellOutlined className="text-blue-600" />
              <span>All Notifications</span>
            </div>
            {unreadCount > 0 && (
              <div className="flex gap-2">
                <Button type="link" size="small" onClick={markAllAsRead}>
                  Mark all read
                </Button>
                <Button type="link" size="small" onClick={clearAll} danger>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        className="notification-modal"
      >
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <List
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  className={`cursor-pointer transition-all duration-200 ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  actions={notification.action ? [
                    <Button 
                      type="link" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        notification.action!.onClick()
                      }}
                    >
                      {notification.action.label}
                    </Button>
                  ] : undefined}
                >
                  <List.Item.Meta
                    avatar={getNotificationAvatar(notification.type)}
                    title={
                      <div className="flex items-center gap-2">
                        <span>{notification.title}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <div className="mb-1">{notification.message}</div>
                        <Text type="secondary" className="text-xs">
                          {dayjs(notification.timestamp).fromNow()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={<BellOutlined className="text-4xl text-gray-400" />}
              description="No notifications"
            />
          )}
        </div>
      </Modal>
    </>
  )
}

export default NotificationDropdown