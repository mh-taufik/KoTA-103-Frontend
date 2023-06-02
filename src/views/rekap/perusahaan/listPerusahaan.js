import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row, Table, Tooltip, Input, Space, Spin, Tabs } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const ListPerusahaan = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    let history = useHistory()
    const [status, setStatus] = useState({ statusAktif: { check: false, x: false }, statusPrerequisite: { check: false, x: false } });
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({});
    const [rekap, setRekap] = useState([])
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;
    const changeData = (data) => {
        if (data === "statusAktifCheck") {
            if (status.statusAktif.check) {
                setStatus(pre => {
                    return { ...pre, statusAktif: { check: false, x: false } }
                })
            } else if (!status.statusAktif.check) {
                setStatus(pre => {
                    return { ...pre, statusAktif: { check: true, x: false } }
                })
            }
        } else if (data === "statusAktifX") {
            if (status.statusAktif.x) {
                setStatus(pre => {
                    return { ...pre, statusAktif: { check: false, x: false } }
                })
            } else if (!status.statusAktif.x) {
                setStatus(pre => {
                    return { ...pre, statusAktif: { check: false, x: true } }
                })
            }
        } if (data === "statusPrerequisiteCheck") {
            if (status.statusPrerequisite.check) {
                setStatus(pre => {
                    return { ...pre, statusPrerequisite: { check: false, x: false } }
                })
            } else if (!status.statusPrerequisite.check) {
                setStatus(pre => {
                    return { ...pre, statusPrerequisite: { check: true, x: false } }
                })
            }
        } else if (data === "statusPrerequisiteX") {
            if (status.statusPrerequisite.x) {
                setStatus(pre => {
                    return { ...pre, statusPrerequisite: { check: false, x: false } }
                })
            } else if (!status.statusPrerequisite.x) {
                setStatus(pre => {
                    return { ...pre, statusPrerequisite: { check: false, x: true } }
                })
            }
        }
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

    const enterLoading = index => {
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = true;
          return newLoadings;
        });
      }

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
        const getCompany = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/list`)
                .then(function (response) {
                    setData(response.data.data)
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/recap`)
                        .then(function (response) {
                            setRekap(response.data.data)
                            setIsLoading(false)
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
        getCompany();
    }, [history]);


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
        title: 'Nama Perusahaan',
        dataIndex: 'company_name',
        ...getColumnSearchProps('company_name', 'nama perusahaan'),
        width: '35%',
        render: (text, record) =>
            <>
                <Row align="middle">
                    <Col >
                        {record.company_name}
                    </Col>
                    <Col style={{ paddingLeft: "10px", paddingRight: "5px" }}>
                        {record.status_company ?
                            <Button type="primary" shape="round" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                                Aktif
                            </Button>
                            :
                            <Button type="primary" shape="round" size="small" style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white", fontSize: "11px" }}>
                                Tidak Aktif
                            </Button>
                        }
                    </Col>
                    <Col style={{ paddingRight: "5px" }}>
                        {record.status_prerequisite ?
                            <Tooltip placement="right" title="Sudah mengisi formulir prerequisite">
                                <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </Tooltip>
                            :
                            <Tooltip placement="right" title="Belum mengisi formulir prerequisite">
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
        title: 'Narahubung',
        width: '15%',
        children: [
            {
                title: 'Nama',
                dataIndex: 'cp_name',
            },
            {
                title: 'No HP',
                dataIndex: 'cp_phone',
            },
            {
                title: 'Email',
                dataIndex: 'cp_email',
            }
        ]
    },
    {
        title: 'Aksi',
        dataIndex: 'action',
        align: "center",
        render: (text, record) =>
            <>
                <Row>
                    <Col span={24} style={{ textAlign: "center" }}>
                        <Button
                            id="detail"
                            size="small"
                            shape="round"
                            style={{ color: "black", background: "#FBB03B" }}
                            onClick={() => detailPerusahaan(record.id_company)}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                        </Button>
                    </Col>
                </Row>
            </>
    }];

    const createPerusahaan = () => {
        history.push("/listPerusahaan/createPerusahaan");
    }
    const detailPerusahaan = (id_company) => {
        history.push(`/listPerusahaan/detailPerusahaan/${id_company}`);
    }

    const getPersentase = (total) => {
        return ((total / data.company.length) * 100).toFixed(2)
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
                title: 'Nama Cakupan Pekerjaan',
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
                title: 'Persentase Pekerjaan Yang Diharapkan',
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
                title: 'Persentase Bahasa Pemrograman Yang Dibutuhkan',
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
                title: 'Persentase Database Yang Dibutuhkan',
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
                title: 'Persentase Frameworks Yang Dibutuhkan',
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
                title: 'Persentase Tools Yang Dibutuhkan',
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
                title: 'Persentase Modelling Tools Yang Dibutuhkan',
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
                title: 'Persentase Bahasa Komunikasi Yang Dibutuhkan',
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
            <Tabs type="card">
                <TabPane tab="Data Perusahaan" key="1">
                    <CCard className="mb-4" style={{ padding: "20px" }}>
                        <CRow>
                            <CCol sm={3}>
                                <CCard className='mb-4' id="card-filter" onClick={() => changeData("statusAktifCheck")} style={status.statusAktif.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                    <CCardBody style={{ padding: "10px" }}>
                                        <Row justify="space-around" align="middle">
                                            <Col span={24} style={{ paddingTop: "10px" }}>
                                                <h6 style={{ fontSize: "9pt" }}><b>Perusahaan Aktif</b></h6>
                                                <h5 style={{ color: "#339900" }}>{data.total_company_active} Perusahaan</h5>
                                            </Col>
                                        </Row>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol sm={3}>
                                <CCard className='mb-4' id="card-filter" onClick={() => changeData("statusAktifX")} style={status.statusAktif.x === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                    <CCardBody style={{ padding: "10px" }}>
                                        <Row justify="space-around" align="middle">
                                            <Col span={24} style={{ paddingTop: "10px" }}>
                                                <h6 style={{ fontSize: "9pt" }}><b>Perusahaan Tidak Aktif</b></h6>
                                                <h5 style={{ color: "#CC0033" }}>{data.total_company_inactive} Perusahaan</h5>
                                            </Col>
                                        </Row>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol sm={3}>
                                <CCard className='mb-4' id="card-filter" onClick={() => changeData("statusPrerequisiteCheck")} style={status.statusPrerequisite.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                    <CCardBody style={{ padding: "10px" }}>
                                        <Row justify="space-around" align="middle">
                                            <Col span={6}>
                                                <Button type="primary" shape="circle" size="medium" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white" }}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </Button>
                                            </Col>
                                            <Col span={18} style={{ paddingTop: "10px" }}>
                                                <h6 style={{ fontSize: "8pt" }}><b>Sudah Mengisi Formulir Prerequisite</b></h6>
                                                <h5 style={{ color: "#339900" }}>{data.total_prerequisite_submitted} Perusahaan</h5>
                                            </Col>
                                        </Row>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol sm={3}>
                                <CCard className='mb-4' id="card-filter" onClick={() => changeData("statusPrerequisiteX")} style={status.statusPrerequisite.x === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                    <CCardBody style={{ padding: "10px" }}>
                                        <Row justify="space-around" align="middle">
                                            <Col span={6}>
                                                <Button type="primary" shape="circle" size="medium" style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white" }}>
                                                    !
                                                </Button>
                                            </Col>
                                            <Col span={18} style={{ paddingTop: "10px" }}>
                                                <h6 style={{ fontSize: "8pt" }}><b>Belum Mengisi Formulir Prerequisite</b></h6>
                                                <h5 style={{ color: "#CC0033" }}>{data.total_prerequisite_notsubmitted} Perusahaan</h5>
                                            </Col>
                                        </Row>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CCard className="mb-4">
                            <CCardBody>
                                <CRow>
                                    {localStorage.getItem("id_role") === "0" ? (
                                        <CCol sm={12} style={{ textAlign: "right" }}>
                                            <Button
                                                id="create-akun"
                                                size="sm"
                                                shape="round"
                                                style={{ color: "white", background: "#339900", marginBottom: 16 }}
                                                onClick={createPerusahaan}
                                            >
                                                Buat Perusahaan Baru
                                            </Button>
                                        </CCol>
                                    ) : ""}
                                    <CCol sm={12}>
                                        <h6>Tabel data perusahaan</h6>
                                        <Table
                                            scroll={{ x: "max-content" }}
                                            columns={columns}
                                            dataSource={
                                                status.statusAktif.check === false ?
                                                    status.statusAktif.x === false ?
                                                        status.statusPrerequisite.check === true ?
                                                            data.company.filter(item => item.status_prerequisite === true)
                                                            :
                                                            status.statusPrerequisite.x === true ?
                                                                data.company.filter(item => item.status_prerequisite === false)
                                                                :
                                                                data.company
                                                        :
                                                        status.statusPrerequisite.check === true ?
                                                            data.company.filter(item => item.status_company === false && item.status_prerequisite === true)
                                                            :
                                                            status.statusPrerequisite.x === true ?
                                                                data.company.filter(item => item.status_company === false && item.status_prerequisite === false)
                                                                :
                                                                data.company.filter(item => item.status_company === false)
                                                    :
                                                    status.statusPrerequisite.check === true ?
                                                        data.company.filter(item => item.status_company === true && item.status_prerequisite === true)
                                                        :
                                                        status.statusPrerequisite.x === true ?
                                                            data.company.filter(item => item.status_company === true && item.status_prerequisite === false)
                                                            :
                                                            data.company.filter(item => item.status_company === true)}
                                            pagination={false}
                                            rowKey="id_company"
                                            bordered />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCard>
                </TabPane>
                <TabPane tab="Rekap Prerequisite" key="2">
                    <CCard className="mb-4" style={{ padding: "20px" }}>
                        <Tabs type="card">
                            <TabPane tab="Cakupan Pekerjaan" key="2.1">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data cakupan pekerjaan perusahaan</h6>
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
                                            <h6>Tabel rekap data bahasa pemrograman yang dibutuhkan perusahaan</h6>
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
                                            <h6>Tabel rekap data database yang dibutuhkan perusahaan</h6>
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
                                            <h6>Tabel rekap data framework yang dibutuhkan perusahaan</h6>
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
                                            <h6>Tabel rekap data tools yang dibutuhkan perusahaan</h6>
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
                                            <h6>Tabel rekap data modelling tools yang dibutuhkan perusahaan</h6>
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
                                            <h6>Tabel rekap data bahasa komunikasi yang dibutuhkan perusahaan</h6>
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
    )
}

export default ListPerusahaan
