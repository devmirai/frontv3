"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Tag,
  Avatar,
  Dropdown,
  DatePicker,
  Row,
  Col,
  Statistic,
} from "antd"
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  EyeOutlined,
  MoreOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { usuarioAPI, empresaAPI } from "../services/api"
import type { Usuario, Empresa } from "../types/api"
import dayjs from "dayjs"

interface UserManagementProps {
  type: "users" | "companies"
}

const UserManagement: React.FC<UserManagementProps> = ({ type }) => {
  const [data, setData] = useState<(Usuario | Empresa)[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [type])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = type === "users" ? await usuarioAPI.getAll() : await empresaAPI.getAll()
      setData(response.data)
    } catch (error) {
      message.error(`Error loading ${type}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      if (type === "users") {
        await usuarioAPI.delete(id)
      } else {
        await empresaAPI.delete(id)
      }
      message.success(`${type === "users" ? "User" : "Company"} deleted successfully`)
      loadData()
    } catch (error) {
      message.error(`Error deleting ${type === "users" ? "user" : "company"}`)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        // Update existing record
        if (type === "users") {
          await usuarioAPI.update(editingRecord.id, values)
        } else {
          await empresaAPI.update(editingRecord.id, values)
        }
        message.success(`${type === "users" ? "User" : "Company"} updated successfully`)
      } else {
        // Create new record
        if (type === "users") {
          await usuarioAPI.create(values)
        } else {
          await empresaAPI.create(values)
        }
        message.success(`${type === "users" ? "User" : "Company"} created successfully`)
      }
      setModalVisible(false)
      setEditingRecord(null)
      form.resetFields()
      loadData()
    } catch (error) {
      message.error(`Error ${editingRecord ? "updating" : "creating"} ${type === "users" ? "user" : "company"}`)
    }
  }

  const actionMenu = (record: any) => ({
    items: [
      {
        key: "view",
        label: "View Details",
        icon: <EyeOutlined />,
        onClick: () => {
          Modal.info({
            title: `${type === "users" ? "User" : "Company"} Details`,
            content: (
              <div className="space-y-4 mt-4">
                {type === "users" ? (
                  <>
                    <div>
                      <strong>Name:</strong> {record.nombre} {record.apellidoPaterno} {record.apellidoMaterno}
                    </div>
                    <div>
                      <strong>Email:</strong> {record.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {record.telefono}
                    </div>
                    <div>
                      <strong>Birth Date:</strong> {record.nacimiento}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>Company:</strong> {record.nombre}
                    </div>
                    <div>
                      <strong>Email:</strong> {record.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {record.telefono}
                    </div>
                    <div>
                      <strong>Address:</strong> {record.direccion}
                    </div>
                    <div>
                      <strong>Description:</strong> {record.descripcion}
                    </div>
                  </>
                )}
              </div>
            ),
            width: 600,
          })
        },
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: () => handleEdit(record),
      },
      {
        key: "delete",
        label: "Delete",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: `Delete ${type === "users" ? "User" : "Company"}`,
            content: `Are you sure you want to delete this ${type === "users" ? "user" : "company"}?`,
            onOk: () => handleDelete(record.id),
          })
        },
      },
    ],
  })

  const userColumns = [
    {
      title: "User",
      key: "user",
      render: (record: Usuario) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">
              {record.nombre} {record.apellidoPaterno}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Birth Date",
      dataIndex: "nacimiento",
      key: "nacimiento",
      render: (date: string) => (date ? dayjs(date).format("MMM DD, YYYY") : "N/A"),
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="success">Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Usuario) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  const companyColumns = [
    {
      title: "Company",
      key: "company",
      render: (record: Empresa) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<TeamOutlined />} />
          <div>
            <div className="font-medium">{record.nombre}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Address",
      dataIndex: "direccion",
      key: "direccion",
      ellipsis: true,
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="success">Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Empresa) => (
        <Dropdown menu={actionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  const filteredData = data.filter((item) => {
    const matchesSearch =
      type === "users"
        ? `${(item as Usuario).nombre} ${(item as Usuario).apellidoPaterno} ${item.email}`
            .toLowerCase()
            .includes(searchText.toLowerCase())
        : `${(item as Empresa).nombre} ${item.email}`.toLowerCase().includes(searchText.toLowerCase())

    return matchesSearch
  })

  const stats = [
    {
      title: type === "users" ? "Total Users" : "Total Companies",
      value: data.length,
      icon: type === "users" ? <UserOutlined /> : <TeamOutlined />,
    },
    {
      title: "Active",
      value: data.length, // All are active for now
      icon: <CheckCircleOutlined />,
    },
    {
      title: "This Month",
      value: Math.floor(data.length * 0.2), // Mock 20% growth
      icon: <ClockCircleOutlined />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card>
              <Statistic title={stat.title} value={stat.value} prefix={stat.icon} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Table */}
      <Card
        title={`${type === "users" ? "Users" : "Companies"} (${filteredData.length})`}
        extra={
          <Space>
            <Input.Search
              placeholder={`Search ${type}...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null)
                form.resetFields()
                setModalVisible(true)
              }}
            >
              Add {type === "users" ? "User" : "Company"}
            </Button>
          </Space>
        }
      >
        <Table
          columns={type === "users" ? userColumns : companyColumns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={`${editingRecord ? "Edit" : "Add"} ${type === "users" ? "User" : "Company"}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingRecord(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
          {type === "users" ? (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nombre"
                    label="First Name"
                    rules={[{ required: true, message: "Please enter first name" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="apellidoPaterno"
                    label="Last Name"
                    rules={[{ required: true, message: "Please enter last name" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="apellidoMaterno" label="Mother's Last Name">
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="telefono" label="Phone" rules={[{ required: true, message: "Please enter phone" }]}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nacimiento"
                    label="Birth Date"
                    rules={[{ required: true, message: "Please select birth date" }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
              </Row>
              {!editingRecord && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter password" }]}
                >
                  <Input.Password />
                </Form.Item>
              )}
            </>
          ) : (
            <>
              <Form.Item
                name="nombre"
                label="Company Name"
                rules={[{ required: true, message: "Please enter company name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="telefono" label="Phone" rules={[{ required: true, message: "Please enter phone" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="direccion"
                    label="Address"
                    rules={[{ required: true, message: "Please enter address" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="descripcion"
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              {!editingRecord && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter password" }]}
                >
                  <Input.Password />
                </Form.Item>
              )}
            </>
          )}

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
