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
      message.error(`Error cargando ${type === "users" ? "usuarios" : "empresas"}`)
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
      message.success(`${type === "users" ? "Usuario" : "Empresa"} eliminado exitosamente`)
      loadData()
    } catch (error) {
      message.error(`Error eliminando ${type === "users" ? "usuario" : "empresa"}`)
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
        message.success(`${type === "users" ? "Usuario" : "Empresa"} actualizado exitosamente`)
      } else {
        // Create new record
        if (type === "users") {
          await usuarioAPI.create(values)
        } else {
          await empresaAPI.create(values)
        }
        message.success(`${type === "users" ? "Usuario" : "Empresa"} creado exitosamente`)
      }
      setModalVisible(false)
      setEditingRecord(null)
      form.resetFields()
      loadData()
    } catch (error) {
      message.error(`Error ${editingRecord ? "actualizando" : "creando"} ${type === "users" ? "usuario" : "empresa"}`)
    }
  }

  const actionMenu = (record: any) => ({
    items: [
      {
        key: "view",
        label: "Ver Detalles",
        icon: <EyeOutlined />,
        onClick: () => {
          Modal.info({
            title: `Detalles del ${type === "users" ? "Usuario" : "Empresa"}`,
            content: (
              <div className="space-y-4 mt-4">
                {type === "users" ? (
                  <>
                    <div>
                      <strong>Nombre:</strong> {record.nombre} {record.apellidoPaterno} {record.apellidoMaterno}
                    </div>
                    <div>
                      <strong>Email:</strong> {record.email}
                    </div>
                    <div>
                      <strong>Teléfono:</strong> {record.telefono}
                    </div>
                    <div>
                      <strong>Fecha de Nacimiento:</strong> {record.nacimiento}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>Empresa:</strong> {record.nombre}
                    </div>
                    <div>
                      <strong>Email:</strong> {record.email}
                    </div>
                    <div>
                      <strong>Teléfono:</strong> {record.telefono}
                    </div>
                    <div>
                      <strong>Dirección:</strong> {record.direccion}
                    </div>
                    <div>
                      <strong>Descripción:</strong> {record.descripcion}
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
        label: "Editar",
        icon: <EditOutlined />,
        onClick: () => handleEdit(record),
      },
      {
        key: "delete",
        label: "Eliminar",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: `Eliminar ${type === "users" ? "Usuario" : "Empresa"}`,
            content: `¿Estás seguro de que quieres eliminar este ${type === "users" ? "usuario" : "empresa"}?`,
            onOk: () => handleDelete(record.id),
          })
        },
      },
    ],
  })

  const userColumns = [
    {
      title: "Usuario",
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
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "nacimiento",
      key: "nacimiento",
      render: (date: string) => (date ? dayjs(date).format("DD [de] MMM [de] YYYY") : "N/A"),
    },
    {
      title: "Estado",
      key: "status",
      render: () => <Tag color="success">Activo</Tag>,
    },
    {
      title: "Acciones",
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
      title: "Empresa",
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
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
      ellipsis: true,
    },
    {
      title: "Estado",
      key: "status",
      render: () => <Tag color="success">Activa</Tag>,
    },
    {
      title: "Acciones",
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
      title: type === "users" ? "Total de Usuarios" : "Total de Empresas",
      value: data.length,
      icon: type === "users" ? <UserOutlined /> : <TeamOutlined />,
    },
    {
      title: "Activos",
      value: data.length, // All are active for now
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Este Mes",
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
        title={`${type === "users" ? "Usuarios" : "Empresas"} (${filteredData.length})`}
        extra={
          <Space>
            <Input.Search
              placeholder={`Buscar ${type === "users" ? "usuarios" : "empresas"}...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
              <Select.Option value="all">Todos los Estados</Select.Option>
              <Select.Option value="active">Activo</Select.Option>
              <Select.Option value="inactive">Inactivo</Select.Option>
            </Select>
            <Button icon={<ExportOutlined />}>Exportar</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null)
                form.resetFields()
                setModalVisible(true)
              }}
            >
              Agregar {type === "users" ? "Usuario" : "Empresa"}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={`${editingRecord ? "Editar" : "Agregar"} ${type === "users" ? "Usuario" : "Empresa"}`}
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
                    label="Nombre"
                    rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="apellidoPaterno"
                    label="Apellido Paterno"
                    rules={[{ required: true, message: "Por favor ingresa el apellido paterno" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="apellidoMaterno" label="Apellido Materno">
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Por favor ingresa el email" },
                  { type: "email", message: "Por favor ingresa un email válido" },
                ]}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: "Por favor ingresa el teléfono" }]}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nacimiento"
                    label="Fecha de Nacimiento"
                    rules={[{ required: true, message: "Por favor selecciona la fecha de nacimiento" }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
              </Row>
              {!editingRecord && (
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[{ required: true, message: "Por favor ingresa la contraseña" }]}
                >
                  <Input.Password />
                </Form.Item>
              )}
            </>
          ) : (
            <>
              <Form.Item
                name="nombre"
                label="Nombre de la Empresa"
                rules={[{ required: true, message: "Por favor ingresa el nombre de la empresa" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Por favor ingresa el email" },
                  { type: "email", message: "Por favor ingresa un email válido" },
                ]}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: "Por favor ingresa el teléfono" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="direccion"
                    label="Dirección"
                    rules={[{ required: true, message: "Por favor ingresa la dirección" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="descripcion"
                label="Descripción"
                rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              {!editingRecord && (
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[{ required: true, message: "Por favor ingresa la contraseña" }]}
                >
                  <Input.Password />
                </Form.Item>
              )}
            </>
          )}

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? "Actualizar" : "Crear"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
