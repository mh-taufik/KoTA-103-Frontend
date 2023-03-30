import React, { useState, useEffect } from 'react';
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
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Button, Row, Col, Form, Input, Modal, Space, notification, Spin } from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const PengelolaanKriteriaPerusahaan = () => {
  let searchInput;
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  const [dataKriteria, setDataKriteria] = useState([])
  const [criteriaName, setCriteriaName] = useState("");
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true)
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

  const refreshData = (index) => {
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria`).then(result => {
      setDataKriteria(result.data.data)
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    })
  }

  useEffect(() => {
    async function getDataKriteriaPerusahaan() {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria`)
        .then(result => {
          setDataKriteria(result.data.data)
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
    getDataKriteriaPerusahaan()
  }, [history]);

  const showModalCreate = () => {
    setIsModalCreateVisible(true);
  };

  const showModalEdit = (record) => {
    setIsModalEditVisible(true);
    setChoose(record)
  };

  const showModalDelete = (record, index) => {
    Modal.confirm({
      title: "Konfirmasi hapus kriteria perusahaan",
      okText: "Ya",
      onOk: () => {
        handleOkDelete(record, index)
      }
    })
  };

  const handleOkCreate = async (index) => {
    enterLoading(index)
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria/create`, {
      criteria_name: criteriaName
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Kriteria perusahaan berhasil dibuat'
      });
      setCriteriaName("");
      setIsModalCreateVisible(false);
      form.resetFields();
    }).catch((error) => {
      setIsModalCreateVisible(false);
      setCriteriaName("");
      form.resetFields();
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.error({
        message: 'Kriteria telah dipakai!'
      });
    });
  };

  const handleOkEdit = async (index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria/update/${choose.id}`, {
      criteria_name: choose.criteriaName
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Kriteria berhasil diubah'
      });
      setIsModalEditVisible(false);
    }).catch((error) => {
      setIsModalEditVisible(false);
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.error({
        message: 'Kriteria telah dipakai!'
      });
    });
  };

  const handleOkDelete = async (record, index) => {
    enterLoading(index)
    await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria/delete/${record.id}`).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Kriteria berhasil dihapus'
      });
    }).catch((error) => {
      notification.error({
        message: 'Kriteria gagal dihapus!'
      });
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    });
  };

  const handleCancelCreate = () => {
    setIsModalCreateVisible(false);
  };

  const handleCancelEdit = () => {
    setIsModalEditVisible(false);
  };

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
          <Button loading={loadings[99]} onClick={() => handleReset(clearFilters, "", confirm, dataIndex, 99)} size="small" style={{ width: 90 }}>
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

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: "center",
      render: (value, item, index) => {
        return index + 1
      }
    },
    {
      title: 'Nama Kriteria',
      dataIndex: 'criteriaName',
      ...getColumnSearchProps('criteriaName', 'nama kriteria'),
    },
    {
      title: 'Aksi',
      width: '10%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) =>
        <>
          <Row>
            <Col span={12} style={{ textAlign: "center" }}>
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
            <Col span={12} style={{ textAlign: "center" }}>
              <Button
                id="button-trash"
                htmlType="submit"
                shape="circle"
                loading={loadings[`delete-${record.id}`]}
                style={{ backgroundColor: "#e9033d", borderColor: "#e9033d" }}
                onClick={() => {
                  showModalDelete(record, `delete-${record.id}`)
                }}>
                <FontAwesomeIcon icon={faTrashCan} style={{ color: "black" }} />
              </Button>
            </Col>
          </Row>
        </>
    }];

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button
                id="create-kriteria"
                size="sm"
                shape="round"
                style={{ color: "white", background: "#339900", marginBottom: 16 }}
                onClick={showModalCreate}>
                Buat Kriteria Baru
              </Button>
            </Col>
          </Row>
          <CRow>
            <CCol sm={12}>
              <h6>Tabel data kriteria perusahaan</h6>
              <Table scroll={{ x: "max-content" }} columns={columns} dataSource={dataKriteria} rowKey="id" bordered />
            </CCol>
          </CRow>

        </CCardBody>
      </CCard>

      <Modal title="Buat Kriteria Perusahaan"
        visible={isModalcreateVisible}
        onOk={form.submit}
        onCancel={handleCancelCreate}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelCreate}>
            Batal
          </Button>,
          <Button loading={loadings[0]} key="submit" type="primary" onClick={form.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkCreate(0)}
          autoComplete="off"
        >
          <b>Nama Kriteria Perusahaan<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="criteriaName"
            rules={[{ required: true, message: 'Nama kriteria tidak boleh kosong!' }]}
          >
            <Input onChange={e => setCriteriaName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Ubah Data Kriteria Perusahaan"
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
              name: ["criteriaName"],
              value: choose.criteriaName
            },
          ]}
        >
          <b>Nama Kriteria Perusahaan<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="criteriaName"
            rules={[{ required: true, message: 'Nama kriteria tidak boleh kosong!' }]}
          >
            <Input onChange={e => {
              setChoose(pre => {
                return { ...pre, criteriaName: e.target.value }
              })
            }} value={choose.criteriaName} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PengelolaanKriteriaPerusahaan
