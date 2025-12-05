import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Steps } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/services';

const { Title } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [emailForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const steps = [
    { title: 'Email', icon: <MailOutlined /> },
    { title: 'Đặt lại', icon: <LockOutlined /> }
  ];

  const onFinishEmail = async (values) => {
    setLoading(true);
    try {
      await authAPI.retryPassword(values.email);
      message.success('Mã xác thực đã được gửi đến email của bạn!');
      setEmail(values.email);
      setCurrentStep(1);
    } catch (error) {
      message.error(error.message || 'Không thể gửi mã xác thực!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishReset = async (values) => {
    setLoading(true);
    try {
      await authAPI.changePassword({
        email: email,
        code: values.code,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await authAPI.retryPassword(email);
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
          Quên Mật Khẩu
        </Title>

        <Steps current={currentStep} items={steps} style={{ marginBottom: 30 }} />

        {currentStep === 0 ? (
          <Form
            form={emailForm}
            name="email"
            onFinish={onFinishEmail}
            autoComplete="off"
            layout="vertical"
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Typography.Text>
                Nhập email của bạn để nhận mã xác thực
              </Typography.Text>
            </div>

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

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                size="large"
              >
                Gửi mã xác thực
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </Form>
        ) : (
          <Form
            form={resetForm}
            name="reset"
            onFinish={onFinishReset}
            autoComplete="off"
            layout="vertical"
          >
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

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu mới"
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
                Đổi mật khẩu
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

export default ForgotPassword;
