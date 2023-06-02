import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row, Table, Tooltip, Input, Space, Tabs, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TabPane } = Tabs;
const FileDownload = require('js-file-download');
const EvaluasiPerusahaan = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    let history = useHistory()
    const [status, setStatus] = useState({ check: false, x: false });
    const [data, setData] = useState({});
    const [tab, setTab] = useState("1");
    const [isLoading, setIsLoading] = useState(true);
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

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

    useEffect(() => {
        const getEvaluasi = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/get-by-committee`)
                .then(function (response) {
                    setData(response.data.data)
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
                    console.log(error)
                });
        }
        getEvaluasi();
    }, [history]);

    const detailEvaluasi = (id, numEval, name) => {
        history.push({
            pathname: `/evaluasiPeserta/detailEvaluasi/${id}`,
            state: { numEval: numEval, name: name, id_prodi: parseInt(localStorage.getItem("id_prodi")) }
        });
    }

    const exportPDF = async (evaluasi, index, id_participant) => {
        enterLoading(index)
        axios.defaults.withCredentials = true;
        await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/export-pdf?numeval=${evaluasi}&id=${id_participant}`, {
            responseType: 'blob',
        })
            .then((response) => {
                // notification.success({
                //     message: 'Ekspor evaluasi berhasil',
                // });
                FileDownload(response.data, `Data Evaluasi ${evaluasi} (${localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}).pdf`);
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            }).catch((error) => {
                // notification.error({
                //     message: 'Ekspor evaluasi gagal'
                // });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
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
                        Search
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

    const onChange = (activeKey) => {
        setTab(activeKey)
    };

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
        title: 'Nama',
        dataIndex: 'name',
        ...getColumnSearchProps('name', 'nama'),
        width: '55%',
        render: (text, record) =>
            <>
                <Row align="middle">
                    <Col >
                        {record.name}
                    </Col>
                    <Col style={{ paddingLeft: "10px" }}>
                        {(localStorage.getItem("id_prodi") === "0" ? record.status_evaluated[0] === 1 : record.status_evaluated[parseInt(tab) - 1] === 1) ?
                            <Tooltip placement="right" title="Sudah dievaluasi">
                                <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </Tooltip>
                            :
                            <Tooltip placement="right" title="Belum dievaluasi">
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
        dataIndex: 'id',
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
                    <Col span={11} style={{ textAlign: "right" }}>
                        <Button
                            id="button-eye"
                            htmlType="submit"
                            shape="circle"
                            style={{ backgroundColor: "#FBB03B", borderColor: "#FBB03B" }}
                            onClick={() => detailEvaluasi(record.id, tab, record.name)}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ color: "black" }} />
                        </Button>
                    </Col>
                    <Col span={2} />
                    <Col span={11} style={{ textAlign: "left" }}>
                        {(localStorage.getItem("id_prodi") === "0" ? record.status_evaluated[0] === 1 : record.status_evaluated[parseInt(tab) - 1] === 1) ?
                            <Button
                                id={"download"}
                                htmlType="submit"
                                shape="circle"
                                style={{ color: "white", background: "#3399FF" }}
                                onClick={() => exportPDF(tab, `${record.id}-${tab - 1}`, record.id)}
                                loading={loadings[0]}
                            >
                                <FontAwesomeIcon icon={faFileDownload} />
                            </Button>
                            :
                            <Tooltip placement="right" title="Peserta belum dievaluasi">
                                <Button
                                    id={""}
                                    htmlType="submit"
                                    shape="circle"
                                    disabled={true}
                                    style={{ color: "white", background: "#900427" }}
                                    onClick={() => exportPDF(tab, `${record.id}-${tab - 1}`, record.id)}
                                    loading={loadings[0]}
                                >
                                    <FontAwesomeIcon icon={faFileDownload} />
                                </Button>
                            </Tooltip>
                        }
                    </Col>
                </Row>
            </>
    }];
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            {localStorage.getItem("id_prodi") === "0" ?
                <>
                    <CRow>
                        <CCol sm={6}>
                            <CCard className='mb-4' id="card-filter" onClick={() => changeData("check")} style={status.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                <CCardBody>
                                    <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                            <Button type="primary" shape="circle" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", width: "60px", height: "60px", fontSize: "30px" }}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: "10px" }}>
                                            <h6>Sudah Dievaluasi</h6>
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
                                            <h6>Belum Dievaluasi</h6>
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
                                    <h6>Tabel data evaluasi peserta KP</h6>
                                    <Table
                                        scroll={{ x: "max-content" }}
                                        columns={columns}
                                        dataSource={
                                            status.check === false && status.x === false ?
                                                data.participantList
                                                :
                                                status.check === true ?
                                                    data.participantList.filter(item => item.status_evaluated[0] === 1)
                                                    :
                                                    data.participantList.filter(item => item.status_evaluated[0] === 0)}
                                        pagination={false}
                                        rowKey="id"
                                        bordered />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </> :
                <>
                    <Tabs type="card" onChange={onChange}>
                        <TabPane tab="Evaluasi 1" key="1">
                            <CCard className="mb-4" style={{ padding: "20px" }}>
                                <CRow>
                                    <CCol sm={6}>
                                        <CCard className='mb-4' id="card-filter" onClick={() => changeData("check")} style={status.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                            <CCardBody>
                                                <Row justify="space-around" align="middle">
                                                    <Col span={6}>
                                                        <Button type="primary" shape="circle" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", width: "60px", height: "60px", fontSize: "30px" }}>
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </Button>
                                                    </Col>
                                                    <Col span={18} style={{ paddingTop: "10px" }}>
                                                        <h6>Sudah Dievaluasi</h6>
                                                        <h5 style={{ color: "#339900" }}>{data.total_submitted[0]} Mahasiswa</h5>
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
                                                        <h6>Belum Dievaluasi</h6>
                                                        <h5 style={{ color: "#CC0033" }}>{data.total_not_submitted[0]} Mahasiswa</h5>
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
                                                <h6>Tabel data evaluasi 1 peserta PKL</h6>
                                                <Table
                                                    scroll={{ x: "max-content" }}
                                                    columns={columns}
                                                    dataSource={
                                                        status.check === false && status.x === false ?
                                                            data.participantList
                                                            :
                                                            status.check === true ?
                                                                data.participantList.filter(item => item.status_evaluated[0] === 1)
                                                                :
                                                                data.participantList.filter(item => item.status_evaluated[0] === 0)}
                                                    pagination={false}
                                                    rowKey="id"
                                                    bordered />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCard>
                        </TabPane>
                        <TabPane tab="Evaluasi 2" key="2">
                            <CCard className="mb-4" style={{ padding: "20px" }}>
                                <CRow>
                                    <CCol sm={6}>
                                        <CCard className='mb-4' id="card-filter" onClick={() => changeData("check")} style={status.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                            <CCardBody>
                                                <Row justify="space-around" align="middle">
                                                    <Col span={6}>
                                                        <Button type="primary" shape="circle" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", width: "60px", height: "60px", fontSize: "30px" }}>
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </Button>
                                                    </Col>
                                                    <Col span={18} style={{ paddingTop: "10px" }}>
                                                        <h6>Sudah Dievaluasi</h6>
                                                        <h5 style={{ color: "#339900" }}>{data.total_submitted[1]} Mahasiswa</h5>
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
                                                        <h6>Belum Dievaluasi</h6>
                                                        <h5 style={{ color: "#CC0033" }}>{data.total_not_submitted[1]} Mahasiswa</h5>
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
                                                <h6>Tabel data evaluasi 2 peserta PKL</h6>
                                                <Table
                                                    scroll={{ x: "max-content" }}
                                                    columns={columns}
                                                    dataSource={
                                                        status.check === false && status.x === false ?
                                                            data.participantList
                                                            :
                                                            status.check === true ?
                                                                data.participantList.filter(item => item.status_evaluated[1] === 1)
                                                                :
                                                                data.participantList.filter(item => item.status_evaluated[1] === 0)}
                                                    pagination={false}
                                                    rowKey="id"
                                                    bordered />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCard>
                        </TabPane>
                        <TabPane tab="Evaluasi 3" key="3">
                            <CCard className="mb-4" style={{ padding: "20px" }}>
                                <CRow>
                                    <CCol sm={6}>
                                        <CCard className='mb-4' id="card-filter" onClick={() => changeData("check")} style={status.check === true ? { backgroundColor: "#C8C8C8" } : { backgroundColor: "white" }}>
                                            <CCardBody>
                                                <Row justify="space-around" align="middle">
                                                    <Col span={6}>
                                                        <Button type="primary" shape="circle" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", width: "60px", height: "60px", fontSize: "30px" }}>
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </Button>
                                                    </Col>
                                                    <Col span={18} style={{ paddingTop: "10px" }}>
                                                        <h6>Sudah Dievaluasi</h6>
                                                        <h5 style={{ color: "#339900" }}>{data.total_submitted[2]} Mahasiswa</h5>
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
                                                        <h6>Belum Dievaluasi</h6>
                                                        <h5 style={{ color: "#CC0033" }}>{data.total_not_submitted[2]} Mahasiswa</h5>
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
                                                <h6>Tabel data evaluasi 3 peserta PKL</h6>
                                                <Table
                                                    scroll={{ x: "max-content" }}
                                                    columns={columns}
                                                    dataSource={
                                                        status.check === false && status.x === false ?
                                                            data.participantList
                                                            :
                                                            status.check === true ?
                                                                data.participantList.filter(item => item.status_evaluated[2] === 1)
                                                                :
                                                                data.participantList.filter(item => item.status_evaluated[2] === 0)}
                                                    pagination={false}
                                                    rowKey="id"
                                                    bordered />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCard>
                        </TabPane>
                    </Tabs>

                </>}

        </>
    )
}

export default EvaluasiPerusahaan
