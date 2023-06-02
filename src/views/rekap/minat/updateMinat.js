import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { Form, Select, Button, notification, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const UpdateMinat = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState({});
    let history = useHistory();
    const [chooseCompany, setChooseCompany] = useState([]);
    const [company, setCompany] = useState()
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

    function onChangeSistemKerja(value) {
        setData(pre => {
            return { ...pre, work_system: value }
        })
    }

    function onChangePriority1(value) {
        setData(pre => {
            return { ...pre, priority1: value }
        })
        chooseCompany[0] = value;
    }

    function onChangePriority2(value) {
        setData(pre => {
            return { ...pre, priority2: value }
        })
        chooseCompany[1] = value;
    }

    function onChangePriority3(value) {
        setData(pre => {
            return { ...pre, priority3: value }
        })
        chooseCompany[2] = value;
    }

    function onChangePriority4(value) {
        setData(pre => {
            return { ...pre, priority4: value }
        })
        chooseCompany[3] = value;
    }

    function onChangePriority5(value) {
        setData(pre => {
            return { ...pre, priority5: value }
        })
        chooseCompany[4] = value;
    }

    useEffect(() => {
        const getDetailMinat = async () => {
            let data = [];
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/detail`)
                .then(function (response1) {
                    setData(response1.data.data)
                    response1.data.data.priority1 && data.push(response1.data.data.priority1)
                    response1.data.data.priority2 && data.push(response1.data.data.priority2)
                    response1.data.data.priority3 && data.push(response1.data.data.priority3)
                    response1.data.data.priority4 && data.push(response1.data.data.priority4)
                    response1.data.data.priority5 && data.push(response1.data.data.priority5)
                    setChooseCompany(data);
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/get-all?type=dropdown`)
                        .then(function (response2) {
                            setCompany(response2.data.data)
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
        getDetailMinat();
    }, [history]);

    const onFinish = async (index) => {
        enterLoading(index)
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/update`, {
            work_system: data.work_system,
            priority1: data.priority1,
            priority2: data.priority2,
            priority3: data.priority3,
            priority4: data.priority4,
            priority5: data.priority5
        }).then((response) => {
            notification.success({
                message: 'Pemilihan perusahaan berhasil diubah'
            });
            history.push("/pemilihanPerusahaan");
        }).catch((error) => {
            notification.error({
                message: 'Pemilihan perusahaan gagal diubah!'
            });
        });
    };

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
          });
    };

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CCard>
                <CCardHeader style={{ paddingLeft: "20px" }}>
                    <h5><b>Update Pemilihan Perusahaan</b></h5>
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
                                fields={[data &&
                                {
                                    name: ['sistem kerja'],
                                    value: data.work_system ? data.work_system : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas1'],
                                    value: data.priority1 !== 0 ? data.priority1 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas2'],
                                    value: data.priority2 !== 0 ? data.priority2 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas3'],
                                    value: data.priority3 !== 0 ? data.priority3 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas4'],
                                    value: data.priority4 !== 0 ? data.priority4 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas5'],
                                    value: data.priority5 !== 0 ? data.priority5 : "Belum mengisi"
                                },
                                ]}
                            >
                                <b>Sistem Kerja yang Diinginkan</b>
                                <Form.Item
                                    name="sistem kerja"
                                    rules={[{ required: true, message: 'Sistem kerja tidak boleh kosong!' }]}
                                >
                                    <Select style={{ width: "100%" }} onChange={onChangeSistemKerja}>
                                        <Select.Option value="WFO">WFO</Select.Option>
                                        <Select.Option value="WFH">WFH</Select.Option>
                                        <Select.Option value="WFO dan WFH">WFO dan WFH</Select.Option>
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 1</b>
                                <Form.Item
                                    name="prioritas1"
                                >
                                    <Select style={{ width: "100%" }} onChange={onChangePriority1}>
                                        <Select.Option value={0}>Tidak memilih</Select.Option>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseCompany.includes(item.id)}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 2</b>
                                <Form.Item
                                    name="prioritas2"
                                >
                                    <Select style={{ width: "100%" }} onChange={onChangePriority2} >
                                        <Select.Option value={0}>Tidak memilih</Select.Option>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseCompany.includes(item.id)}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 3</b>
                                <Form.Item
                                    name="prioritas3"
                                >
                                    <Select style={{ width: "100%" }} onChange={onChangePriority3} >
                                        <Select.Option value={0}>Tidak memilih</Select.Option>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseCompany.includes(item.id)}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 4</b>
                                <Form.Item
                                    name="prioritas4"
                                >
                                    <Select style={{ width: "100%" }} onChange={onChangePriority4} >
                                        <Select.Option value={0}>Tidak memilih</Select.Option>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseCompany.includes(item.id)}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 5</b>
                                <Form.Item
                                    name="prioritas5"
                                >
                                    <Select style={{ width: "100%" }} onChange={onChangePriority5} >
                                        <Select.Option value={0}>Tidak memilih</Select.Option>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseCompany.includes(item.id)}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <CRow>
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
                                </CRow>
                            </Form>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default UpdateMinat
