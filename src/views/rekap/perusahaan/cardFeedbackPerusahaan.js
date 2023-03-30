import React
, { useState, useEffect }
    from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faScroll } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Spin, Alert } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const CardFeedbackPerusahaan = () => {
    let history = useHistory();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    axios.defaults.withCredentials = true;

    const formulirFeedbackPerusahaan = (prodi) => {
        history.push({
            pathname: `/dataFeedbackPerusahaan/formulirFeedbackPerusahaan/${data.id_company}`,
            state: { id_prodi: prodi }
        });
    }
    const detailFeedbackPerusahaan = (prodi) => {
        history.push({
            pathname: `/dataFeedbackPerusahaan/detailFeedbackPerusahaan/${data.id_company}`,
            state: { id_prodi: prodi }
        });
    }

    useEffect(() => {
        const getFeedback = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/feedback/get-by-company`)
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
        getFeedback();
    }, [history]);

    return isLoading ? (<Spin indicator={antIcon} />) : (
        // return (
        <>
            {data.is_allowed_d3 === false && data.is_allowed_d4 === 0 ? (
                <div style={{ paddingBottom: "20px" }}>
                    <Alert
                        message="Catatan"
                        description="Pemetaan mahasiswa belum dilakukan atau tidak ada peserta yang dialokasikan ke perusahaan Anda."
                        type="info"
                        showIcon
                        closable />
                </div>
            ) : (
                <>
                    {data.is_more_than_timeline_d3 === true && (
                        <div style={{ paddingBottom: "20px" }}>
                            <Alert
                                message="Catatan"
                                description="Formulir Data Feedback D3 tidak dapat diisi atau diubah karena diluar waktu yang telah ditetapkan."
                                type="info"
                                showIcon
                                closable />
                        </div>
                    )}
                    {data.is_more_than_timeline_d4 === true && (
                        <div style={{ paddingBottom: "20px" }}>
                            <Alert
                                message="Catatan"
                                description="Formulir Data Feedback D4 tidak dapat diisi atau diubah karena diluar waktu yang telah ditetapkan."
                                type="info"
                                showIcon
                                closable />
                        </div>
                    )}

                    <CCard className="mb-4" style={{overflowX: "scroll"}}>
                        <CCardBody>
                            <Row align='middle'>
                                <Col span={2}>
                                    <FontAwesomeIcon icon={faScroll} style={{ width: "50px", height: "50px" }} />
                                </Col>
                                <Col span={data.is_more_than_timeline_d3 === true || data.status_submit_d3 === 1 ? 19 : 16}>
                                    Feedback Pelaksanaan Kerja Praktik Program Studi D3
                                </Col>
                                {data.is_more_than_timeline_d3 === false && data.status_submit_d3 === 0 && (<>
                                    <Col span={3} style={{ textAlign: "center" }}>
                                        <Button
                                            id="create-evaluasi"
                                            size="small"
                                            shape="round"
                                            style={{ color: "white", background: "#339900", width: "80px" }}
                                            onClick={() => formulirFeedbackPerusahaan(0)}
                                        >
                                            Isi
                                        </Button>
                                    </Col>
                                </>)}
                                <Col span={3} style={{ textAlign: "center" }}>
                                    <Button
                                        id="detail"
                                        size="small"
                                        shape="round"
                                        style={{ color: "black", background: "#FBB03B" }}
                                        onClick={() => detailFeedbackPerusahaan(0)}
                                    >
                                        <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                    </Button>
                                </Col>
                            </Row>
                        </CCardBody>
                    </CCard>
                    <CCard className="mb-4" style={{overflowX: "scroll"}}>
                        <CCardBody>
                            <Row align='middle'>
                                <Col span={2}>
                                    <FontAwesomeIcon icon={faScroll} style={{ width: "50px", height: "50px" }} />
                                </Col>
                                <Col span={data.is_more_than_timeline_d4 === true || data.status_submit_d4 === 1 ? 19 : 16}>
                                    Feedback Pelaksanaan Praktik Kerja Lapangan Program Studi D4
                                </Col>
                                {data.is_more_than_timeline_d4 === false && data.status_submit_d4 === 0 && (<>
                                    <Col span={3} style={{ textAlign: "center" }}>
                                        <Button
                                            id="create-evaluasi"
                                            size="small"
                                            shape="round"
                                            style={{ color: "white", background: "#339900", width: "80px" }}
                                            onClick={() => formulirFeedbackPerusahaan(1)}
                                        >
                                            Isi
                                        </Button>
                                    </Col>
                                </>)}
                                <Col span={3} style={{ textAlign: "center" }}>
                                    <Button
                                        id="detail"
                                        size="small"
                                        shape="round"
                                        style={{ color: "black", background: "#FBB03B" }}
                                        onClick={() => detailFeedbackPerusahaan(1)}
                                    >
                                        <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                    </Button>
                                </Col>
                            </Row>
                        </CCardBody>
                    </CCard>
                </>
            )}
        </>
    )
}

export default CardFeedbackPerusahaan
