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
import { Table, Button, Row, Col, Form, Input, Modal, Space, notification, Tabs, Spin } from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TabPane } = Tabs;

const PengelolaanAspekPenilaianEvaluasi = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
    const [isModaleditVisible, setIsModalEditVisible] = useState(false)
    const [choose, setChoose] = useState([])
    const [evaluasi, setEvaluasi] = useState()
    const [namaAspek, setNamaAspek] = useState("");
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [dataAspekPenilaianD3, setDataAspekPenilaianD3] = useState([]);
    const [dataAspekPenilaianD4, setDataAspekPenilaianD4] = useState({});
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
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/assessment-aspect`)
            .then(result => {
                if (localStorage.getItem("id_prodi") === "0") {
                    setDataAspekPenilaianD3(result.data.data)
                } else {
                    setDataAspekPenilaianD4(result.data.data)
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            })
    }

    useEffect(() => {
        async function getDataAspekPenilaian() {

            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/assessment-aspect`)
                .then(result => {
                    if (localStorage.getItem("id_prodi") === "0") {
                        setDataAspekPenilaianD3(result.data.data)
                    } else {
                        setDataAspekPenilaianD4(result.data.data)
                    }
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

        getDataAspekPenilaian()
    }, [history]);

    const showModalCreate = (evaluasi) => {
        setEvaluasi(evaluasi)
        setIsModalCreateVisible(true);
    };

    const showModalEdit = (record) => {
        setIsModalEditVisible(true);
        setChoose(record)
    };

    const showModalDelete = (record, index) => {
        Modal.confirm({
            title: "Konfirmasi hapus aspek penilaian evaluasi",
            okText: "Ya",
            onOk: () => {
                handleOkDelete(record, index)
            }
        })
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

    const handleOkCreate = async (index) => {
        enterLoading(index)
        let form_id;
        if (evaluasi === 1) {
            if (localStorage.getItem("id_prodi") === "0") {
                form_id = 1
            } else {
                form_id = 2
            }
        } else if (evaluasi === 2) {
            form_id = 3
        } else if (evaluasi === 3) {
            form_id = 4
        }

        await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/assessment-aspect/create`, {
            aspect_name: namaAspek,
            evaluation_form_id: form_id
        }).then((response) => {
            refreshData(index);
            notification.success({
                message: 'Aspek penilaian berhasil dibuat'
            });
            setNamaAspek("");
            setIsModalCreateVisible(false);
            form.resetFields();
        }).catch((error) => {
            setIsModalCreateVisible(false);
            setNamaAspek("");
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            form.resetFields();
            notification.error({
                message: 'Aspek penilaian telah dipakai!'
            });
        });
    };

    const handleOkEdit = async (index) => {
        enterLoading(index)
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/assessment-aspect/update/${choose.id}`, {
            aspect_name: choose.aspect_name
        }).then((response) => {
            refreshData(index);
            notification.success({
                message: 'Aspek penilaian berhasil diubah'
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
                message: 'Aspek penilaian telah dipakai!'
            });
        });
    };

    const handleOkDelete = async (record, index) => {
        enterLoading(index)
        await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/assessment-aspect/delete/${record.id}`).then((response) => {
            refreshData(index);
            notification.success({
                message: 'Aspek penilaian berhasil dihapus'
            });
        }).catch((error) => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            notification.error({
                message: 'Aspek penilaian gagal dihapus!'
            });
        });
    };

    const handleCancelCreate = () => {
        setIsModalCreateVisible(false);
    };

    const handleCancelEdit = () => {
        setIsModalEditVisible(false);
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
            title: 'Nama Aspek Penilaian Evaluasi',
            dataIndex: 'aspect_name',
            ...getColumnSearchProps('aspect_name', 'nama aspek penilaian'),
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
                    {localStorage.getItem("id_prodi") === "0" ?
                        <>
                            <Row>
                                <Col span={24} style={{ textAlign: "right" }}>
                                    <Button
                                        id="create-aspek"
                                        size="sm"
                                        shape="round"
                                        style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                        onClick={() => showModalCreate(1)}>
                                        Buat Aspek Penilaian Evaluasi 1 Baru
                                    </Button>
                                </Col>
                            </Row>
                            <CRow>
                                <CCol sm={12}>
                                    <h6>Tabel data aspek evaluasi peserta KP</h6>
                                    <Table scroll={{ x: "max-content" }} columns={columns} dataSource={dataAspekPenilaianD3} rowKey="id" bordered />
                                </CCol>
                            </CRow>
                        </> :
                        <>
                            <CRow>
                                <CCol sm={12}>
                                    <Tabs type="card">
                                        <TabPane tab="Evaluasi 1" key="1">
                                            <Row>
                                                <Col span={24} style={{ textAlign: "right" }}>
                                                    <Button
                                                        id="create-aspek"
                                                        size="sm"
                                                        shape="round"
                                                        style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                        onClick={() => showModalCreate(1)}>
                                                        Buat Aspek Penilaian Evaluasi 1 Baru
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel data aspek evaluasi 1 peserta PKL</h6>
                                                    <Table scroll={{ x: "max-content" }} columns={columns} dataSource={dataAspekPenilaianD4.evaluation1} rowKey="id" bordered />
                                                </CCol>
                                            </CRow>
                                        </TabPane>
                                        <TabPane tab="Evaluasi 2" key="2">
                                            <Row>
                                                <Col span={24} style={{ textAlign: "right" }}>
                                                    <Button
                                                        id="create-aspek"
                                                        size="sm"
                                                        shape="round"
                                                        style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                        onClick={() => showModalCreate(2)}>
                                                        Buat Aspek Penilaian Evaluasi 2 Baru
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel data aspek evaluasi 2 peserta PKL</h6>
                                                    <Table scroll={{ x: "max-content" }} columns={columns} dataSource={dataAspekPenilaianD4.evaluation2} rowKey="id" bordered />
                                                </CCol>
                                            </CRow>
                                        </TabPane>
                                        <TabPane tab="Evaluasi 3" key="3">
                                            <Row>
                                                <Col span={24} style={{ textAlign: "right" }}>
                                                    <Button
                                                        id="create-aspek"
                                                        size="sm"
                                                        shape="round"
                                                        style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                        onClick={() => showModalCreate(3)}>
                                                        Buat Aspek Penilaian Evaluasi 3 Baru
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel data aspek evaluasi 3 peserta PKL</h6>
                                                    <Table scroll={{ x: "max-content" }} columns={columns} dataSource={dataAspekPenilaianD4.evaluation3} rowKey="id" bordered />
                                                </CCol>
                                            </CRow>
                                        </TabPane>
                                    </Tabs>
                                </CCol>
                            </CRow>
                        </>}
                </CCardBody>
            </CCard>

            <Modal title={`Buat Aspek Penilaian Evaluasi ${evaluasi}`}
                visible={isModalcreateVisible}
                onOk={form.submit}
                onCancel={handleCancelCreate}
                width={600}
                zIndex={9999999}
                footer={[
                    <Button key="back" onClick={handleCancelCreate}>
                        Batal
                    </Button>,
                    <Button loading={loadings[1]} key="submit" type="primary" onClick={form.submit}>
                        Simpan
                    </Button>]}>
                <Form
                    form={form}
                    name="basic"
                    wrapperCol={{ span: 24 }}
                    onFinish={() => handleOkCreate(1)}
                    autoComplete="off"
                >
                    <b>Nama Aspek Penilaian<span style={{ color: "red" }}> *</span></b>
                    <Form.Item
                        name="namaAspek"
                        rules={[{ required: true, message: 'Nama Aspek tidak boleh kosong!' }]}
                    >
                        <Input onChange={e => setNamaAspek(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Ubah Data Aspek Penilaian"
                visible={isModaleditVisible}
                onOk={form1.submit}
                onCancel={handleCancelEdit}
                width={600}
                zIndex={9999999}
                footer={[
                    <Button key="back" onClick={handleCancelEdit}>
                        Batal
                    </Button>,
                    <Button loading={loadings[0]} key="submit" type="primary" onClick={form1.submit}>
                        Simpan
                    </Button>]}>
                <Form
                    form={form1}
                    name="basic"
                    wrapperCol={{ span: 24 }}
                    onFinish={() => handleOkEdit(0)}
                    autoComplete="off"
                    fields={[
                        {
                            name: ["namaAspekEdit"],
                            value: choose.aspect_name
                        },
                    ]}
                >
                    <b>Nama Aspek Penilaian<span style={{ color: "red" }}> *</span></b>
                    <Form.Item
                        name="namaAspekEdit"
                        rules={[{ required: true, message: 'Nama aspek tidak boleh kosong!' }]}
                    >
                        <Input onChange={e => {
                            setChoose(pre => {
                                return { ...pre, aspect_name: e.target.value }
                            })
                        }} value={choose.aspect_name} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default PengelolaanAspekPenilaianEvaluasi
