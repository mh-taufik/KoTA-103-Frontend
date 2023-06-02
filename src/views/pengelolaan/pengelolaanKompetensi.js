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
import { Tabs, Table, Button, Row, Col, Form, Input, Modal, Space, notification, Spin } from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TabPane } = Tabs;


const PengelolaanKompetensi = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    const [dataKompetensi, setDataKompetensi] = useState([])
    const [dataJobscope, setDataJobscope] = useState([])
    const [tipeKompetensi, setTipeKompetensi] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [prodi, setProdi] = useState(0);
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

    const [columns, setColumns] = useState([
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
            title: 'Nama Bahasa Pemrograman',
            dataIndex: 'name',
            ...getColumnSearchProps('name', 'nama kompetensi'),
            width: '30%',
        },
        {
            title: 'Terakhir diubah oleh',
            dataIndex: 'pic_name',
            ...getColumnSearchProps('pic_name', 'nama'),
            width: '30%',
        }]);

    const refreshData = (activeKey = 1) => {
        setProdi(activeKey)
        let daJs = [];
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : activeKey}`).then(result => setDataKompetensi(result.data.data))
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : activeKey}`).then(result => {
            result.data.data.map((item) => {
                return daJs.push({
                    id: item.id,
                    name: item.name,
                    pic_name: item.pic
                })
            })
            setDataJobscope(daJs)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        async function getDataCompetence() {
            let data = [];
            let daJs = [];
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : prodi}`)
                .then(result1 => {
                    setDataKompetensi(result1.data.data)
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : prodi}`)
                        .then(result => {
                            result.data.data.map((item) => {
                                return daJs.push({
                                    id: item.id,
                                    name: item.name,
                                    pic_name: item.pic
                                })
                            })
                            setDataJobscope(daJs)
                        })
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all-type`)
                        .then(result2 => {
                            data = result2.data.data;
                            data.push({
                                id: 0,
                                name: "Cakupan Pekerjaan",
                                description: "Cakupan Pekerjaan"
                            })
                            setIsLoading(false)
                            setTipeKompetensi(data)

                        })
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
        getDataCompetence()
    }, [history, prodi]);

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

    const [isModalcreateVisible, setIsModalCreateVisible] = useState({
        cakupanPekerjaan: false,
        bahasaPemrograman: false,
        modelling: false,
        database: false,
        frameworks: false,
        tools: false,
        bahasaKomunikasi: false,
    })
    const [isModaleditVisible, setIsModalEditVisible] = useState({
        cakupanPekerjaan: false,
        bahasaPemrograman: false,
        modelling: false,
        database: false,
        frameworks: false,
        tools: false,
        bahasaKomunikasi: false,
    })
    const [choose, setChoose] = useState([])
    const [name, setName] = useState("");
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    //   axios.defaults.withCredentials = true;

    const getCreateModal = (kompetensi) => {
        if (kompetensi === "Bahasa Pemrograman") {
            return isModalcreateVisible.bahasaPemrograman
        } else if (kompetensi === "Modelling Tools") {
            return isModalcreateVisible.modelling
        } else if (kompetensi === "Database") {
            return isModalcreateVisible.database
        } else if (kompetensi === "Frameworks") {
            return isModalcreateVisible.frameworks
        } else if (kompetensi === "Tools") {
            return isModalcreateVisible.tools
        } else if (kompetensi === "Bahasa Komunikasi") {
            return isModalcreateVisible.bahasaKomunikasi
        } else {
            return isModalcreateVisible.cakupanPekerjaan
        }
    }

    const getEditModal = (kompetensi) => {
        if (kompetensi === "Bahasa Pemrograman") {
            return isModaleditVisible.bahasaPemrograman
        } else if (kompetensi === "Modelling Tools") {
            return isModaleditVisible.modelling
        } else if (kompetensi === "Database") {
            return isModaleditVisible.database
        } else if (kompetensi === "Frameworks") {
            return isModaleditVisible.frameworks
        } else if (kompetensi === "Tools") {
            return isModaleditVisible.tools
        } else if (kompetensi === "Bahasa Komunikasi") {
            return isModaleditVisible.bahasaKomunikasi
        } else {
            return isModaleditVisible.cakupanPekerjaan
        }
    }

    const showModalCreate = (data) => {
        let kompetensi = data.name;
        if (kompetensi === "Bahasa Pemrograman") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaPemrograman: true }
            })
        } else if (kompetensi === "Modelling Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, modelling: true }
            })
        } else if (kompetensi === "Database") {
            setIsModalCreateVisible(pre => {
                return { ...pre, database: true }
            })
        } else if (kompetensi === "Frameworks") {
            setIsModalCreateVisible(pre => {
                return { ...pre, frameworks: true }
            })
        } else if (kompetensi === "Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, tools: true }
            })
        } else if (kompetensi === "Bahasa Komunikasi") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaKomunikasi: true }
            })
        } else {
            setIsModalCreateVisible(pre => {
                return { ...pre, cakupanPekerjaan: true }
            })
        }
    };

    const showModalEdit = (record) => {
        let kompetensi = record && record.type
        if (kompetensi === 1) {
            setIsModalEditVisible(pre => {
                return { ...pre, bahasaPemrograman: true }
            })
        } else if (kompetensi === 2) {
            setIsModalEditVisible(pre => {
                return { ...pre, database: true }
            })
        } else if (kompetensi === 3) {
            setIsModalEditVisible(pre => {
                return { ...pre, frameworks: true }
            })
        } else if (kompetensi === 4) {
            setIsModalEditVisible(pre => {
                return { ...pre, tools: true }
            })
        } else if (kompetensi === 5) {
            setIsModalEditVisible(pre => {
                return { ...pre, modelling: true }
            })
        } else if (kompetensi === 6) {
            setIsModalEditVisible(pre => {
                return { ...pre, bahasaKomunikasi: true }
            })
        } else {
            setIsModalEditVisible(pre => {
                return { ...pre, cakupanPekerjaan: true }
            })
        }
        setChoose(record)
    };

    const showModalDelete = (record, index) => {
        let data = record && record.type;
        let kompetensi;
        if (data === 1) {
            kompetensi = "Bahasa Pemrograman";
        } else if (data === 2) {
            kompetensi = "Database";
        } else if (data === 3) {
            kompetensi = "Frameworks";
        } else if (data === 4) {
            kompetensi = "Tools";
        } else if (data === 5) {
            kompetensi = "Modelling Tools";
        } else if (data === 6) {
            kompetensi = "Bahasa Komunikasi";
        } else {
            kompetensi = "Cakupan Pekerjaan";
        }
        Modal.confirm({
            title: `Konfirmasi hapus ${kompetensi.toLowerCase()}`,
            okText: "Ya",
            onOk: () => {
                handleOkDelete(kompetensi, record, index)
            }
        })
    };

    const handleOkCreate = async (data, index) => {
        enterLoading(index)
        let kompetensi = data.name;
        if (kompetensi === "Cakupan Pekerjaan") {
            await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/create`, {
                name: name,
                prodi_id: parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : prodi
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Cakupan Pekerjaan berhasil dibuat'
                });
                setName("");
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
            }).catch((error) => {
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setName("");
                form.resetFields();
                notification.error({
                    message: 'Cakupan Pekerjaan gagal dibuat!'
                });
            });
        } else {
            await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/create`, {
                name: name,
                id_competencetype: data.id,
                prodi_id: parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : prodi
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Kompetensi berhasil dibuat'
                });
                setName("");
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
            }).catch((error) => {
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setName("");
                form.resetFields();
                notification.error({
                    message: 'Kompetensi gagal dibuat!'
                });
            });
        }
    };

    const handleOkEdit = async (kompetensi, index) => {
        enterLoading(index)
        if (kompetensi === "Cakupan Pekerjaan") {
            await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/update/${choose.id}`, {
                name: choose.name,
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Cakupan Pekerjaan berhasil diubah'
                });
                setChoose([]);
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
            }).catch((error) => {
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setChoose([]);
                form.resetFields();
                notification.error({
                    message: 'Cakupan Pekerjaan gagal diubah!'
                });
            });
        } else {
            await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/update/${choose.id}`, {
                name: choose.name,
                id_competencetype: choose.type,
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Kompetensi berhasil diubah'
                });
                setChoose([]);
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
            }).catch((error) => {
                if (kompetensi === "Cakupan Pekerjaan") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalEditVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setChoose([]);
                form.resetFields();
                notification.error({
                    message: 'Cakupan Pekerjaan gagal diubah!'
                });
            });
        }
    };

    const handleOkDelete = async (kompetensi, choose, index) => {
        enterLoading(index)
        if (kompetensi === "Cakupan Pekerjaan") {
            await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/delete/${choose.id}`, {
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Cakupan Pekerjaan berhasil dihapus'
                });
                setChoose([]);
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
            }).catch((error) => {
                setChoose([]);
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
                notification.error({
                    message: 'Cakupan Pekerjaan gagal dihapus!'
                });
            });
        } else {
            await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/delete/${choose.id}`, {
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Kompetensi berhasil dihapus'
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setChoose([]);
                form.resetFields();
            }).catch((error) => {
                setChoose([]);
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
                notification.error({
                    message: 'Kompetensi gagal dihapus!'
                });
            });
        }
    };

    const handleCancelCreate = (kompetensi) => {
        if (kompetensi === "Cakupan Pekerjaan") {
            setIsModalCreateVisible(pre => {
                return { ...pre, cakupanPekerjaan: false }
            })
        } else if (kompetensi === "Bahasa Pemrograman") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaPemrograman: false }
            })
        } else if (kompetensi === "Modelling Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, modelling: false }
            })
        } else if (kompetensi === "Database") {
            setIsModalCreateVisible(pre => {
                return { ...pre, database: false }
            })
        } else if (kompetensi === "Frameworks") {
            setIsModalCreateVisible(pre => {
                return { ...pre, frameworks: false }
            })
        } else if (kompetensi === "Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, tools: false }
            })
        } else if (kompetensi === "Bahasa Komunikasi") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaKomunikasi: false }
            })
        }
    };

    const handleCancelEdit = (kompetensi) => {
        if (kompetensi === "Cakupan Pekerjaan") {
            setIsModalEditVisible(pre => {
                return { ...pre, cakupanPekerjaan: false }
            })
        } else if (kompetensi === "Bahasa Pemrograman") {
            setIsModalEditVisible(pre => {
                return { ...pre, bahasaPemrograman: false }
            })
        } else if (kompetensi === "Modelling Tools") {
            setIsModalEditVisible(pre => {
                return { ...pre, modelling: false }
            })
        } else if (kompetensi === "Database") {
            setIsModalEditVisible(pre => {
                return { ...pre, database: false }
            })
        } else if (kompetensi === "Frameworks") {
            setIsModalEditVisible(pre => {
                return { ...pre, frameworks: false }
            })
        } else if (kompetensi === "Tools") {
            setIsModalEditVisible(pre => {
                return { ...pre, tools: false }
            })
        } else if (kompetensi === "Bahasa Komunikasi") {
            setIsModalEditVisible(pre => {
                return { ...pre, bahasaKomunikasi: false }
            })
        }
    };

    const onChange = (activeKey) => {
        let items = columns;
        if (activeKey === "0") {
            items[1].title = "Nama Bahasa Pemrograman"
        } else if (activeKey === "1") {
            items[1].title = "Nama Database"
        } else if (activeKey === "2") {
            items[1].title = "Nama Frameworks"
        } else if (activeKey === "3") {
            items[1].title = "Nama Tools"
        } else if (activeKey === "4") {
            items[1].title = "Nama Modelling Tools"
        } else if (activeKey === "5") {
            items[1].title = "Nama Bahasa Komunikasi"
        } else if (activeKey === "6") {
            localStorage.getItem("id_role") === "1" ? items[1].title = "Nama Minat Pekerjaan" : items[1].title = "Nama Cakupan Pekerjaan"
        }
        setColumns(items)
    };

    const onChangeProdi = (activeKey) => {
       setIsLoading(true)
       refreshData(activeKey)
    };

    const getColumns = () => {
        let data = columns;
        if (localStorage.getItem("id_role") === "0" || localStorage.getItem("id_role") === "3") {
            return data.concat([
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
                }])
        } else {
            return data
        }

    }

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            {parseInt(localStorage.getItem("id_role")) !== 2 ? (
                <>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={12}>
                                    <Tabs type="card" onChange={onChange}>
                                        {tipeKompetensi.map((item, i) => (
                                            <TabPane tab={localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name} key={i}>
                                                <Row>
                                                    <Col span={24} style={{ textAlign: "right" }}>
                                                        <Button
                                                            id="create-kriteria"
                                                            size="sm"
                                                            shape="round"
                                                            style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                            onClick={() => showModalCreate(item)}>
                                                            Buat {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name} Baru
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <h6>Tabel data {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name ? item.name : item.description : item.name ? item.name : item.description}</h6>
                                                <Table scroll={{x: "max-content"}} columns={getColumns()} dataSource={item.description === "Cakupan Pekerjaan" ?
                                                    dataJobscope :
                                                    dataKompetensi.filter(data => data.type === item.id)}
                                                    rowKey="id" bordered />
                                            </TabPane>
                                        ))}
                                    </Tabs>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </>
            ) : (
                <>
                    <Tabs type="card" onChange={onChangeProdi} defaultActiveKey={prodi}>
                        <TabPane tab={"Kerja Praktik"} key={"0"}>
                            <CCard className="mb-4">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <Tabs type="card" onChange={onChange}>
                                                {tipeKompetensi.map((item, i) => (
                                                    <TabPane tab={localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name} key={i}>
                                                        <Row>
                                                            <Col span={24} style={{ textAlign: "right" }}>
                                                                <Button
                                                                    id="create-kriteria"
                                                                    size="sm"
                                                                    shape="round"
                                                                    style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                                    onClick={() => showModalCreate(item)}>
                                                                    Buat {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name} Baru
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <h6>Tabel data {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name ? item.name : item.description : item.name ? item.name : item.description}</h6>
                                                        <Table scroll={{x: "max-content"}} columns={getColumns()} dataSource={item.description === "Cakupan Pekerjaan" ?
                                                            dataJobscope :
                                                            dataKompetensi.filter(data => data.type === item.id)}
                                                            rowKey="id" bordered />
                                                    </TabPane>
                                                ))}
                                            </Tabs>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </TabPane>
                        <TabPane tab={"Praktik Kerja Lapangan"} key={"1"}>
                            <CCard className="mb-4">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <Tabs type="card" onChange={onChange}>
                                                {tipeKompetensi.map((item, i) => (
                                                    <TabPane tab={localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name} key={i}>
                                                        <Row>
                                                            <Col span={24} style={{ textAlign: "right" }}>
                                                                <Button
                                                                    id="create-kriteria"
                                                                    size="sm"
                                                                    shape="round"
                                                                    style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                                    onClick={() => showModalCreate(item)}>
                                                                    Buat {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name} Baru
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <h6>Tabel data {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name ? item.name : item.description : item.name ? item.name : item.description}</h6>
                                                        <Table scroll={{x: "max-content"}} columns={getColumns()} dataSource={item.description === "Cakupan Pekerjaan" ?
                                                            dataJobscope :
                                                            dataKompetensi.filter(data => data.type === item.id)}
                                                            rowKey="id" bordered />
                                                    </TabPane>
                                                ))}
                                            </Tabs>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </TabPane>
                    </Tabs>
                </>
            )}
            {tipeKompetensi.map((item, i) => (
                <div key={i}>
                    <Modal title={`Buat ${localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name}`}
                        visible={getCreateModal(item.name)}
                        onOk={form.submit}
                        onCancel={() => handleCancelCreate(item.name)}
                        width={600}
                        zIndex={9999999}
                        footer={[
                            <Button key="back" onClick={() => handleCancelCreate(item.name)}>
                                Batal
                            </Button>,
                            <Button loading={loadings[i]} key="submit" type="primary" onClick={form.submit}>
                                Simpan
                            </Button>
                        ]}>
                        <Form
                            form={form}
                            name="basic"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => handleOkCreate(item, i)}
                            autoComplete="off"
                        >
                            <b>Nama {localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "Minat Pekerjaan" : item.name : item.name}<span style={{ color: "red" }}> *</span></b>
                            <Form.Item
                                name={`name`}
                                rules={[{ required: true, message: `Nama ${localStorage.getItem("id_role") === "1" ? item.name === "Cakupan Pekerjaan" ? "minat pekerjaan" : item.name.toLowerCase() : item.name.toLowerCase()} tidak boleh kosong!` }]}
                            >
                                <Input onChange={e => setName(e.target.value)} />
                            </Form.Item>

                        </Form>
                    </Modal>
                    <Modal title={`Ubah Data ${item.name}`}
                        visible={getEditModal(item.name)}
                        onOk={form2.submit}
                        onCancel={() => handleCancelEdit(item.name)}
                        width={600}
                        zIndex={9999999}
                        footer={[
                            <Button key="back" onClick={() => handleCancelEdit(item.name)}>
                                Batal
                            </Button>,
                            <Button loading={loadings[tipeKompetensi.length + i]} key="submit" type="primary" onClick={form2.submit}>
                                Simpan
                            </Button>
                        ]}>
                        <Form
                            form={form2}
                            name="basic"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => handleOkEdit(item.name, tipeKompetensi.length + i)}
                            autoComplete="off"
                            fields={[
                                {
                                    name: [`nameEdit`],
                                    value: choose.name
                                }
                            ]}
                        >
                            <b>Nama {item.name}<span style={{ color: "red" }}> *</span></b>
                            <Form.Item
                                name={`nameEdit`}
                                rules={[{ required: true, message: `Nama ${item.name.toLowerCase()} tidak boleh kosong!` }]}
                            >
                                <Input onChange={e => {
                                    setChoose(pre => {
                                        return { ...pre, name: e.target.value };
                                    });
                                }} value={choose.name} />
                            </Form.Item>

                        </Form>
                    </Modal>
                </div>
            ))}
        </>
    )
}

export default PengelolaanKompetensi
