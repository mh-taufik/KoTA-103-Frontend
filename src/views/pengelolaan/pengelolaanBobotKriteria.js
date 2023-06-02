import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { Col, Row, Form, Input, Button, notification, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const PengelolaanBobotKriteria = () => {
    const [form] = Form.useForm();
    const [bobot, setBobot] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    let history = useHistory();
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

    axios.defaults.withCredentials = true;

    const refreshData = (index) => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/criteria`)
            .then(result => {
                setBobot({
                    bobotMinat: result.data.data[0].percentageValue,
                    bobotBahasaPemrograman: result.data.data[1].percentageValue,
                    bobotDatabase: result.data.data[2].percentageValue,
                    bobotFramework: result.data.data[3].percentageValue,
                    bobotTools: result.data.data[4].percentageValue,
                    bobotModelling: result.data.data[5].percentageValue,
                    bobotBahasaKomunikasi: result.data.data[6].percentageValue,
                    bobotDomisili: result.data.data[7].percentageValue,
                    bobotPrioritas: result.data.data[8].percentageValue,
                })
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            })
    }

    useEffect(() => {
        async function getDataBobot() {
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/criteria`)
                .then(result => {
                    setBobot({
                        bobotMinat: result.data.data[0].percentageValue,
                        bobotBahasaPemrograman: result.data.data[1].percentageValue,
                        bobotDatabase: result.data.data[2].percentageValue,
                        bobotFramework: result.data.data[3].percentageValue,
                        bobotTools: result.data.data[4].percentageValue,
                        bobotModelling: result.data.data[5].percentageValue,
                        bobotBahasaKomunikasi: result.data.data[6].percentageValue,
                        bobotDomisili: result.data.data[7].percentageValue,
                        bobotPrioritas: result.data.data[8].percentageValue,
                    })
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
        getDataBobot()
    }, [history]);

    const onFinish = async (index) => {
        if (countBobot() === 100) {
            enterLoading(index)
            await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/criteria/update`,
                [
                    {
                        id: 1,
                        percentageValue: parseInt(form.getFieldValue('minatPekerjaan'))
                    },
                    {
                        id: 2,
                        percentageValue: parseInt(form.getFieldValue('bahasaPemrograman'))
                    },
                    {
                        id: 3,
                        percentageValue: parseInt(form.getFieldValue('database'))
                    },
                    {
                        id: 4,
                        percentageValue: parseInt(form.getFieldValue('framework'))
                    },
                    {
                        id: 5,
                        percentageValue: parseInt(form.getFieldValue('tools'))
                    },
                    {
                        id: 6,
                        percentageValue: parseInt(form.getFieldValue('modelling'))
                    },
                    {
                        id: 7,
                        percentageValue: parseInt(form.getFieldValue('bahasaKomunikasi'))
                    },
                    {
                        id: 8,
                        percentageValue: parseInt(form.getFieldValue('domisili'))
                    },
                    {
                        id: 9,
                        percentageValue: parseInt(form.getFieldValue('prioritasPerusahaan'))
                    }
                ]
            ).then((response) => {
                notification.success({
                    message: 'Data bobot kriteria berhasil diubah'
                });
                refreshData(index);
            }).catch((error) => {
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                notification.error({
                    message: 'Data bobot kriteria gagal diubah'
                });
            });
        } else {
            notification.error({
                message: 'Jumlah semua bobot harus 100'
            });
        }
    };

    const isKosong = (angka) => {
        return angka ? angka : 0
    }

    const countBobot = () => {
        return parseInt(isKosong(bobot.bobotMinat)) + parseInt(isKosong(bobot.bobotDomisili)) + parseInt(isKosong(bobot.bobotPrioritas))
            + parseInt(isKosong(bobot.bobotBahasaPemrograman)) + parseInt(isKosong(bobot.bobotDatabase)) + parseInt(isKosong(bobot.bobotFramework))
            + parseInt(isKosong(bobot.bobotTools)) + parseInt(isKosong(bobot.bobotModelling)) + parseInt(isKosong(bobot.bobotBahasaKomunikasi))
    }
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CCard>
                <CCardHeader style={{ paddingLeft: "20px" }}>
                    <Row align="middle">
                        <Col>
                            <h5>
                                <b>
                                    Pengelolaan Bobot Kriteria Perangkingan &nbsp;
                                </b>
                            </h5>
                        </Col>
                        <Col>
                            {(countBobot() !== 100 ? (<span style={{ color: "red" }}>* Jumlah semua bobot harus 100</span>) : "")}
                        </Col>
                    </Row>
                </CCardHeader>
                <CCardBody style={{ paddingLeft: "20px" }}>
                    <CRow>
                        <CCol sm={12}>
                            <Form
                                form={form}
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                onFinish={() => onFinish(0)}
                                // onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                fields={[
                                    {
                                        name: ["minatPekerjaan"],
                                        value: bobot.bobotMinat
                                    },
                                    {
                                        name: ["domisili"],
                                        value: bobot.bobotDomisili
                                    },
                                    {
                                        name: ["prioritasPerusahaan"],
                                        value: bobot.bobotPrioritas
                                    },
                                    {
                                        name: ["bahasaPemrograman"],
                                        value: bobot.bobotBahasaPemrograman
                                    },
                                    {
                                        name: ["database"],
                                        value: bobot.bobotDatabase
                                    },
                                    {
                                        name: ["framework"],
                                        value: bobot.bobotFramework
                                    },
                                    {
                                        name: ["tools"],
                                        value: bobot.bobotTools
                                    },
                                    {
                                        name: ["modelling"],
                                        value: bobot.bobotModelling
                                    },
                                    {
                                        name: ["bahasaKomunikasi"],
                                        value: bobot.bobotBahasaKomunikasi
                                    }
                                ]}
                            >
                                <Row style={{ paddingLeft: "30px" }}>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Minat Pekerjaan</b>
                                        <Form.Item
                                            name="minatPekerjaan"
                                            rules={[{ message: 'Format bobot minat pekerjaan hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot minat pekerjaan tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotMinat: e.target.value }
                                                    })
                                                }} value={bobot.bobotMinat}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Domisili</b>
                                        <Form.Item
                                            name="domisili"
                                            rules={[{ message: 'Format bobot domisili hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot domisili tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotDomisili: e.target.value }
                                                    })
                                                }} value={bobot.bobotDomisili}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Prioritas Perusahaan</b>
                                        <Form.Item
                                            name="prioritasPerusahaan"
                                            rules={[{ message: 'Format bobot prioritas perusahaan hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot prioritas perusahaan tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotPrioritas: e.target.value }
                                                    })
                                                }} value={bobot.bobotPrioritas}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: "30px" }}>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Bahasa Pemrograman</b>
                                        <Form.Item
                                            name="bahasaPemrograman"
                                            rules={[{ message: 'Format bobot bahasa pemrograman hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot bahasa pemrograman tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotBahasaPemrograman: e.target.value }
                                                    })
                                                }} value={bobot.bobotBahasaPemrograman}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Database</b>
                                        <Form.Item
                                            name="database"
                                            rules={[{ message: 'Format bobot database hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot database tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotDatabase: e.target.value }
                                                    })
                                                }} value={bobot.bobotDatabase}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Framework</b>
                                        <Form.Item
                                            name="framework"
                                            rules={[{ message: 'Format bobot framework hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot framework tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotFramework: e.target.value }
                                                    })
                                                }} value={bobot.bobotFramework}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: "30px" }}>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Tools</b>
                                        <Form.Item
                                            name="tools"
                                            rules={[{ message: 'Format bobot tools hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot tools tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotTools: e.target.value }
                                                    })
                                                }} value={bobot.bobotTools}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Modelling</b>
                                        <Form.Item
                                            name="modelling"
                                            rules={[{ message: 'Format bobot modelling hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot modelling tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotModelling: e.target.value }
                                                    })
                                                }} value={bobot.bobotModelling}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ paddingRight: "30px" }}>
                                        <b>Bahasa Komunikasi</b>
                                        <Form.Item
                                            name="bahasaKomunikasi"
                                            rules={[{ message: 'Format bobot bahasa komunikasi hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Bobot bahasa komunikasi tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                addonAfter="%"
                                                onChange={e => {
                                                    setBobot(pre => {
                                                        return { ...pre, bobotBahasaKomunikasi: e.target.value }
                                                    })
                                                }} value={bobot.bobotBahasaKomunikasi}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                                    <Col span={6} style={{ textAlign: "left" }}>
                                        Jumlah bobot saat ini: {countBobot()}% 
                                    </Col>
                                    <Col span={18} style={{ textAlign: "right" }}>
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
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default PengelolaanBobotKriteria
