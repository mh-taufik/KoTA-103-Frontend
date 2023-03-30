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
import { Form, Radio, Row, Col, Button, Modal, notification, Spin } from 'antd';

import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const FormulirFeedbackPerusahaan = () => {
    let history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true)
    const [loadings, setLoadings] = useState([]);
    const location = useLocation();
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

    const onFinish = (index) => {
        Modal.confirm({
            title: "Setelah disimpan, formulir feedback tidak dapat diubah kembali!",
            content: "Pastikan semua isian data sudah benar, Simpan data feedback?",
            okText: "Ya",
            onOk: () => {
                handleOkCreate(index)
            }
        })
    }

    const handleOkCreate = async (index) => {
        let jawaban = [];
        data.map(item => (
            jawaban.push({
                question: item.question,
                value: form.getFieldValue(`pertanyaan-${item.id}`)
            })
        ))
        enterLoading(index)
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}company/feedback/update/${location.state.id_prodi}`,
            jawaban
        )
            .then(function (response) {
                notification.success({
                    message: `Feedback pelaksanaan ${location.state.id_prodi === 0 ? "kerja praktik" : "praktik kerja lapangan"} berhasil diisi`,
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                Modal.confirm({
                    title: "Terimakasih telah mengisikan formulir feedback perusahaan.",
                    // content: "Pastikan semua isian data sudah benar, Simpan data evaluasi?",
                    okText: "Ya",
                    onOk: () => {
                        history.push({
                            pathname: "/dataFeedbackPerusahaan",
                            state: {
                                session: true,
                            }
                        });
                    },
                    cancelButtonProps: { disabled: true, className: "modal-footer-hiden-button" }
                })
            })
            .catch(function (error) {
                notification.success({
                    message: `Evaluasi pelaksanaan ${location.state.id_prodi === 0 ? "kerja praktik" : "praktik kerja lapangan"} gagal diisi`,
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            });
    }

    useEffect(() => {
        const getDetail = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/feedback-question/get-all/${location.state.id_prodi}`)
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
        getDetail();
    }, [history, location.state.id_prodi, id]);

    return isLoading ? (<Spin indicator={antIcon} />) : (
        // return (
        <CCard className="mb-4">
            <CCardHeader style={{ paddingLeft: "20px" }}>
                <h5><b>Feedback Pelaksanaan {location.state.id_prodi === 0 ? "Kerja Praktik" : "Praktik Kerja Lapangan"}</b></h5>
            </CCardHeader>
            <CCardBody style={{ paddingLeft: "20px" }}>
                <Form
                    form={form}
                    name="basic"
                    wrapperCol={{ span: 24 }}
                    onFinish={() => onFinish(0)}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {data.map(item => (
                        <div key={item.id}>
                            <CRow>
                                <CCol sm={12}>
                                    <b>{item.question}<span style={{ color: "red" }}> *</span></b>
                                </CCol>
                            </CRow><div style={{ paddingTop: "10px" }}>
                                <Form.Item
                                    name={`pertanyaan-${item.id}`}
                                    style={{ marginBottom: "0px" }}
                                    rules={[{ required: true, message: 'Pilih salah satu!' }]}
                                >
                                    <Row>
                                        <Radio.Group
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

                    <Row>
                        <Col span={24} style={{ paddingTop: "20px", textAlign: "right" }}>
                            <Button
                                id="button-submit"
                                size="sm"
                                shape="round"
                                loading={loadings[0]}
                                style={{ color: "white", background: "#3399FF", marginBottom: 16 }}
                                onClick={form.submit}
                            >
                                Simpan
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </CCardBody>
        </CCard>
    )
}

export default FormulirFeedbackPerusahaan
