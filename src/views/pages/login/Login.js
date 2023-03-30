import React, { useState, useEffect } from 'react'
import { Form, Input, Button, notification, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

const Login = () => {
  document.title = 'Login'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loadings, setLoadings] = useState([]);
  
  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  let history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      notification.error({
        message: 'Session anda habis!',
      });
    }
  }, [location.state])

  const onFinish = async (index) => {
    enterLoading(index)
    axios.defaults.withCredentials = true;
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}account/login`, {
      username: username,
      password: password,
    }).then((response) => {
      localStorage.setItem("name", response.data.data.name);
      localStorage.setItem("id_prodi", response.data.data.id_prodi)
      localStorage.setItem("id_role", response.data.data.id_role)
      localStorage.setItem("username", response.data.data.username)
      setUsername("")
      setPassword("")
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });  
      history.push("/dashboard");
    }).catch((error) => {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.error({
        message: 'Username atau Password salah!'
      });
    });
  };

  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Harap isi semua inputan wajib!',
    });
  };

  const iconUsername = (
    <Form.Item name="prefix" noStyle>
      <CIcon icon={cilUser} />
    </Form.Item>
  );

  const iconPassword = (
    <Form.Item name="prefix" noStyle>
      <CIcon icon={cilLockLocked} />
    </Form.Item>
  );

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={() => onFinish(1)}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off">
                    <h3>Selamat Datang di Aplikasi Kerja Praktik D3 / Praktik Kerja Lapangan D4 JTK Polban</h3>
                    <p className="text-medium-emphasis">Silahkan masuk dengan akun anda</p>
                    <Form.Item
                      name="username"
                      className="mb-3"
                      rules={[{ required: true, message: 'Tolong masukan username anda!' }]}>
                      <Input
                        placeholder="Username"
                        id="username"
                        value={username}
                        addonBefore={iconUsername}
                        style={{ width: '100%' }}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      className="mb-3"
                      rules={[{ required: true, message: 'Tolong masukan password anda!' }]}>
                      <Input.Password
                        placeholder="Password"
                        id="password"
                        value={password}
                        addonBefore={iconPassword}
                        style={{ width: '100%' }}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </Form.Item>
                    <CRow>
                      <CCol xs={4}>
                        <Form.Item>
                          <Button loading={loadings[1]}type="primary" htmlType="submit" className="px-4">
                            Login
                          </Button>
                        </Form.Item>
                      </CCol>
                      <CCol xs={8} style={{textAlign:"right"}}>
                        <Tooltip placement="right" title="">
                          <p>Lupa password? Silahkan hubungi panitia sesuai dengan prodinya</p>
                        </Tooltip>
                      </CCol>
                    </CRow>
                  </Form>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
