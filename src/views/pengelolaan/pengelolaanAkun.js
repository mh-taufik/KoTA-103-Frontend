import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencil,
  faLock,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { Tabs, Table, Button, Row, Col, Form, Input, Modal, notification, Radio, Space, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TabPane } = Tabs;

const PengelolaanAkun = () => {
  let searchInput;
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  const [accountDosen, setAccountDosen] = useState([])
  const [accountMahasiswa, setAccountMahasiswa] = useState([])
  const [accountPerusahaan, setAccountPerusahaan] = useState([])
  const [newPassword, setNewPassword] = useState([])
  const [confirmPassword, setConfirmPassword] = useState([])
  const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [isModallockVisible, setIsModalLockVisible] = useState(false)
  const [choose, setChoose] = useState([])
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState("1")
  let history = useHistory();
  const [loadings, setLoadings] = useState([]);
  axios.defaults.withCredentials = true;

  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  const filterDataAccount = (data) => {
    setAccountDosen(data.lecturer)
    setAccountMahasiswa(data.participant)
    setAccountPerusahaan(data.company)
  }

  const refreshData = (index) => {
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-all`).then(result => {
      filterDataAccount(result.data.data)
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    })
  }

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Cari berdasarkan ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, `cari`)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, `cari`)}
            icon={<SearchOutlined />}
            size="small"
            loading={loadings[`cari`]}
            style={{ width: 90 }}
          >
            Cari
          </Button>
          <Button loading={loadings[`reset`]} onClick={() => handleReset(clearFilters, "", confirm, dataIndex, `reset`)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: text =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters();
    refreshData(index)
    setState({ searchText: '' });
    handleSearch(selectedKeys, confirm, dataIndex, index)
  };

  useEffect(() => {
    async function getDataAccount() {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-all`)
        .then(result => {
          filterDataAccount(result.data.data)
          setIsLoading(false)
        })
        .catch(function (error) {
          if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
            history.push({
              pathname: "/login",
              state: {
                session: true,
              }
            });
          } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
            history.push("/404");
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
            history.push("/500");
          }
        });
    }
    getDataAccount()
  }, [history]);

  const showModalCreate = () => {
    setIsModalCreateVisible(true);
  };

  const showModalEdit = (record) => {
    setIsModalEditVisible(true);
    setChoose(record)
  };

  const showModalLock = (record) => {
    setIsModalLockVisible(true);
    setChoose(record)
  };

  const showModalDelete = (record, index) => {
    Modal.confirm({
      title: "Konfirmasi hapus akun",
      okText: "Ya",
      onOk: () => {
        if (record.username === localStorage.getItem("username")) {
          notification.error({
            message: 'Akun tersebut sedang digunakan!'
          });
        } else {
          handleOkDelete(record.id_account, index)
        }
      }
    })
  };


  const handleOkCreate = async (index) => {
    enterLoading(index)
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}account/create`, {
      username: username,
      password: "1234",
      id_role: role,
      name: name,
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Akun berhasil dibuat'
      });
      setUsername("");
      setName("");
      setRole("");
      setIsModalCreateVisible(false);
      form.resetFields();
    }).catch((error) => {
      setIsModalCreateVisible(false);
      setUsername("");
      setName("");
      setRole("");
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      form.resetFields();
      notification.error({
        message: 'Username telah dipakai!'
      });
    });
  };

  const handleOkEdit = async (index) => {
    enterLoading(index)
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}account/update`, {
      // username: username,
      id_account: choose.id_account,
      id_role: choose.id_role,
      name: choose.name,
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Akun berhasil diubah'
      });
      setIsModalEditVisible(false);
      if (choose.username === localStorage.getItem("username")) {
        localStorage.setItem("name", choose.name)
        localStorage.setItem("id_role", choose.id_role)
      }
    }).catch((error) => {
      setIsModalEditVisible(false);
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.error({
        message: 'Username telah dipakai!'
      });
    });
  };

  const handleOkLock = async (index) => {
    enterLoading(index)
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}account/committee-change-password`, {
      id_account: choose.id_account,
      new_password: newPassword,
      confirm_new_password: confirmPassword,
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Password akun berhasil diubah'
      });
      setNewPassword("");
      setConfirmPassword("");
      setIsModalLockVisible(false);
      form2.resetFields();
    }).catch((error) => {
      setIsModalLockVisible(false);
      setNewPassword("");
      setConfirmPassword("");
      notification.error({
        message: 'Password akun gagal diubah'
      }); setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });

      form2.resetFields();
    });
  };

  const handleOkDelete = async (id, index) => {
    enterLoading(index)
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}account/delete`, {
      id_account: id,
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Akun berhasil dihapus'
      });
    }).catch((error) => {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.error({
        message: 'Akun gagal dihapus!'
      });
    });
  };

  const handleCancelCreate = () => {
    setIsModalCreateVisible(false);
  };

  const handleCancelEdit = () => {
    setIsModalEditVisible(false);
  };

  const handleCancelLock = () => {
    setIsModalLockVisible(false);
  }

  const columns = [{
    title: 'Nama',
    dataIndex: 'name',
    width: '40%',
    ...getColumnSearchProps('name', 'nama'),
  },
  {
    title: 'Username',
    dataIndex: 'username',
    width: '30%',
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    render: (text, record) =>
      <>
        <Row>
          {record.id_role === 0 || record.id_role === 3 ? (
            <>
              <Col span={9} style={{ textAlign: "right" }}>
                <Button
                  id="button-lock"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: "#FBB03B", borderColor: "#FBB03B" }}
                  onClick={() => {
                    showModalLock(record)
                  }}>
                  <FontAwesomeIcon icon={faLock} style={{ color: "black" }} />
                </Button>
              </Col>
              <Col span={6} style={{ textAlign: "center" }}>
                <Button
                  id="button-pencil"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: "#FCEE21", borderColor: "#FCEE21" }}
                  onClick={() => {
                    showModalEdit(record);
                  }}>
                  <FontAwesomeIcon icon={faPencil} style={{ color: "black" }} />
                </Button>
              </Col>
              <Col span={9} style={{ textAlign: "left" }}>
                <Button
                  id="button-trash"
                  htmlType="submit"
                  shape="circle"
                  loading={loadings[`delete-${record.id_account}`]}
                  style={{ backgroundColor: "#e9033d", borderColor: "#e9033d" }}
                  onClick={() => {
                    showModalDelete(record, `delete-${record.id_account}`)
                  }}>
                  <FontAwesomeIcon icon={faTrashCan} style={{ color: "black" }} />
                </Button>
              </Col>
            </>
          ) :
            <>
              <Col span={24} style={{ textAlign: "center" }}>
                <Button
                  id="button-lock"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: "#FBB03B", borderColor: "#FBB03B" }}
                  onClick={() => {
                    showModalLock(record)
                  }}>
                  <FontAwesomeIcon icon={faLock} style={{ color: "black" }} />
                </Button>
              </Col>
            </>}
        </Row>
      </>
  }];

  const onChange = (activeKey) => {
    setKey(activeKey)
  }

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      <CCard className="mb-4">
        <CCardBody>
          {localStorage.getItem("id_role") === "3" && key === "1" && (
            <>
              <Button
                id="create-akun"
                size="sm"
                shape="round"
                style={{ color: "white", background: "#339900", marginBottom: 16 }}
                onClick={showModalCreate}>
                Buat Akun Baru
              </Button>
            </>)}
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {accountDosen.length > 0 && (<>
                  <TabPane tab="Dosen" key="1">
                    <h6>Tabel data akun dosen</h6>
                    <Table scroll={{x: "max-content"}} columns={columns} dataSource={accountDosen} rowKey="id_account" bordered />
                  </TabPane>
                </>)}
                {accountMahasiswa.length > 0 && (<>
                  <TabPane tab="Mahasiswa" key="2">
                    <h6>Tabel data akun mahasiswa</h6>
                    <Table scroll={{x: "max-content"}} columns={columns} dataSource={accountMahasiswa} rowKey="id_account" bordered />
                  </TabPane>
                </>)}
                {accountPerusahaan.length > 0 && (<>
                  <TabPane tab="Perusahaan" key="3">
                    <h6>Tabel data akun perusahaan</h6>
                    <Table scroll={{x: "max-content"}} columns={columns} dataSource={accountPerusahaan} rowKey="id_account" bordered />
                  </TabPane>
                </>)}
              </Tabs>
            </CCol>
          </CRow>

        </CCardBody>
      </CCard>

      <Modal title="Buat Akun"
        visible={isModalcreateVisible}
        onOk={form.submit}
        onCancel={handleCancelCreate}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelCreate}>
            Batal
          </Button>,
          <Button loading={loadings[2]} key="submit" type="primary" onClick={form.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkCreate(2)}
          autoComplete="off"
        >
          <b>Name<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Nama tidak boleh kosong!' }]}
          >
            <Input onChange={e => setName(e.target.value)} />
          </Form.Item>

          <b>Username<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username tidak boleh kosong!' }]}
          >
            <Input onChange={e => setUsername(e.target.value)} />
          </Form.Item>

          <b>Role<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Role harus dipilih!' }]}
          >
            <Radio.Group>
              <Radio value="3" onClick={() => setRole(3)}>Ketua Prodi</Radio>
              <Radio value="0" onClick={() => setRole(0)}>Panitia</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Ubah Data Akun"
        visible={isModaleditVisible}
        onOk={form1.submit}
        onCancel={handleCancelEdit}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelEdit}>
            Batal
          </Button>,
          <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkEdit(1)}
          autoComplete="off"
          fields={[
            {
              name: ["nameGanti"],
              value: choose.name
            },
            {
              name: ["username"],
              value: choose.username
            },
          ]}
        >
          <b>Name<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="nameGanti"
            rules={[{ required: true, message: 'Nama tidak boleh kosong!' }]}
          >
            <Input onChange={e => {
              setChoose(pre => {
                return { ...pre, name: e.target.value }
              })
            }} value={choose.name} />
          </Form.Item>

          <b>Username<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username tidak boleh kosong!' }]}
          >
            <Input onChange={e => {
              setChoose(pre => {
                return { ...pre, username: e.target.value }
              })
            }} disabled />
          </Form.Item>

          <b>Role<span style={{ color: "red" }}> *</span></b><br></br>
          <Radio.Group
            rules={[{ required: true, message: 'Role harus dipilih!' }]}
            value={choose.id_role}
          >
            <Radio value={3} onClick={() => {
              setChoose(pre => {
                return { ...pre, id_role: 3 }
              })
            }}>Ketua Prodi</Radio>
            <Radio value={0} onClick={() => {
              setChoose(pre => {
                return { ...pre, id_role: 0 }
              })
            }}>Panitia</Radio>
          </Radio.Group>
        </Form>
      </Modal>

      <Modal title="Ganti Password"
        visible={isModallockVisible}
        onOk={form2.submit}
        onCancel={handleCancelLock}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelLock}>
            Batal
          </Button>,
          <Button loading={loadings[0]} key="submit" type="primary" onClick={form2.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form2}
          name="basic"
          onFinish={() => handleOkLock(0)}
          wrapperCol={{ span: 24 }}
        >
          <b>Password Baru<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: 'Password baru tidak boleh kosong!' }]}
          >
            <Input.Password onChange={e => setNewPassword(e.target.value)} />
          </Form.Item>

          <b>Konfirmasi Password Baru<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Konfirmasi password tidak boleh kosong!' }]}
          >
            <Input.Password onChange={e => setConfirmPassword(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PengelolaanAkun
