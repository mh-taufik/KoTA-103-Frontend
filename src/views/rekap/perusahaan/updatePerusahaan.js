import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { Col, Row, Form, Input, Button, DatePicker, Select, notification, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const UpdatePerusahaan = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [pic, setPic] = useState([]);
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState();
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

    function onChangePIC(value) {
        setData(pre => {
            return { ...pre, lecturer_id: value }
        })
    }

    function onChangeDateUpdate(date, dateString) {
        date && setData(pre => {
            return { ...pre, since_years: moment(date._d).format("yyyy") }
        })
    }

    useEffect(() => {
        if (!id) {
            history.push("/");
        } else {
            const getDetail = async () => {
                let url;
                if (localStorage.getItem("id_role") === "0") {
                    url = `${process.env.REACT_APP_API_GATEWAY_URL}company/${id}`;
                } else if (localStorage.getItem("id_role") === "2") {
                    url = `${process.env.REACT_APP_API_GATEWAY_URL}company/get-by-company`;
                }
                axios.defaults.withCredentials = true;
                await axios.get(url)
                    .then(function (response1) {
                        setData(response1.data.data)
                        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-committee`)
                            .then(function (response2) {
                                setPic(response2.data.data)
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
            getDetail();
        }
    }, [history, id]);

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
        });
    };

    const onFinish = async (index) => {
        enterLoading(index)
        let url;
        if (localStorage.getItem("id_role") === "0") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/update/${id}`;
        } else if (localStorage.getItem("id_role") === "2") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/update`
        }
        await axios.put(url, {
            company_name: data.company_name,
            company_email: data.company_email,
            address: data.address,
            no_phone: data.telp,
            cp_name: data.cp_name,
            cp_phone: data.cp_telp,
            cp_email: data.cp_email,
            cp_position: data.cp_position,
            website: data.website,
            num_employee: data.num_employee,
            since_year: data.since_years,
            status: data.status,
            lecturer_id: data.lecturer_id,
        }).then((response) => {
            if (localStorage.getItem("id_role") === "0") {
                setData({})
                notification.success({
                    message: 'Identitas perusahaan berhasil diubah'
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                history.push("/listPerusahaan");
            } else if (localStorage.getItem("id_role") === "2") {
                localStorage.setItem("name", data.company_name)
                setData({})
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                notification.success({
                    message: 'Profil perusahaan berhasil diubah'
                });
                history.push("/profilPerusahaan");
            }

        }).catch((error) => {
            setData({})
            notification.error({
                message: 'Perusahaan gagal diubah!'
            });
        });
    };

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CCard>
                <CCardHeader style={{ paddingLeft: "20px" }}>
                    <h5><b>Ubah Data Perusahaan</b></h5>
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
                                fields={data ? [
                                    {
                                        name: ['PIC'],
                                        value: data.lecturer_id && data.lecturer_id
                                    },
                                    {
                                        name: ['namaPerusahaan'],
                                        value: data.company_name && data.company_name
                                    },
                                    {
                                        name: ['websitePerusahaan'],
                                        value: data.website && data.website
                                    },
                                    {
                                        name: ['emailPerusahaan'],
                                        value: data.company_email && data.company_email
                                    },
                                    {
                                        name: ['nohpPerusahaan'],
                                        value: data.telp && data.telp
                                    },
                                    {
                                        name: ['address'],
                                        value: data.address && data.address
                                    },
                                    {
                                        name: ['tahunPerusahaan'],
                                        value: data.since_years && moment(data.since_years.toString())
                                    },
                                    {
                                        name: ['jmlKaryawan'],
                                        value: data.num_employee && data.num_employee
                                    },
                                    {
                                        name: ['CPPerusahaan'],
                                        value: data.cp_name && data.cp_name
                                    },
                                    {
                                        name: ['emailCP'],
                                        value: data.cp_email && data.cp_email
                                    },
                                    {
                                        name: ['nomorCP'],
                                        value: data.cp_telp && data.cp_telp
                                    },
                                    {
                                        name: ['jabatanCP'],
                                        value: data.cp_position && data.cp_position
                                    },
                                ] : ""}
                            >
                                {parseInt(localStorage.getItem("id_role")) === 0 && (
                                    <>
                                        <b>PIC (Panitia)</b><Form.Item
                                            name="PIC"
                                        >
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder="Pilih penanggung jawab"
                                                onChange={onChangePIC}
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                {pic.map((item, i) => (<Select.Option key={i} value={item.id_lecturer}>{item.name}</Select.Option>))}
                                            </Select>
                                        </Form.Item>
                                    </>
                                )}

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
                                            rules={[{ type: "email", message: 'Format email salah!' },
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
                                                        return { ...pre, telp: e.target.value }
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
                                            { type: "email", message: 'Format email salah!' }]}
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
                                                        return { ...pre, cp_telp: e.target.value }
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

export default UpdatePerusahaan
