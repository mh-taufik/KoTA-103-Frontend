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
import { Table, Button, Row, Col, Form, Input, Modal, Space, Spin, notification } from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PengelolaanPertanyaanFeedback = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
    const [isModaleditVisible, setIsModalEditVisible] = useState(false)
    const [choose, setChoose] = useState([])
    const [namaPertanyaan, setNamaPertanyaan] = useState("");
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [dataPertanyaanFeedbackD3, setDataPertanyaanFeedbackD3] = useState([]);
    const [dataPertanyaanFeedbackD4, setDataPertanyaanFeedbackD4] = useState({});
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
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/feedback-question/get-all/${localStorage.getItem("id_prodi")}`)
            .then(result => {
                if (localStorage.getItem("id_prodi") === "0") {
                    setDataPertanyaanFeedbackD3(result.data.data)
                } else {
                    setDataPertanyaanFeedbackD4(result.data.data)
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            })
    }

    useEffect(() => {
        async function getDataPertanyaanFeedback() {

            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/feedback-question/get-all/${localStorage.getItem("id_prodi")}`)
                .then(result => {
                    if (localStorage.getItem("id_prodi") === "0") {
                        setDataPertanyaanFeedbackD3(result.data.data)
                    } else {
                        setDataPertanyaanFeedbackD4(result.data.data)
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

        getDataPertanyaanFeedback()
    }, [history]);

    const showModalCreate = (evaluasi) => {
        setIsModalCreateVisible(true);
    };

    const showModalEdit = (record) => {
        setIsModalEditVisible(true);
        setChoose(record)
    };

    const showModalDelete = (record, index) => {
        Modal.confirm({
            title: "Konfirmasi hapus pertanyaan feedback",
            okText: "Ya",
            onOk: () => {
                handleOkDelete(record, index)
            }
        })
    };

    const handleOkCreate = async (index) => {
        enterLoading(index)

        await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/feedback-question/create`, {
            question: namaPertanyaan
        }).then((response) => {
            refreshData(index);
            notification.success({
                message: 'Pertanyaan feedback berhasil dibuat'
            });
            setNamaPertanyaan("");
            setIsModalCreateVisible(false);
            form.resetFields();
        }).catch((error) => {
            setIsModalCreateVisible(false);
            setNamaPertanyaan("");
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            form.resetFields();
            notification.error({
                message: 'Pertanyaan feedback gagal dibuat!'
            });
        });
    };

    const handleOkEdit = async (index) => {
        enterLoading(index)
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/feedback-question/update/${choose.id}`, {
            question: choose.question
        }).then((response) => {
            refreshData(index);
            notification.success({
                message: 'Pertanyaan feedback berhasil diubah'
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
                message: 'Pertanyaan feedback gagal diubah!'
            });
        });
    };

    const handleOkDelete = async (record, index) => {
        enterLoading(index)
        await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/feedback-question/delete/${record.id}`).then((response) => {
            refreshData(index);
            notification.success({
                message: 'Pertanyaan feedback berhasil dihapus'
            });
        }).catch((error) => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            notification.error({
                message: 'Pertanyaan feedback gagal dihapus!'
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
            title: 'Pertanyaan Feedback',
            dataIndex: 'question',
            ...getColumnSearchProps('question', 'pertanyaan feedback'),
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
        // return (
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <Row>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <Button
                                id="create-aspek"
                                size="sm"
                                shape="round"
                                style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                onClick={() => showModalCreate(1)}>
                                Buat Pertanyaan Feedback Baru
                            </Button>
                        </Col>
                    </Row>
                    <CRow>
                        <CCol sm={12}>
                            <h6>Tabel data pertanyaan feedback perusahaan</h6>
                            <Table scroll={{x: "max-content"}} columns={columns} dataSource={localStorage.getItem("id_prodi") === "0" ? dataPertanyaanFeedbackD3 : dataPertanyaanFeedbackD4} rowKey="id" bordered />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <Modal title={`Buat Pertanyaan Feedback`}
                visible={isModalcreateVisible}
                onOk={form.submit}
                onCancel={handleCancelCreate}
                width={600}
                zIndex={9999999}
                footer={[
                    <Button key="back" onClick={handleCancelCreate}>
                        Batal
                    </Button>,
                    <Button key="submit" loading={loadings[1]} type="primary" onClick={form.submit}>
                        Simpan
                    </Button>]}>
                <Form
                    form={form}
                    name="basic"
                    wrapperCol={{ span: 24 }}
                    onFinish={() => handleOkCreate(1)}
                    autoComplete="off"
                >
                    <b>Pertanyaan Feedback<span style={{ color: "red" }}> *</span></b>
                    <Form.Item
                        name="namaPertanyaan"
                        rules={[{ required: true, message: 'Pertanyaan feedback tidak boleh kosong!' }]}
                    >
                        <Input onChange={e => setNamaPertanyaan(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Ubah Data Pertanyaan Feedback"
                visible={isModaleditVisible}
                onOk={form1.submit}
                onCancel={handleCancelEdit}
                width={600}
                zIndex={9999999}
                footer={[
                    <Button key="back" onClick={handleCancelEdit}>
                        Batal
                    </Button>,
                    <Button key="submit" loading={loadings[0]} type="primary" onClick={form1.submit}>
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
                            name: ["namaPertanyaanEdit"],
                            value: choose.question
                        },
                    ]}
                >
                    <b>Pertanyaan Feedback<span style={{ color: "red" }}> *</span></b>
                    <Form.Item
                        name="namaPertanyaanEdit"
                        rules={[{ required: true, message: 'Pertanyaan feedback tidak boleh kosong!' }]}
                    >
                        <Input onChange={e => {
                            setChoose(pre => {
                                return { ...pre, question: e.target.value }
                            })
                        }} value={choose.question} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default PengelolaanPertanyaanFeedback
