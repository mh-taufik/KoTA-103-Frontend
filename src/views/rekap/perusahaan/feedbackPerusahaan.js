import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, 
    // faFileDownload 
} from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Row, Table, Tooltip, Input, Space, Alert, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const FeedbackPerusahaan = () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    let history = useHistory()
    const [status, setStatus] = useState({ check: false, x: false });
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [loadings, setLoadings] = useState([]);
    const changeData = (status) => {
        if (status === "check") {
            if (status.check) {
                setStatus({ check: false, x: false })
            } else if (!status.check) {
                setStatus({ check: true, x: false })
            }
        } else if (status === "x") {
            if (status.x) {
                setStatus({ check: false, x: false })
            } else if (!status.x) {
                setStatus({ check: false, x: true })
            }
        }
    }

    useEffect(() => {
        const getData = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/feedback/get-by-committee`)
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
        getData();
    }, [history]);

    const detailFeedback = (id, nama) => {
        history.push({
            pathname: `feedbackPerusahaan/detailFeedback/${id}`,
            state: { id_prodi: localStorage.getItem("id_prodi"), company_name: nama }
        });
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
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
        title: 'Nama Perusahaan',
        dataIndex: 'name',
        ...getColumnSearchProps('name'),
        width: '80%',
        render: (text, record) =>
            <>
                <Row align="middle">
                    <Col >
                        {record.name}
                    </Col>
                    <Col style={{ paddingLeft: "10px" }}>
                        {record.status_feedback ?
                            <Tooltip placement="right" title="Sudah mengisi formulir feedback">
                                <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </Tooltip>
                            :
                            <Tooltip placement="right" title="Belum mengisi formulir feedback">
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
        title: 'Aksi',
        dataIndex: 'action',
        align: "center",
        render: (text, record) =>
            <>
                <Row>
                    <Col span={24} style={{ textAlign: "center" }}>
                        <Button
                            id="button-eye"
                            htmlType="submit"
                            shape="circle"
                            style={{ backgroundColor: "#FBB03B", borderColor: "#FBB03B" }}
                            onClick={() => detailFeedback(record.id, record.name)}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ color: "black" }} />
                        </Button>
                    </Col>
                </Row>
            </>
    }];
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            {data.is_published === false ? (
                <div style={{ paddingBottom: "20px" }}>
                    <Alert
                        message="Catatan"
                        description="Hasil pemetaan belum di publish ke perusahaan."
                        type="info"
                        showIcon
                        closable />
                </div>
            ) : (
                <>
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
                                            <h6>Sudah Mengisi Formulir Feedback</h6>
                                            <h5 style={{ color: "#339900" }}>{data.total_submitted} Perusahaan</h5>
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
                                            <h6>Belum Mengisi Formulir Feedback</h6>
                                            <h5 style={{ color: "#CC0033" }}>{data.total_not_submitted} Perusahaan</h5>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow><CCard className="mb-4">
                        <CCardBody>
                            {/* <Row>
                                <Col span={24} style={{ textAlign: "left", paddingBottom: "15px" }}>
                                    <Button
                                        id="download"
                                        shape="round"
                                        style={{ color: "white", background: "#3399FF" }}
                                    >
                                        <FontAwesomeIcon icon={faFileDownload} style={{ paddingRight: "5px" }} /> Export
                                    </Button>
                                </Col>
                            </Row> */}
                            <CRow>
                                <CCol sm={12}>
                                    <h6>Tabel data feedback perusahaan</h6>
                                    <Table
                                        scroll={{ x: "max-content" }}
                                        columns={columns}
                                        dataSource={status.check === false && status.x === false ?
                                            data.companyList
                                            :
                                            status.check === true ?
                                                data.companyList.filter(item => item.status_feedback === 1)
                                                :
                                                data.companyList.filter(item => item.status_feedback === 0)}
                                        pagination={false}
                                        rowKey="id"
                                        bordered />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </>
            )}
        </>
    )
}

export default FeedbackPerusahaan
