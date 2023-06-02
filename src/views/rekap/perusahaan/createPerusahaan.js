import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { Col, Row, Form, Input, Button, DatePicker, Select, notification, Spin, Modal } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const CreatePerusahaan = () => {
    const [form] = Form.useForm();
    const [pic, setPic] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }
    const [data, setData] = useState({
        company_name: "",
        company_email: "",
        address: "",
        no_phone: "",
        cp_name: "",
        cp_phone: "",
        cp_email: "",
        cp_position: "",
        website: "",
        num_employee: "",
        since_year: "",
        status: false,
        lecturer_id: "",
    })
    let history = useHistory();

    function onChangePIC(value) {
        setData(pre => {
            return { ...pre, lecturer_id: value }
        })
    }

    function onChangeDateUpdate(date, dateString) {
        date && setData(pre => {
            return { ...pre, since_year: moment(date._d).format("yyyy") }
        })
    }
    useEffect(() => {
        const getPic = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-committee`)
                .then(function (response) {
                    setPic(response.data.data)
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
        getPic();
    }, [history]);

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
        });
    };

    const onFinish = async (index) => {
        enterLoading(index)
        await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}company/create`, {
            company_name: data.company_name,
            company_email: data.company_email,
            address: data.address,
            no_phone: data.no_phone,
            cp_name: data.cp_name,
            cp_phone: data.cp_phone,
            cp_email: data.cp_email,
            cp_position: data.cp_position,
            website: data.website,
            num_employee: data.num_employee,
            since_year: data.since_year,
            status: false,
            lecturer_id: data.lecturer_id,
        }).then((response) => {
            setData({})
            notification.success({
                message: 'Perusahaan berhasil dibuat'
            });
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            Modal.info({
                title: `Data perusahaan dan akun perusahaan berhasil dibuat`,
                content: (
                    <>
                        Berikut merupakan username dan password dari akun perusahaan yang telah dibuat<br />
                        Username : {data.company_email}<br />
                        Password : 1234
                    </>
                ),
                okText: "Ok",
                cancelText: "Close",
                onOk: () => {
                    history.push("/listPerusahaan");
                },
                onCancel: () => {
                    history.push("/listPerusahaan");
                },
            })
        }).catch((error) => {
            setData({})
            console.log(error.response.data.message)
            if(error.response.data.message.search("Username already taken") === -1){
                notification.error({
                    message: 'Perusahaan gagal dibuat!'
                });
            }else{
                notification.error({
                    message: 'Email perusahaan sudah ada!'
                });
            }
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            
        });
    };
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CCard>
                <CCardHeader style={{ paddingLeft: "20px" }}>
                    <h5><b>Tambah Perusahaan</b></h5>
                </CCardHeader>
                <CCardBody style={{ paddingLeft: "20px" }}>
                    <CRow>
                        <CCol sm={12}>
                            <Form
                                form={form}
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                onFinish={() => onFinish(0)}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <b>PIC (Panitia)</b>
                                <Form.Item
                                    name="PIC"
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder="Pilih penanggung jawab"
                                        onChange={onChangePIC}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {pic.map((item, i) => (<Select.Option key={i} value={item.id_lecturer}>{item.name}</Select.Option>))}
                                    </Select>
                                </Form.Item>

                                <b>Nama Perusahaan<span style={{ color: "red" }}> *</span></b>
                                <Form.Item
                                    name="namaPerusahaan"
                                    rules={[{ required: true, message: 'Nama perusahaan tidak boleh kosong!' }]}
                                >
                                    <Input
                                        onChange={e => {
                                            setData(pre => {
                                                return { ...pre, company_name: e.target.value }
                                            })
                                        }}
                                    />
                                </Form.Item>

                                <b>Website Official Perusahaan</b>
                                <Form.Item
                                    name="websitePerusahaan"
                                >
                                    <Input
                                        onChange={e => {
                                            setData(pre => {
                                                return { ...pre, website: e.target.value }
                                            })
                                        }}
                                    />
                                </Form.Item>

                                <Row>
                                    <Col span={12} style={{ paddingRight: "20px" }}>
                                        <b>Email Perusahaan<span style={{ color: "red" }}> *</span></b>
                                        <Form.Item
                                            name="emailPerusahaan"
                                            rules={[{ message: 'Format email salah!', type: "email"  },
                                            { required: true, message: 'Email perusahaan tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                placeholder='ex: foo@gmail.com'
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, company_email: e.target.value }
                                                    })
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <b>Nomor Telepon Perusahaan<span style={{ color: "red" }}> *</span></b>
                                        <Form.Item
                                            name="nohpPerusahaan"
                                            rules={[{ message: 'Format nomor telepon hanya angka!', pattern: /^\d+$/ },
                                            { required: true, message: 'Nomor telepon tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                pattern="[+-]?\d+(?:[.,]\d+)?"
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, no_phone: e.target.value }
                                                    })
                                                }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <b>Alamat<span style={{ color: "red" }}> *</span></b>
                                <Form.Item
                                    name="address"
                                    rules={[{ required: true, message: 'Alamat tidak boleh kosong!' }]}
                                >
                                    <Input
                                        onChange={e => {
                                            setData(pre => {
                                                return { ...pre, address: e.target.value }
                                            })
                                        }}
                                    />
                                </Form.Item>
                                <Row>
                                    <Col span={12}>
                                        <b>Tahun Berdirinya Perusahaan</b>
                                        <Form.Item
                                            name="tahunPerusahaan"
                                            style={{ paddingRight: "20px" }}
                                        >
                                            <DatePicker picker="year" style={{ width: "100%" }} onChange={onChangeDateUpdate} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <b>Jumlah Karyawan</b>
                                        <Form.Item
                                            name="jmlKaryawan"
                                            rules={[{ message: 'Format jumlah karyawan hanya angka!', pattern: /^\d+$/ }]}
                                        >
                                            <Input
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, num_employee: e.target.value }
                                                    })
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <b>Nama Narahubung<span style={{ color: "red" }}> *</span></b>
                                <Form.Item
                                    name="CPPerusahaan"
                                    rules={[{ required: true, message: 'Nama narahubung tidak boleh kosong!' }]}
                                >
                                    <Input
                                        onChange={e => {
                                            setData(pre => {
                                                return { ...pre, cp_name: e.target.value }
                                            })
                                        }}
                                    />
                                </Form.Item>
                                <Row>
                                    <Col span={8}>
                                        <b>Email Narahubung<span style={{ color: "red" }}> *</span></b>
                                        <Form.Item
                                            name="emailCP"
                                            rules={[{ required: true, message: 'Email narahubung tidak boleh kosong!' },
                                            { required: true, message: 'Format email salah!', type: "email"  }]}
                                            style={{ paddingRight: "20px" }}
                                        >
                                            <Input
                                                placeholder='ex: foo@gmail.com'
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, cp_email: e.target.value }
                                                    })
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <b>Nomor Narahubung<span style={{ color: "red" }}> *</span></b>
                                        <Form.Item
                                            name="nomorCP"
                                            rules={[{ required: true, message: 'Nomor telepon narahubung tidak boleh kosong!' },
                                            { required: true, message: 'Format nomor narahubung hanya angka!', pattern: /^\d+$/ }]}
                                            style={{ paddingRight: "20px" }}
                                        >
                                            <Input
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, cp_phone: e.target.value }
                                                    })
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <b>Jabatan Narahubung<span style={{ color: "red" }}> *</span></b>
                                        <Form.Item
                                            name="jabatanCP"
                                            rules={[{ required: true, message: 'Jabatan narahubung tidak boleh kosong!' }]}
                                        >
                                            <Input
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, cp_position: e.target.value }
                                                    })
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <CCol sm={12} style={{ textAlign: "right" }}>
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
                                    </CCol>
                                </Row>
                            </Form>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default CreatePerusahaan
