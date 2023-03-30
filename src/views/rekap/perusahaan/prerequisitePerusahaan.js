import React
, { useState, useEffect }
    from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPencil,
    faClipboard,
    faCheck,
    faEye,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Row, Col, notification, Alert, Spin } from 'antd';

import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const PrerequisitePerusahaan = () => {
    let history = useHistory();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState();
    const [loadings, setLoadings] = useState([]);
    const [statusMapping, setStatusMapping] = useState({})
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }
    const prerequisitePerusahaan = (id_prerequisite) => {
        if (localStorage.getItem("id_role") === "0" || localStorage.getItem("id_role") === "3") {
            history.push(`/listPerusahaan/detailPerusahaan/prerequisite/${id_prerequisite}`);
        } else if (localStorage.getItem("id_role") === "2") {
            history.push(`/formulirKesediaan/prerequisite/${id_prerequisite}`);
        }
    }
    const updatePrerequisite = (id_prerequisite) => {
        if (localStorage.getItem("id_role") === "0") {
            history.push(`/listPerusahaan/detailPerusahaan/updatePrerequisite/${id_prerequisite}`);
        } else if (localStorage.getItem("id_role") === "2") {
            history.push(`/formulirKesediaan/updatePrerequisite/${id_prerequisite}`);
        }
    }

    const refreshData = (index) => {
        let url;
        if (localStorage.getItem("id_role") === "0") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/card-by-committee?id-company=${id}`
        } else if (localStorage.getItem("id_role") === "2") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/card-by-company`
        }
        axios.get(url).then(function (response) {
            setData(response.data.data)
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        })
    }

    useEffect(() => {
        const getPrerequisiteCommittee = async () => {
            let idMapping;
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/card-by-committee?id-company=${id}`)
                .then(function (response) {
                    setData(response.data.data)
                    if (localStorage.getItem("id_prodi") === "0") {
                        idMapping = 1
                    } else if (localStorage.getItem("id_prodi") === "1") {
                        idMapping = 2
                    }
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/get-is-final/${idMapping}`)
                        .then(function (response) {
                            setStatusMapping(response.data.data)
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
        const getPrerequisiteCompany = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/card-by-company`, {
            })
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
                });
        }
        if (localStorage.getItem("id_role") === "0" || localStorage.getItem("id_role") === "3") {
            getPrerequisiteCommittee();
        } else if (localStorage.getItem("id_role") === "2") {
            getPrerequisiteCompany();
        }
    }, [history, id]);

    const handleMark = async (id_prerequisite, index) => {
        enterLoading(index)
        let url;
        if (localStorage.getItem("id_role") === "0") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/committee/mark-as-done/${id_prerequisite}`
        } else if (localStorage.getItem("id_role") === "2") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/company/mark-as-done`
        }
        await axios.put(url, {
        }).then((response) => {
            refreshData(index);
            notification.success({
                message: data.status_prerequisite === false ? 'Tandai selesai berhasil!' : 'Tandai selesai telah dibatalkan!'
            });
        }).catch((error) => {
            refreshData();
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            notification.error({
                message: 'Proses perubahan gagal!'
            });
        });
    }
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <>
                {localStorage.getItem("id_role") === "2" && (
                    data.status_submission === false && (
                        <div style={{ paddingBottom: "20px" }}>
                            <Alert
                                message="Catatan"
                                description="Formulir Data Prerequisite Perusahaan tidak dapat diisi atau diubah karena diluar waktu yang telah ditetapkan."
                                type="info"
                                showIcon
                                closable />
                        </div>
                    )
                )}
                {localStorage.getItem("id_role") === "0" && (
                    statusMapping === 1 && (
                        <div style={{ paddingBottom: "20px" }}>
                            <Alert
                                message="Catatan"
                                description="Formulir Data Prerequisite Perusahaan tidak dapat diisi atau diubah karena pemetaan sudah dilakukan."
                                type="info"
                                showIcon
                                closable />
                        </div>
                    )
                )}
                <CCard className="mb-4" style={{overflowX: "scroll"}}>
                    <CCardBody>
                        <Row align='middle'>
                            <Col span={2}>
                                <FontAwesomeIcon icon={faClipboard} style={{ width: "50px", height: "50px" }} />
                            </Col>
                            {localStorage.getItem("id_role") === "2" ? (
                                <>
                                    <Col span={data.status_submission === true ? 10 : 19}>
                                        {data.company_name}
                                    </Col>
                                    <>
                                        {data.status_submission === true && (
                                            <Col span={5} style={{ textAlign: "center" }}>
                                                <Button
                                                    id={data.status_prerequisite === false ? "selesai" : "batal"}
                                                    size="small"
                                                    shape="round"
                                                    loading={loadings[0]}
                                                    style={data.status_prerequisite === false ? { color: "white", background: "#339900" } : { color: "white", background: "#CC0033" }}
                                                    onClick={() => handleMark(data.id_prerequisite, 0)}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} style={{ paddingRight: "5px" }} />
                                                    {data.status_prerequisite === false ? "Tandai sebagai selesai" : "Batal tandai selesai"}
                                                </Button>
                                            </Col>
                                        )}
                                        <Col span={3} style={{ textAlign: "center" }}>
                                            <Button
                                                id="detail"
                                                size="small"
                                                shape="round"
                                                style={{ color: "black", background: "#FBB03B" }}
                                                onClick={() => prerequisitePerusahaan(data.id_prerequisite)}
                                            >
                                                <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                            </Button>
                                        </Col>
                                        {data.status_submission === true && (
                                            <Col span={4} style={{ textAlign: "center" }}>
                                                <Button
                                                    id="update"
                                                    size="small"
                                                    shape="round"
                                                    style={{ color: "black", background: "#FCEE21" }}
                                                    onClick={() => updatePrerequisite(data.id_prerequisite)}
                                                >
                                                    <FontAwesomeIcon icon={faPencil} style={{ paddingRight: "5px" }} /> Ubah Prerequisite
                                                </Button>
                                            </Col>
                                        )}
                                    </>
                                </>
                            ) : localStorage.getItem("id_role") === "0" ? (
                                <>
                                    <Col span={statusMapping === 0 ? 10 : 19}>
                                        {data.company_name}
                                    </Col>
                                    {statusMapping === 0 && (
                                        <Col span={5} style={{ textAlign: "center" }}>
                                            <Button
                                                id={data.status_prerequisite === false ? "selesai" : "batal"}
                                                size="small"
                                                shape="round"
                                                loading={loadings[0]}
                                                style={data.status_prerequisite === false ? { color: "white", background: "#339900" } : { color: "white", background: "#CC0033" }}
                                                onClick={() => handleMark(data.id_prerequisite, 0)}
                                            >
                                                <FontAwesomeIcon icon={faCheck} style={{ paddingRight: "5px" }} />
                                                {data.status_prerequisite === false ? "Tandai sebagai selesai" : "Batal tandai selesai"}
                                            </Button>
                                        </Col>
                                    )}
                                    <Col span={3} style={{ textAlign: "center" }}>
                                        <Button
                                            id="detail"
                                            size="small"
                                            shape="round"
                                            style={{ color: "black", background: "#FBB03B" }}
                                            onClick={() => prerequisitePerusahaan(data.id_prerequisite)}
                                        >
                                            <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                        </Button>
                                    </Col>
                                    {statusMapping === 0 && (
                                        <Col span={4} style={{ textAlign: "center" }}>
                                            <Button
                                                id="update"
                                                size="small"
                                                shape="round"
                                                style={{ color: "black", background: "#FCEE21" }}
                                                onClick={() => updatePrerequisite(data.id_prerequisite)}
                                            >
                                                <FontAwesomeIcon icon={faPencil} style={{ paddingRight: "5px" }} /> Ubah Prerequisite
                                            </Button>
                                        </Col>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Col span={18}>
                                        {data.company_name}
                                    </Col>
                                    <Col span={3} style={{ textAlign: "center" }}>
                                        <Button
                                            id="detail"
                                            size="small"
                                            shape="round"
                                            style={{ color: "black", background: "#FBB03B" }}
                                            onClick={() => prerequisitePerusahaan(data.id_prerequisite)}
                                        >
                                            <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                        </Button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </CCardBody>
                </CCard>
            </>
        </>
    )
}

export default PrerequisitePerusahaan

