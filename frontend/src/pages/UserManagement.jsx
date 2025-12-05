import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm,
  Tag,
  Layout,
  Card,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  LogoutOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/services';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const { Header, Content } = Layout;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAll({
        current: pagination.current,
        pageSize: pagination.pageSize,
        query: searchQuery
      });
      
      setUsers(response.data.result || []);
      setPagination({
        ...pagination,
        total: response.data.meta?.total || 0,
      });
    } catch (error) {
      message.error('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchUsers();
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      password: '', // Don't populate password
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await userAPI.delete(id);
      message.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng!');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        await userAPI.update({
          id: editingUser.id,
          ...values,
        });
        message.success('Cập nhật người dùng thành công!');
      } else {
        await userAPI.create(values);
        message.success('Tạo người dùng thành công!');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(error.message || 'Thao tác thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async () => {
    setLoading(true);
    try {
      await userAPI.migrateToElasticsearch();
      message.success('Migrate dữ liệu thành công!');
    } catch (error) {
      message.error('Không thể migrate dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'orange'}>
          {isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Quản Lý Người Dùng</h2>
        <Space>
          <span>Xin chào, {user?.name}</span>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Space>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <Card>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={18}>
              <Space>
                <Input.Search
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  style={{ width: 300 }}
                  enterButton={<SearchOutlined />}
                />
                <Button onClick={fetchUsers} icon={<SearchOutlined />}>
                  Làm mới
                </Button>
              </Space>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  type="default" 
                  icon={<SyncOutlined />}
                  onClick={handleMigrate}
                  loading={loading}
                >
                  Migrate ES
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Thêm mới
                </Button>
              </Space>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input disabled={!!editingUser} />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item
              name="phone"
              label="Điện thoại"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingUser ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default UserManagement;
