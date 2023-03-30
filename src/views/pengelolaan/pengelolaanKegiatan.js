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
import moment from 'moment';
import { Tabs, Table, Button, Row, Col, Modal, notification, Form, Input, DatePicker, Select, Space, Spin, Tooltip, Alert } from 'antd';

import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { Option } = Select;
const { TabPane } = Tabs;

const { RangePicker } = DatePicker;

const PengelolaanKegiatan = () => {
  let searchInput;
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  let history = useHistory();
  const [timeline, setTimeline] = useState([])
  const [formulir, setFormulir] = useState([])
  const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
  const [isModaleditTimelineVisible, setIsModalEditTimelineVisible] = useState(false)
  const [isModaleditFormulirVisible, setIsModalEditFormulirVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [choose, setChoose] = useState([])
  const [name, setName] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [date, setDate] = useState({ start_date: "", end_date: "" });
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  axios.defaults.withCredentials = true;

  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  function onChangeDate(date, dateString) {
    date && setDate({ start_date: date[0]._d, end_date: date[1]._d })
  }
  function onChangeDateUpdate(date, dateString) {
    date && setChoose(pre => {
      return { ...pre, start_date: date[0]._d, end_date: date[1]._d }
    })
  }

  const getData = (data) => {
    for (var i = 0; i < data.length; i++) {
      data[i].start_date = new Date(data[i].start_date);
      data[i].end_date = new Date(data[i].end_date);
    }
    return data;
  }

  const refreshData = (index) => {
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/timeline`).then(result => {
      setTimeline(result.data.data)
      axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time`).then(result => {
        setFormulir(result.data.data)
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      })
    })
  }

  function handleChange(value) {
    setChoose(pre => {
      return { ...pre, id_timeline: value, description: timeline.find(item => item.id === value).description }
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

  const columnsTimeline = [{
    title: 'No',
    dataIndex: 'no',
    width: '5%',
    align: "center",
    render: (value, item, index) => {
      return index + 1
    }
  },
  {
    title: 'Nama Kegiatan',
    dataIndex: 'name',
    ...getColumnSearchProps('name', 'nama kegiatan'),
    width: '25%',
  },
  {
    title: 'Keterangan',
    dataIndex: 'description',
    ...getColumnSearchProps('description', 'keterangan'),
    width: '35%',
  },
  {
    title: 'Waktu Kegiatan',
    dataIndex: 'waktu',
    width: '25%',
    align: "center",
    render: (text, record) => {
      let start_date = new Date(record.start_date);
      let end_date = new Date(record.end_date);
      if (start_date.toLocaleDateString("en-GB", { month: 'long' }) === end_date.toLocaleDateString("en-GB", { month: 'long' })) {
        return `${start_date.toLocaleDateString("en-GB", { day: 'numeric' })} - ${end_date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}`
      } else {
        return `${start_date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })} - ${end_date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}`
      }
    }
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    align: "center",
    render: (text, record) =>
      <>
        <Row>
          <Col span={12} style={{ textAlign: "center" }}>
            <Button
              id="button-pencil"
              htmlType="submit"
              shape="circle"
              style={{ backgroundColor: "#FCEE21", borderColor: "#FCEE21" }}
              onClick={() => { showModalEditTimeline(record) }}
            >
              <FontAwesomeIcon icon={faPencil} style={{ color: "black" }} />
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "center" }}>
            {record.prodi_id === 2 ?
              <Tooltip placement="left" title="Kegiatan tidak dapat dihapus">
                <Button
                  id="button-trash"
                  htmlType="submit"
                  shape="circle"
                  disabled={record.prodi_id === 2 ? true : false}
                  loading={loadings[`delete-${record.id}`]}
                  style={{ backgroundColor: "#900427", borderColor: "#900427" }}
                  onClick={() => { showModalDelete(record, `delete-${record.id}`) }}
                >
                  <FontAwesomeIcon icon={faTrashCan} style={{ color: "black" }} />
                </Button>
              </Tooltip>
              :
              <Button
                id="button-trash"
                htmlType="submit"
                shape="circle"
                loading={loadings[`delete-${record.id}`]}
                style={{ backgroundColor: "#e9033d", borderColor: "#e9033d" }}
                onClick={() => { showModalDelete(record, `delete-${record.id}`) }}
              >
                <FontAwesomeIcon icon={faTrashCan} style={{ color: "black" }} />
              </Button>}
          </Col>
        </Row>
      </>
  }];

  const columnsFormulir = [{
    title: 'No',
    dataIndex: 'no',
    width: '5%',
    align: "center",
    render: (value, item, index) => {
      return index + 1
    }
  },
  {
    title: 'Nama Formulir',
    dataIndex: 'name',
    ...getColumnSearchProps('name', 'nama formulir'),
    width: '55%',
  },
  {
    title: 'Waktu Pengumpulan',
    dataIndex: 'waktu',
    width: '25%',
    align: "center",
    render: (text, record) => {
      let start_date = new Date(record.start_date)
      let end_date = new Date(record.end_date)
      if (start_date.toLocaleDateString("en-GB", { month: 'long' }) === end_date.toLocaleDateString("en-GB", { month: 'long' })) {
        return `${start_date.toLocaleDateString("en-GB", { day: 'numeric' })} - ${end_date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}`
      } else {
        return `${start_date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long' })} - ${end_date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}`
      }
    }
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    align: "center",
    render: (text, record) =>
      <>
        {record.prodi_id !== 2 ? (
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Button
                id="button-pencil"
                htmlType="submit"
                shape="circle"
                style={{ backgroundColor: "#FCEE21", borderColor: "#FCEE21" }}
                onClick={() => { showModalEditFormulir(record) }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: "black" }} />
              </Button>
            </Col>
          </Row>
        ) :
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Tooltip placement="left" title="Formulir tidak dapat diubah">
                <Button
                  id="button-pencil"
                  htmlType="submit"
                  shape="circle"
                  disabled={record.prodi_id === 2 ? true : false}
                  style={{ backgroundColor: "#BBB11A", borderColor: "#BBB11A" }}
                  onClick={() => { showModalEditFormulir(record) }}
                >
                  <FontAwesomeIcon icon={faPencil} style={{ color: "black" }} />
                </Button>
              </Tooltip>
            </Col>
          </Row>
        }
      </>
  }];

  const showModalCreate = () => {
    setIsModalCreateVisible(true);
  };

  const showModalEditTimeline = (record) => {
    setIsModalEditTimelineVisible(true);
    setChoose(record)
  };

  const showModalEditFormulir = (record) => {
    setIsModalEditFormulirVisible(true);
    setChoose(record)

    setChoose(pre => {
      return { ...pre, description: timeline.find(item => item.id === record.id_timeline).description }
    })
  };

  const showModalDelete = (record, index) => {
    Modal.confirm({
      title: "Konfirmasi hapus kegiatan",
      okText: "Ya",
      onOk: () => {
        if (formulir.find(item => item.id_timeline === record.id)) {
          notification.error({
            message: 'Kegiatan tersebut sedang digunakan!'
          });
        } else {
          handleOkDelete(record.id, index)
        }
      }
    })
  };

  const handleOkCreate = async (index) => {
    enterLoading(index)
    await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/timeline/create`, {
      name: name,
      start_date: moment(date.start_date).format("yyyy/MM/DD"),
      end_date: moment(date.end_date).format("yyyy/MM/DD"),
      description: keterangan,
      prodi_id: localStorage.getItem("id_prodi"),
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Kegiatan berhasil dibuat'
      });
      form.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
      setIsModalCreateVisible(false);
    }).catch((error) => {
      form.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      setIsModalCreateVisible(false);
      notification.error({
        message: 'Timeline gagal dibuat!'
      });
    });
  };

  const handleOkEditTimeline = async (index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/timeline/update/${choose.id}`, {
      name: choose.name,
      start_date: moment(choose.start_date).format("yyyy/MM/DD"),
      end_date: moment(choose.end_date).format("yyyy/MM/DD"),
      description: choose.description,
      prodi_id: choose.prodi_id,
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Kegiatan berhasil diubah'
      });
      form1.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
      setIsModalEditTimelineVisible(false);
    }).catch((error) => {
      form1.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
      setIsModalEditTimelineVisible(false);
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.error({
        message: 'Kegiatan gagal diubah!'
      });
    });
  };

  const handleOkEditFormulir = async (index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/update/${choose.id}`, {
      id_timeline: choose.id_timeline,
      day_before: choose.day_before
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Formulir berhasil diubah'
      });
      form2.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
      setChoose("");
      setIsModalEditFormulirVisible(false);
    }).catch((error) => {
      form2.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
      setChoose("");
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      setIsModalEditFormulirVisible(false);
      notification.error({
        message: 'Formulir gagal diubah!'
      });
    });
  };

  const handleOkDelete = async (id, index) => {
    enterLoading(index)
    await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/timeline/delete/${id}`, {
    }).then((response) => {
      refreshData(index);
      notification.success({
        message: 'Kegiatan berhasil dihapus'
      });
      form.resetFields();
      setDate("");
      setName("");
      setKeterangan("");
    }).catch((error) => {
      form.resetFields();
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      setDate("");
      setName("");
      setKeterangan("");
      notification.error({
        message: 'Kegiatan gagal dihapus!'
      });
    });
  };

  const handleCancelCreate = () => {
    setIsModalCreateVisible(false);
  };

  const handleCancelEditTimeline = () => {
    setIsModalEditTimelineVisible(false);
  };

  const handleCancelEditFormulir = () => {
    setIsModalEditFormulirVisible(false);
  }

  useEffect(() => {
    const getTimeline = async () => {
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/timeline`)
        .then(function (response) {
          setTimeline(response.data.data)
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
    const getFormulir = async () => {
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time`)
        .then(function (response) {
          setFormulir(response.data.data)
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
    getTimeline();
    getFormulir();
  }, [history]);

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      <div style={{ paddingBottom: "20px" }}>
        <Alert
          message="Catatan"
          description={<>
            <>1. Jika kegiatan tidak dapat dihapus maka kegiatan tersebut merupakan kegiatan KP dan PKL.</><br />
            <>2. Jika formulir tidak dapat diubah maka formulir tersebut merupakan kegiatan KP dan PKL.</><br />
            <>3. Suatu formulir tidak dapat berada pada satu kegiatan yang sama dengan formulir lainnya.</>
          </>}
          type="info"
          showIcon
          closable />
      </div>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <Tabs type="card">
                <TabPane tab="Kegiatan" key="1">
                  <CRow>
                    <CCol style={{ textAlign: "right", paddingBottom: "15px" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="px-4"
                        id="generate"
                        style={{ backgroundColor: "#339900", borderColor: "#339900" }}
                        onClick={() => { showModalCreate() }}
                      >
                        Buat Kegiatan Baru
                      </Button>
                    </CCol>
                  </CRow>
                  <h6>Tabel data kegiatan {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</h6>
                  <Table scroll={{x: "max-content"}} columns={columnsTimeline} dataSource={getData(timeline).sort((a, b) => a.start_date > b.start_date ? 1 : -1)} pagination={false} rowKey="id" bordered />
                </TabPane>
                <TabPane tab="Waktu Pengumpulan Formulir" key="2">
                  <h6>Tabel data formulir {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</h6>
                  <Table scroll={{x: "max-content"}} columns={columnsFormulir} dataSource={formulir} pagination={false} rowKey="id" bordered />
                </TabPane>
              </Tabs>
            </CCol>
          </CRow>

        </CCardBody>
      </CCard>

      <Modal title="Tambah Kegiatan"
        visible={isModalcreateVisible}
        onOk={form.submit}
        onCancel={handleCancelCreate}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelCreate}>
            Batal
          </Button>,
          <Button loading={loadings[0]} key="submit" type="primary" htmlType="submit" onClick={form.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkCreate(0)}
          autoComplete="off"
        >
          <b>Nama Kegiatan<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Nama kegiatan tidak boleh kosong!' }]}
          >
            <Input
              onChange={e => setName(e.target.value)}
            />
          </Form.Item>

          <b>Tanggal Awal dan Akhir<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="tanggal"
            rules={[{ required: true, message: 'Tanggal kegiatan tidak boleh kosong!' }]}
          >
            <RangePicker onChange={onChangeDate} style={{ width: "100%" }} value={date.start_date !== "" ? ([moment(date.start_date), moment(date.end_date)]) : null} />
          </Form.Item>

          <div style={{ paddingTop: "24px" }}>
            <b>Keterangan<span style={{ color: "red" }}> *</span></b>
            <Form.Item
              name="keterangan"
              rules={[{ required: true, message: 'Keterangan tidak boleh kosong!' }]}
            >
              <Input
                onChange={e => setKeterangan(e.target.value)}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal title="Ubah Data Kegiatan"
        visible={isModaleditTimelineVisible}
        onOk={form1.submit}
        onCancel={handleCancelEditTimeline}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelEditTimeline}>
            Batal
          </Button>,
          <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkEditTimeline(1)}
          autoComplete="off"
          fields={[
            {
              name: ["name"],
              value: choose.name
            },
            {
              name: ["keterangan"],
              value: choose.description
            }
          ]}
        >
          <b>Nama Kegiatan<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Nama kegiatan tidak boleh kosong!' }]}
          >
            <Input
              onChange={e => {
                setChoose(pre => {
                  return { ...pre, name: e.target.value }
                })
              }} value={choose.name}
            />
          </Form.Item>

          <b>Tanggal Awal dan Akhir<span style={{ color: "red" }}> *</span></b>
          <RangePicker
            onChange={onChangeDateUpdate}
            style={{ width: "100%" }}
            value={choose.start_date !== "" ? ([moment(choose.start_date), moment(choose.end_date)]) : null} />

          <div style={{ paddingTop: "24px" }}>
            <b>Keterangan<span style={{ color: "red" }}> *</span></b>
            <Form.Item
              name="keterangan"
              rules={[{ required: true, message: 'Keterangan tidak boleh kosong!' }]}
            >
              <Input
                onChange={e => {
                  setChoose(pre => {
                    return { ...pre, description: e.target.value }
                  })
                }} value={choose.description}
              />
            </Form.Item>
          </div>

        </Form>
      </Modal>

      <Modal title="Ubah Data Waktu Pengumpulan Formulir"
        visible={isModaleditFormulirVisible}
        onOk={form2.submit}
        onCancel={handleCancelEditFormulir}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelEditFormulir}>
            Batal
          </Button>,
          <Button loading={loadings[2]} key="submit" type="primary" onClick={form2.submit}>
            Simpan
          </Button>]}>
        <Form
          form={form2}
          name="basic"
          onFinish={() => handleOkEditFormulir(2)}
          wrapperCol={{ span: 24 }}
          autoComplete="off"
          fields={[
            {
              name: ["name"],
              value: choose.name
            },
            {
              name: ["kegiatanForm"],
              value: choose.description
            },
            {
              name: ["nameNotification"],
              value: choose.day_before
            }
          ]}
        >
          <b>Nama Formulir<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Nama formulir tidak boleh kosong!' }]}
          >
            <Input
              disabled
              value={choose.name}
            />
          </Form.Item>

          <b>Kegiatan<span style={{ color: "red" }}> *</span></b><br></br>
          <Form.Item
            name="kegiatanForm"
          >
            <Select value={choose.description} style={{ width: "100%" }} onChange={handleChange}>
              {timeline.filter(item => item.prodi_id === parseInt(localStorage.getItem("id_prodi"))).map((item, i) => <Option key={i} value={item.id} disabled={formulir.filter(i => i.id_timeline === item.id).length > 0}>{item.description}</Option>)}
            </Select>
          </Form.Item>

          <b>Hari sebelum waktu tutup formulir<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="nameNotification"
            rules={[{ required: true, message: 'Nama formulir tidak boleh kosong!' }]}
          >
            <Input
              onChange={e => {
                setChoose(pre => {
                  return { ...pre, day_before: e.target.value }
                })
              }} value={choose.day_before} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PengelolaanKegiatan
