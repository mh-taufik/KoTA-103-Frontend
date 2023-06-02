import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faScroll } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Alert, Spin} from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const CardEvaluasiPerusahaan = () => {
    const history = useHistory();
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    axios.defaults.withCredentials = true;


    const formulirEvaluasiPerusahaan = (item) => {
        history.push({
            pathname: `/dataEvaluasiPerusahaan/formulirEvaluasiPerusahaan/${item.participant_id}`,
            state: { id_prodi: item.participant_prodi, numEval: item.num_evaluation, name: item.participant_name }
        });
    }
    const detailEvaluasiPerusahaan = (item) => {
        history.push({
            pathname: `/dataEvaluasiPerusahaan/detailEvaluasiPerusahaan/${item.participant_id}`,
            state: { id_prodi: item.participant_prodi, name: item.participant_name }
        });
    }

    useEffect(() => {
        const getCardEvaluasi = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/get-by-company`)
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
        getCardEvaluasi();
    }, [history]);
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            {data.participant_d3.length === 0 && data.participant_d4.length === 0 && (
                <>
                    <Alert
                        message="Catatan"
                        description="Pemetaan mahasiswa belum dilakukan atau tidak ada peserta yang dialokasikan ke perusahaan Anda."
                        type="info"
                        showIcon
                        closable />
                </>
            )}
            {data.participant_d3.length > 0 ?
                <>
                    <CCard className="mb-1" style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <CCardHeader style={{ paddingLeft: "20px" }}>
                            <h5><b>D3</b></h5>
                        </CCardHeader>
                    </CCard>
                    {data.is_more_than_timeline_d3 === true ? (
                        <div style={{ paddingBottom: "20px" }}>
                            <Alert
                                message="Catatan"
                                description="Formulir Data Evaluasi KP tidak dapat diisi atau diubah karena diluar waktu yang telah ditetapkan."
                                type="info"
                                showIcon
                                closable />
                        </div>
                    ) : ""}
                    {data.participant_d3.map((item, i) => {
                        return <div key={i}>
                            <CCard className="mb-4" style={{overflowX: "scroll"}}>
                                <CCardBody>
                                    <Row align='middle'>
                                        <Col span={2}>
                                            <FontAwesomeIcon icon={faScroll} style={{ width: "50px", height: "50px" }} />
                                        </Col>
                                        <Col span={item.status_submit === 0 ? 16 : 19}>
                                            {item.participant_name}
                                        </Col>
                                        {item.status_submit === 0 && (<>
                                            <Col span={3} style={{ textAlign: "center" }}>
                                                <Button
                                                    id="create-evaluasi"
                                                    size="small"
                                                    shape="round"
                                                    style={{ color: "white", background: "#339900", width: "80px" }}
                                                    onClick={() => formulirEvaluasiPerusahaan(item)}
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
                                                onClick={() => detailEvaluasiPerusahaan(item)}
                                            >
                                                <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                            </Button>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </CCard>
                        </div>
                    })}
                </> : ""}
            {data.participant_d4.length > 0 ?
                <>
                    <CCard className="mb-1" style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <CCardHeader style={{ paddingLeft: "20px" }}>
                            <h5><b>D4</b></h5>
                        </CCardHeader>
                    </CCard>
                    {data.is_more_than_timeline_d4 === true ? (
                        <div style={{ paddingBottom: "20px" }}>
                            <Alert
                                message="Catatan"
                                description="Formulir Data Evaluasi PKL tidak dapat diisi atau diubah karena diluar waktu yang telah ditetapkan."
                                type="info"
                                showIcon
                                closable />
                        </div>
                    ) : ""}
                    {data.participant_d4.map((item, i) => {
                        return <div key={i}>
                            <CCard className="mb-4" style={{overflowX: "scroll"}}>
                                <CCardBody>
                                    <Row align='middle'>
                                        <Col span={2}>
                                            <FontAwesomeIcon icon={faScroll} style={{ width: "50px", height: "50px" }} />
                                        </Col>
                                        <Col span={item.status_submit === 0 ? 16 : 19}>
                                            {item.participant_name}
                                        </Col>
                                        {item.status_submit === 0 && (<>
                                            <Col span={3} style={{ textAlign: "center" }}>
                                                <Button
                                                    id="create-evaluasi"
                                                    size="small"
                                                    shape="round"
                                                    style={{ color: "white", background: "#339900", width: "80px" }}
                                                    onClick={() => formulirEvaluasiPerusahaan(item)}
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
                                                onClick={() => detailEvaluasiPerusahaan(item)}
                                            >
                                                <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                                            </Button>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </CCard>
                        </div>
                    })}
                </> : ""}
        </>
    )
}

export default CardEvaluasiPerusahaan
