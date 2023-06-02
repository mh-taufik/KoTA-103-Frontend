import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';
import { Form, Select, Spin } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const DetailMinat = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState({});
    const [company, setCompany] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    let history = useHistory();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const getDetailMinat = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/detail`)
                .then(function (response1) {
                    setData(response1.data.data)
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
    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CCard>
                <CCardHeader style={{ paddingLeft: "20px" }}>
                    <h5><b>Detail Pemilihan Perusahaan</b></h5>
                </CCardHeader>
                <CCardBody style={{ paddingLeft: "20px" }}>
                    <CRow>
                        <CCol sm={12}>
                            <Form
                                form={form}
                                name="basic"
                                wrapperCol={{ span: 24 }}
                                // onFinish={onFinish}
                                // onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                fields={[data &&
                                {
                                    name: ['sistem kerja'],
                                    value: data.work_system ? data.work_system : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas1'],
                                    value: data.priority1 !== 0  ? data.priority1 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas2'],
                                    value: data.priority2 !== 0  ? data.priority2 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas3'],
                                    value: data.priority3 !== 0  ? data.priority3 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas4'],
                                    value: data.priority4 !== 0  ? data.priority4 : "Belum mengisi"
                                },
                                {
                                    name: ['prioritas5'],
                                    value: data.priority5 !== 0  ? data.priority5 : "Belum mengisi"
                                },
                                ]}
                            >
                                <b>Sistem Kerja yang Diinginkan</b>
                                <Form.Item
                                    name="sistem kerja"
                                >
                                    <Select disabled style={{ width: "100%" }}>
                                        <Select.Option value="WFO">WFO</Select.Option>
                                        <Select.Option value="WFH">WFH</Select.Option>
                                        <Select.Option value="WFO & WFH">WFO & WFH</Select.Option>
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 1</b>
                                <Form.Item
                                    name="prioritas1"
                                >
                                    <Select disabled style={{ width: "100%" }}>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 2</b>
                                <Form.Item
                                    name="prioritas2"
                                >
                                    <Select disabled style={{ width: "100%" }}>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 3</b>
                                <Form.Item
                                    name="prioritas3"
                                >
                                    <Select disabled style={{ width: "100%" }}>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 4</b>
                                <Form.Item
                                    name="prioritas4"
                                >
                                    <Select disabled style={{ width: "100%" }}>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <b>Prioritas Perusahaan 5</b>
                                <Form.Item
                                    name="prioritas5"
                                >
                                    <Select disabled style={{ width: "100%" }}>
                                        {company && company.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                    </Select>
                                </Form.Item>

                            </Form>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default DetailMinat
