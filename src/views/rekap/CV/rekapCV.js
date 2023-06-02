import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row, Table, Tooltip, Input, Space, Tabs, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const FileDownload = require('js-file-download');
const { TabPane } = Tabs;
const RekapCV = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    let history = useHistory()
    const [status, setStatus] = useState({ check: false, x: false });
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [rekap, setRekap] = useState([])
    const [loadings, setLoadings] = useState([])
    axios.defaults.withCredentials = true;
    const changeData = (data) => {
        if (data === "check") {
            if (status.check) {
                setStatus({ check: false, x: false })
            } else if (!status.check) {
                setStatus({ check: true, x: false })
            }
        } else if (data === "x") {
            if (status.x) {
                setStatus({ check: false, x: false })
            } else if (!status.x) {
                setStatus({ check: false, x: true })
            }
        }
    }

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
                    <Button loading={loadings[`reset`]} onClick={() => handleReset(clearFilters, confirm, dataIndex, `reset`)} size="small" style={{ width: 90 }}>
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

    const handleReset = (clearFilters, confirm, dataIndex, index) => {
        enterLoading(index)
        clearFilters();
        confirm();
        setState({
            searchText: '',
            searchedColumn: dataIndex,
        });
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
        });
    };

    useEffect(() => {
        const getRecap = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv/recap`)
                .then(function (response) {
                    setRekap(response.data.data)
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
        const getCV = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv-by-committee`)
                .then(function (response) {
                    setData(response.data.data)
                    getRecap()
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
        localStorage.getItem("id_role") === "0" ? getCV() : localStorage.getItem("id_role") === "3" ? getRecap() : setIsLoading(false);
    }, [history]);

    const detailCV = (id_cv) => {
        history.push(`/CV/detailCV/${id_cv}`);
    }

    const exportPDF = async (record, index) => {
        enterLoading(index)
        axios.defaults.withCredentials = true;
        await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv/${record.id_cv}/export`, {
            responseType: 'blob',
        })
            .then((response) => {
                // notification.success({
                //     message: 'Ekspor CV berhasil',
                // });
                FileDownload(response.data, `Data CV ${record.name}`);
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            }).catch((error) => {
                // notification.error({
                //     message: 'Ekspor CV gagal'
                // });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            });
    }

    const columns = [{
        title: 'No',
        dataIndex: 'no',
        width: '5%',
        align: "center",
        render: (value, item, index) => {
            return index + 1
        }
    },
    {
        title: 'Nama mahasiswa',
        dataIndex: 'name',
        width: '55%',
        ...getColumnSearchProps('name', 'nama'),
        render: (text, record) =>
            <>
                <Row align="middle">
                    <Col >
                        {record.name}
                    </Col>
                    <Col style={{ paddingLeft: "10px" }}>
                        {record.status_cv ?
                            <Tooltip placement="right" title="Sudah mengisi formulir CV">
                                <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </Tooltip>
                            :
                            <Tooltip placement="right" title="Belum mengisi formulir CV">
                                <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white", fontSize: "11px" }}>
                                    !
                                </Button>
                            </Tooltip>
                        }

                    </Col>
                </Row>
            </>
    },
    {
        title: 'NIM',
        dataIndex: 'nim',
        ...getColumnSearchProps('nim', 'nim'),
        width: '25%',
        align: "center",
    },
    {
        title: 'Aksi',
        dataIndex: 'action',
        align: "center",
        render: (text, record) =>
            <>
                <Row>
                    <Col span={11} style={{ textAlign: "center" }}>
                        <Button
                            id="button-eye"
                            htmlType="submit"
                            shape="circle"
                            style={{ backgroundColor: "#FBB03B", borderColor: "#FBB03B" }}
                            onClick={() => detailCV(record.id_cv)}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ color: "black" }} />
                        </Button>
                    </Col>
                    <Col span={2} />
                    <Col span={11} style={{ textAlign: "left" }}>
                        <Button
                            id="button-download"
                            htmlType="submit"
                            shape="circle"
                            loading={loadings[`cv-${record.id_cv}`]}
                            style={{ backgroundColor: "#3399FF", borderColor: "#3399FF" }}
                            onClick={() => { exportPDF(record, `cv-${record.id_cv}`) }}
                        >
                            <FontAwesomeIcon icon={faDownload} style={{ color: "white" }} />
                        </Button>
                    </Col>
                </Row>
            </>
    }];

    const getPersentase = (total) => {
        return localStorage.getItem("id_role") === "3" ? localStorage.getItem("id_prodi") === "0" ? ((total / 61) * 100).toFixed(2) : ((total / 27) * 100).toFixed(2) : ((total / data.cv.length) * 100).toFixed(2)
    }

    const columnsKompetensi = {
        MinatPekerjaan: [
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
                title: 'Nama Minat Pekerjaan',
                dataIndex: 'name',
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Pekerjaan Yang Diminati',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ],
        BahasaPemrograman: [
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
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Bahasa Pemrograman Yang Dikuasai',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ],
        Database: [
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
                title: 'Nama Database',
                dataIndex: 'name',
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Database Yang Dikuasai',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ],
        Frameworks: [
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
                title: 'Nama Frameworks',
                dataIndex: 'name',
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Frameworks Yang Dikuasai',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ],
        Tools: [
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
                title: 'Nama Tools',
                dataIndex: 'name',
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Tools Yang Dikuasai',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ],
        Modelling: [
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
                title: 'Nama Modelling Tools',
                dataIndex: 'name',
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Modelling Tools Yang Dikuasai',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ],
        BahasaKomunikasi: [
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
                title: 'Nama Bahasa Komunikasi',
                dataIndex: 'name',
                width: '25%',
                align: "center",
            },
            {
                title: 'Total',
                dataIndex: 'total',
                width: '25%',
                align: "center",
            },
            {
                title: 'Persentase Bahasa Komunikasi Yang Dikuasai',
                dataIndex: 'persentase',
                width: '25%',
                align: "center",
                render: (value, item, index) =>
                    <>
                        {getPersentase(item.total)}%
                    </>
            }
        ]

    };
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            {localStorage.getItem("id_role") === "0" ? (
                <>
                    <Tabs type="card">
                        <TabPane tab="Data Mahasiswa" key="1">
                            <CCard className="mb-4" style={{ padding: "20px" }}>
                                <CRow>
                                    <CCol sm={6}>
                                        <CCard className='mb-4' id="card-filter" onClick={() => changeData("check")} style={status.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                            <CCardBody>
                                                <Row justify="space-around" align="middle">
                                                    <Col span={6}>
                                                        <Button type="primary" shape="circle" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", width: "60px", height: "60px", fontSize: "30px" }}>
                                                            <FontAwesomeIcon style={{ paddingTop: "10px" }} icon={faCheck} />
                                                        </Button>
                                                    </Col>
                                                    <Col span={18} style={{ paddingTop: "10px" }}>
                                                        <h6>Sudah Mengisi Formulir CV</h6>
                                                        <h5 style={{ color: "#339900" }}>{data.total_submitted} Mahasiswa</h5>
                                                    </Col>
                                                </Row>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol sm={6}>
                                        <CCard className='mb-4' id="card-filter" onClick={() => changeData("x")} style={status.x === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                            <CCardBody>
                                                <Row justify="space-around" align="middle">
                                                    <Col span={6}>
                                                        <Button type="primary" shape="circle" style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white", width: "60px", height: "60px", fontSize: "30px" }}>
                                                            !
                                                        </Button>
                                                    </Col>
                                                    <Col span={18} style={{ paddingTop: "10px" }}>
                                                        <h6>Belum Mengisi Formulir CV</h6>
                                                        <h5 style={{ color: "#CC0033" }}>{data.total_not_submitted} Mahasiswa</h5>
                                                    </Col>
                                                </Row>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <CCard className="mb-4">
                                    <CCardBody>
                                        <CRow>
                                            <CCol sm={12}>
                                                <h6>Tabel data mahasiswa</h6>
                                                <Table
                                                    scroll={{ x: "max-content" }}
                                                    columns={columns}
                                                    dataSource={
                                                        status.check === false && status.x === false ?
                                                            data.cv
                                                            :
                                                            status.check === true ?
                                                                data.cv.filter(item => item.status_cv === true)
                                                                :
                                                                data.cv.filter(item => item.status_cv === false)}
                                                    pagination={false}
                                                    rowKey="id_cv"
                                                    bordered />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCard>
                        </TabPane>
                        <TabPane tab="Rekap Data" key="2">
                            <CCard className="mb-4" style={{ padding: "20px" }}>
                                <Tabs type="card">
                                    <TabPane tab="Minat Pekerjaan" key="2.1">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data minat pekerjaan mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.MinatPekerjaan}
                                                        dataSource={rekap.filter(item => item.type === 0).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Bahasa Pemrograman" key="2.2">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data bahasa pemrograman yang dikuasai mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.BahasaPemrograman}
                                                        dataSource={rekap.filter(item => item.type === 1).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Database" key="2.3">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data database yang dikuasai mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.Database}
                                                        dataSource={rekap.filter(item => item.type === 2).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Frameworks" key="2.4">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data framework yang dikuasai mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.Frameworks}
                                                        dataSource={rekap.filter(item => item.type === 3).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Tools" key="2.5">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data tools yang dikuasai mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.Tools}
                                                        dataSource={rekap.filter(item => item.type === 4).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Modelling Tools" key="2.6">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data modelling tools yang dikuasai mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.Modelling}
                                                        dataSource={rekap.filter(item => item.type === 5).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Bahasa Komunikasi" key="2.7">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data bahasa komunikasi yang dikuasai mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsKompetensi.BahasaKomunikasi}
                                                        dataSource={rekap.filter(item => item.type === 6).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                </Tabs>
                            </CCard>
                        </TabPane>
                    </Tabs>
                </>
            ) : (
                <>
                    <CCard className="mb-4" style={{ padding: "20px" }}>
                        <Tabs type="card">
                            <TabPane tab="Minat Pekerjaan" key="2.1">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data minat pekerjaan mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.MinatPekerjaan}
                                                dataSource={rekap.filter(item => item.type === 0).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Bahasa Pemrograman" key="2.2">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data bahasa pemrograman yang dikuasai mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.BahasaPemrograman}
                                                dataSource={rekap.filter(item => item.type === 1).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Database" key="2.3">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data database yang dikuasai mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.Database}
                                                dataSource={rekap.filter(item => item.type === 2).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Frameworks" key="2.4">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data framework yang dikuasai mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.Frameworks}
                                                dataSource={rekap.filter(item => item.type === 3).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Tools" key="2.5">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data tools yang dikuasai mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.Tools}
                                                dataSource={rekap.filter(item => item.type === 4).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Modelling Tools" key="2.6">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data modelling tools yang dikuasai mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.Modelling}
                                                dataSource={rekap.filter(item => item.type === 5).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="BahasaKomunikasi" key="2.7">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data bahasa komunikasi yang dikuasai mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsKompetensi.BahasaKomunikasi}
                                                dataSource={rekap.filter(item => item.type === 6).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                        </Tabs>
                    </CCard>
                </>
            )}
        </>
    )
}

export default RekapCV
