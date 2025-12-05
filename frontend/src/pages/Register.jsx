import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Steps } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/services';

const { Title } = Typography;
const { Step } = Steps;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [verifyForm] = Form.useForm();

  const onFinishRegister = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      if (result.success) {
        message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        setUserId(result.data._id);
        setCurrentStep(1);
      } else {
        message.error(result.error || 'Đăng ký thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishVerify = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.checkCode({
        _id: userId,
        code: values.code
      });
      message.success('Xác thực thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Mã xác thực không đúng!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const email = form.getFieldValue('email');
      await authAPI.retryActive(email);
      message.success('Đã gửi lại mã xác thực!');
    } catch (error) {
      message.error('Không thể gửi lại mã!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        style={{ 
          width: 500, 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px'
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
          Đăng Ký
        </Title>

        <Steps current={currentStep} style={{ marginBottom: 30 }}>
          <Step title="Thông tin" icon={<UserOutlined />} />
          <Step title="Xác thực" icon={<SafetyOutlined />} />
        </Steps>

        {currentStep === 0 ? (
          <Form
            form={form}
            name="register"
            onFinish={onFinishRegister}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Họ và tên" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <span>Đã có tài khoản? </span>
              <Link to="/login">Đăng nhập ngay</Link>
            </div>
          </Form>
        ) : (
          <Form
            form={verifyForm}
            name="verify"
            onFinish={onFinishVerify}
            autoComplete="off"
            layout="vertical"
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Typography.Text>
                Vui lòng nhập mã xác thực đã được gửi đến email của bạn
              </Typography.Text>
            </div>

            <Form.Item
              name="code"
              rules={[{ required: true, message: 'Vui lòng nhập mã xác thực!' }]}
            >
              <Input 
                prefix={<SafetyOutlined />} 
                placeholder="Mã xác thực" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Xác thực
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Button type="link" onClick={handleResendCode}>
                Gửi lại mã xác thực
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Register;
