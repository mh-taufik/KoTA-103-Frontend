import React
, { useState, useEffect }
    from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { Form, Radio, Row, Col, Spin, Alert } from 'antd';

import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const DetailFeedbackPerusahaan = () => {
    let history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState({});
    // const [pertanyaan, setPertanyaan] = useState([]);
    const [form] = Form.useForm();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    axios.defaults.withCredentials = true;

    useEffect(() => {
        if (location) {

        }
        const getDetail = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/feedback/${id}/${location.state.id_prodi}`)
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
        if (location) {
            getDetail();
        }
    }, [history, id, location]);

    return isLoading ? (<Spin indicator={antIcon} />) : (
        // return (
        <>
            {
                data.length !== 0 ? (
                    <CCard className="mb-4">
                        <CCardHeader style={{ paddingLeft: "20px" }}>
                            {localStorage.getItem("id_role") === "0" || localStorage.getItem("id_role") === "3" ? (
                                <Row>
                                    <Col span={12} style={{ textAlign: "left" }}>
                                        <h5><b>Feedback Pelaksanaan {localStorage.getItem("id_prodi") === "0" ? "Kerja Praktik" : "Praktik Kerja Lapangan"}</b></h5>
                                    </Col>
                                    <Col span={12} style={{ textAlign: "right" }}>
                                        <h5><b>{location.state.company_name}</b></h5>
                                    </Col>
                                </Row>
                            ) : (
                                <h5><b>Feedback Pelaksanaan {parseInt(location.state.id_prodi) === 0 ? "Kerja Praktik" : "Praktik Kerja Lapangan"}</b></h5>
                            )}
                        </CCardHeader>
                        <CCardBody style={{ paddingLeft: "20px" }}>
                            <Form
                                form={form}
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                // onFinish={() => onFinish(0)}
                                // onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                {data.map((item, index) => (
                                    <div key={index}>
                                        <CRow>
                                            <CCol sm={12}>
                                                <b>{item.question}</b>
                                            </CCol>
                                        </CRow><div style={{ paddingTop: "10px" }}>
                                            <Form.Item
                                                name={`pertanyaan-${item.id}`}
                                                style={{ marginBottom: "0px" }}
                                            >
                                                <Row>
                                                    <Radio.Group
                                                        value={item.value}
                                                        disabled={true}
                                                        style={{ width: "100%" }}
                                                    >
                                                        <Row>
                                                            <Col style={{ textAlign: "center", width: "20%" }}>
                                                                <Radio value={5}>Sangat baik</Radio><br />
                                                            </Col>
                                                            <Col style={{ textAlign: "center", width: "20%" }}>
                                                                <Radio value={4}>Baik</Radio><br />
                                                            </Col>
                                                            <Col style={{ textAlign: "center", width: "20%" }}>
                                                                <Radio value={3}>Cukup baik</Radio><br />
                                                            </Col>
                                                            <Col style={{ textAlign: "center", width: "20%" }}>
                                                                <Radio value={2}>Kurang baik</Radio><br />
                                                            </Col>
                                                            <Col style={{ textAlign: "center", width: "20%" }}>
                                                                <Radio value={1}>Buruk</Radio>
                                                            </Col>
                                                        </Row>
                                                    </Radio.Group>
                                                </Row>
                                            </Form.Item>
                                        </div>
                                        <hr style={{ border: "1px solid black" }} />
                                    </div>
                                ))}
                            </Form>
                        </CCardBody>
                    </CCard >
                ) : (
                    <div style={{ paddingBottom: "20px" }} >
                        <Alert
                            message="Catatan"
                            description={`Data feedback belum diisi`}
                            type="info"
                            showIcon
                            closable />
                    </div >
                )
            }
        </>
    )
}

export default DetailFeedbackPerusahaan
