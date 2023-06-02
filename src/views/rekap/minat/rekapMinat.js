import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row, Table, Tooltip, Input, Space, Tabs, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TabPane } = Tabs;

const RekapMinat = () => {
    let searchInput;
    let history = useHistory();
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    const [status, setStatus] = useState({ check: false, x: false });
    const [data, setData] = useState({});
    const [loadings, setLoadings] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [rekap, setRekap] = useState([])
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

    useEffect(() => {
        const getRecap = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/recap`)
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
        const getMinat = async () => {
            let dat = [];
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection`)
                .then(function (response) {
                    response.data.data.company_selection.map(item => {
                        return dat.push({
                            nim: item.nim,
                            participant_name: item.participant_name,
                            status: item.status,
                            priority1_company_name: item.company_name[0],
                            priority2_company_name: item.company_name[1],
                            priority3_company_name: item.company_name[2],
                            priority4_company_name: item.company_name[3],
                            priority5_company_name: item.company_name[4],
                        })
                    })
                    setData({
                        company_selection: dat,
                        total_not_selected: response.data.data.total_not_selected,
                        total_selected: response.data.data.total_selected
                    })
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
        localStorage.getItem("id_role") === "0" ? getMinat() : localStorage.getItem("id_role") === "3" ? getRecap() : setIsLoading(false);
    }, [history]);

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
        dataIndex: 'participant_name',
        width: '20%',
        ...getColumnSearchProps('participant_name', 'nama mahasiswa'),
        render: (text, record) =>
            <>
                <Row align="middle">
                    <Col >
                        {record.participant_name}
                    </Col>
                    <Col style={{ paddingLeft: "10px" }}>
                        {record.status ?
                            <Tooltip placement="right" title="Sudah mengisi formulir pilihan prioritas perusahaan">
                                <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </Tooltip>
                            :
                            <Tooltip placement="right" title="Belum mengisi formulir pilihan prioritas perusahaan">
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
        width: '15%',
        align: "center",
    },
    {
        title: 'Prioritas 1',
        dataIndex: 'priority1_company_name',
        align: "center",
        width: '12%',
        ...getColumnSearchProps('priority1_company_name', 'perusahaan prioritas 1'),
        render: (text, record) =>
            <>
                {record.priority1_company_name ? record.priority1_company_name : "-"}
            </>
    },
    {
        title: 'Prioritas 2',
        dataIndex: 'priority2_company_name',
        align: "center",
        width: '12%',
        ...getColumnSearchProps('priority2_company_name', 'perusahaan prioritas 2'),
        render: (text, record) =>
            <>
                {record.priority2_company_name ? record.priority2_company_name : "-"}
            </>
    },
    {
        title: 'Prioritas 3',
        dataIndex: 'priority3_company_name',
        align: "center",
        width: '12%',
        ...getColumnSearchProps('priority3_company_name', 'perusahaan prioritas 3'),
        render: (text, record) =>
            <>
                {record.priority3_company_name ? record.priority3_company_name : "-"}
            </>
    },
    {
        title: 'Prioritas 4',
        dataIndex: 'priority4_company_name',
        align: "center",
        width: '12%',
        ...getColumnSearchProps('priority4_company_name', 'perusahaan prioritas 4'),
        render: (text, record) =>
            <>
                {record.priority4_company_name ? record.priority4_company_name : "-"}
            </>
    },
    {
        title: 'Prioritas 5',
        dataIndex: 'priority5_company_name',
        align: "center",
        width: '12%',
        ...getColumnSearchProps('priority5_company_name', 'perusahaan prioritas 5'),
        render: (text, record) =>
            <>
                {record.priority5_company_name ? record.priority5_company_name : "-"}
            </>
    }];

    const getPersentase = (total) => {
        return localStorage.getItem("id_role") === "3" ? localStorage.getItem("id_prodi") === "0" ? ((total / 61) * 100).toFixed(2) : ((total / 27) * 100).toFixed(2) : ((total / data.company_selection.length) * 100).toFixed(2)
    }

    const columnsMinat = [
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
            title: 'Nama Perusahaan',
            dataIndex: 'company_name',
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
            title: 'Persentase Perusahaan yang diminati',
            dataIndex: 'persentase',
            width: '25%',
            align: "center",
            render: (value, item, index) =>
                <>
                    {getPersentase(item.total)}%
                </>
        }
    ]
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
                                                        <h6>Sudah Mengisi Formulir Pilihan Prioritas Perusahaan</h6>
                                                        <h5 style={{ color: "#339900" }}>{data.total_selected} Mahasiswa</h5>
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
                                                        <h6>Belum Mengisi Formulir Pilihan Prioritas Perusahaan</h6>
                                                        <h5 style={{ color: "#CC0033" }}>{data.total_not_selected} Mahasiswa</h5>
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
                                                <h6>Tabel data pilihan prioritas perusahaan oleh mahasiswa</h6>
                                                <Table
                                                    scroll={{ x: "max-content" }}
                                                    columns={columns}
                                                    dataSource={data &&
                                                        status.check === false && status.x === false ?
                                                        data.company_selection
                                                        :
                                                        status.check === true ?
                                                            data.company_selection.filter(item => item.status === true)
                                                            :
                                                            data.company_selection.filter(item => item.status === false)}
                                                    pagination={false}
                                                    rowKey="nim"
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
                                    <TabPane tab="Prioritas 1" key="2.1">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data pilihan perusahaan prioritas 1 oleh mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsMinat}
                                                        dataSource={rekap.filter(item => item.priority === 1).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Prioritas 2" key="2.2">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data pilihan perusahaan prioritas 2 oleh mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsMinat}
                                                        dataSource={rekap.filter(item => item.priority === 2).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Prioritas 3" key="2.3">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data pilihan perusahaan prioritas 3 oleh mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsMinat}
                                                        dataSource={rekap.filter(item => item.priority === 3).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Prioritas 4" key="2.4">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data pilihan perusahaan prioritas 4 oleh mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsMinat}
                                                        dataSource={rekap.filter(item => item.priority === 4).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                        pagination={false}
                                                        rowKey="id"
                                                        bordered />
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </TabPane>
                                    <TabPane tab="Prioritas 5" key="2.5">
                                        <CCardBody>
                                            <CRow>
                                                <CCol sm={12}>
                                                    <h6>Tabel rekap data pilihan perusahaan prioritas 5 oleh mahasiswa</h6>
                                                    <Table
                                                        scroll={{ x: "max-content" }}
                                                        columns={columnsMinat}
                                                        dataSource={rekap.filter(item => item.priority === 5).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
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
                            <TabPane tab="Prioritas 1" key="2.1">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data pilihan perusahaan prioritas 1 oleh mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsMinat}
                                                dataSource={rekap.filter(item => item.priority === 1).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Prioritas 2" key="2.2">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data pilihan perusahaan prioritas 2 oleh mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsMinat}
                                                dataSource={rekap.filter(item => item.priority === 2).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Prioritas 3" key="2.3">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data pilihan perusahaan prioritas 3 oleh mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsMinat}
                                                dataSource={rekap.filter(item => item.priority === 3).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Prioritas 4" key="2.4">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data pilihan perusahaan prioritas 4 oleh mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsMinat}
                                                dataSource={rekap.filter(item => item.priority === 4).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
                                                pagination={false}
                                                rowKey="id"
                                                bordered />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab="Prioritas 5" key="2.5">
                                <CCardBody>
                                    <CRow>
                                        <CCol sm={12}>
                                            <h6>Tabel rekap data pilihan perusahaan prioritas 5 oleh mahasiswa</h6>
                                            <Table
                                                scroll={{ x: "max-content" }}
                                                columns={columnsMinat}
                                                dataSource={rekap.filter(item => item.priority === 5).concat(rekap.filter(item => item.priority === 0)).sort((a, b) => { return b.total - a.total })}
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

export default RekapMinat
