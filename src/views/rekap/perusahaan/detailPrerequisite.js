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
import { Tabs, Row, Col, Form, Input, Select, Spin, Table } from 'antd';

import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TabPane } = Tabs;

const DetailPrerequisite = () => {
    let history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [jobscope, setJobscope] = useState();
    const [kompetensi, setKompetensi] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [proyek, setProyek] = useState([]);
    axios.defaults.withCredentials = true;

    useEffect(() => {
        if (!id) {
            history.push("/");
        } else {
            const getDetail = async () => {
                let kp = [];
                let pkl = [];
                let data = [];
                let data2 = [];
                axios.defaults.withCredentials = true;
                await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/${id}`)
                    .then(function (response1) {
                        setData(response1.data.data)
                        if (response1.data.data.project) {
                            if (response1.data.data.project.split("|").length !== 0) {
                                response1.data.data.project.split("|").map(item => {
                                    return item.split("**")[2] === "d3" ? kp.push({
                                        name: item.split("**")[0],
                                        kuota: item.split("**")[1],
                                        prodi: "D3"
                                    }) : pkl.push({
                                        name: item.split("**")[0],
                                        kuota: item.split("**")[1],
                                        prodi: "D4"
                                    })
                                })
                                data = kp.concat(pkl)
                            } else {
                                response1.data.data.project.split("**")[2] === "d3" ? kp.push({
                                    name: response1.data.data.project.split("**")[0],
                                    kuota: response1.data.data.project.split("**")[1],
                                    prodi: "D3"
                                }) : pkl.push({
                                    name: response1.data.data.project.split("**")[0],
                                    kuota: response1.data.data.project.split("**")[1],
                                    prodi: "D4"
                                })
                                data = kp.concat(pkl)
                            }
                            data.map((item, index) => {
                                return data2.push({
                                    id: index,
                                    name: `${item.name} (${item.kuota} mahasiswa / ${item.prodi})`
                                })
                            })
                            setProyek(data2)
                        }

                        if (response1.data.data.region_id === 0) {
                            setData(pre => {
                                return { ...pre, region_id: "Lain - lain" }
                            })
                        } else {
                            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/domicile/${response1.data.data.region_id}`)
                                .then(function (response2) {
                                    setData(pre => {
                                        return { ...pre, region_id: response2.data.data }
                                    })
                                })
                        }
                        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/0`)
                            .then(function (response4) {
                                axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/1`)
                                    .then(function (response5) {
                                        setJobscope(response4.data.data.concat(response5.data.data))
                                    })
                                axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/0`)
                                    .then(function (response6) {
                                        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/1`)
                                            .then(function (response7) {
                                                setKompetensi(response6.data.data.concat(response7.data.data))
                                                setIsLoading(false)
                                            })
                                    })
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

    const getKompetensi = () => {
        let kompetensi = [];

        if (data.jobscopes_d3) {
            kompetensi = kompetensi.concat(data.jobscopes_d3.map((item, i) =>
            (
                {
                    name: [`cakupanPekerjaanD3-${i}`],
                    value: item.id_jobscope,
                }
            )))
        }
        if (data.jobscopes_d4) {
            kompetensi = kompetensi.concat(data.jobscopes_d4.map((item, i) =>
            (
                {
                    name: [`cakupanPekerjaanD4-${i}`],
                    value: item.id_jobscope,
                }
            )))
        }
        if (data.competencies_d3) {
            if (data.competencies_d3.filter(item => item.competence_type === 1).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d3.filter(item => item.competence_type === 1).map((item, i) =>
                (
                    {
                        name: [`bahasaPemrogramanD3-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d3.filter(item => item.competence_type === 2).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d3.filter(item => item.competence_type === 2).map((item, i) =>
                (
                    {
                        name: [`databaseD3-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d3.filter(item => item.competence_type === 3).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d3.filter(item => item.competence_type === 3).map((item, i) =>
                (
                    {
                        name: [`frameworkD3-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d3.filter(item => item.competence_type === 4).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d3.filter(item => item.competence_type === 4).map((item, i) =>
                (
                    {
                        name: [`toolsD3-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d3.filter(item => item.competence_type === 5).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d3.filter(item => item.competence_type === 5).map((item, i) =>
                (
                    {
                        name: [`modellingD3-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d3.filter(item => item.competence_type === 6).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d3.filter(item => item.competence_type === 6).map((item, i) =>
                (
                    {
                        name: [`bahasaKomunikasiD3-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
        }
        if (data.competencies_d4) {
            if (data.competencies_d4.filter(item => item.competence_type === 1).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d4.filter(item => item.competence_type === 1).map((item, i) =>
                (
                    {
                        name: [`bahasaPemrogramanD4-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d4.filter(item => item.competence_type === 2).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d4.filter(item => item.competence_type === 2).map((item, i) =>
                (
                    {
                        name: [`databaseD4-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d4.filter(item => item.competence_type === 3).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d4.filter(item => item.competence_type === 3).map((item, i) =>
                (
                    {
                        name: [`frameworkD4-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d4.filter(item => item.competence_type === 4).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d4.filter(item => item.competence_type === 4).map((item, i) =>
                (
                    {
                        name: [`toolsD4-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d4.filter(item => item.competence_type === 5).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d4.filter(item => item.competence_type === 5).map((item, i) =>
                (
                    {
                        name: [`modellingD4-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
            if (data.competencies_d4.filter(item => item.competence_type === 6).length > 0) {
                kompetensi = kompetensi.concat(data.competencies_d4.filter(item => item.competence_type === 6).map((item, i) =>
                (
                    {
                        name: [`bahasaKomunikasiD4-${i}`],
                        value: item.id_competence,
                    }
                )))
            }
        }

        return kompetensi;
    }

    // const getFacility = () => {
    //     let facility = data.facility.split('|');
    //     for (var i = 0; i < facility.length; i++) {
    //         facility[i] = facility[i].trim().charAt(0).toUpperCase() + facility[i].trim().slice(1);
    //     }
    //     return facility
    // }

    const columnsProyek = [
        {
            title: 'No',
            dataIndex: 'no',
            width: '5%',
            align: "center",
            render: (value, item, index) => {
                return index + 1
            }
        },
        {
            title: 'Nama Proyek',
            dataIndex: 'keterangan',
            render: (value, item, index) => {
                return item.name
            }
        }
    ]

    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <Tabs type="card">
                <TabPane tab="Umum" key="1">
                    <CCard className="mb-4">
                        <CCardHeader style={{ paddingLeft: "20px" }}>
                            <h5><b>Prerequisite Perusahaan {data.company_name ? data.company_name : "Tidak ada nama"}</b></h5>
                        </CCardHeader>
                        <CCardBody style={{ paddingLeft: "40px", paddingRight: "20px" }}>
                            <CRow>
                                <CCol sm={6}>
                                    <CRow><CCol sm={12}><b>Alamat Pelaksanaan Proyek</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.practical_address ? data.practical_address : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Domisili</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.region_id ? data.region_id : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Sistem Kerja</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.work_system ? data.work_system : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jumlah Kuota Mahasiswa D3</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.total_d3 ? data.total_d3 : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jumlah Kuota Mahasiswa D4</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.total_d4 !== null ? data.total_d4 : "belum diisi"}</CCol></CRow>
                                </CCol>
                                <CCol sm={6}>
                                    <CRow><CCol sm={12}><b>Nama Pembimbing Industri</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.in_advisor_name ? data.in_advisor_name : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Email Pembimbing Industri</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.in_advisor_mail ? data.in_advisor_mail : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jabatan Pembimbing Industri</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.in_advisor_position ? data.in_advisor_position : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Fasilitas</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.facility ? data.facility : "belum diisi"}</CCol></CRow>
                                    <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Keterangan</b></CCol></CRow>
                                    <CRow><CCol sm={12}>{data.description ? <div className="preview" dangerouslySetInnerHTML={createMarkup(data.description)}></div> : "belum diisi"}</CCol></CRow>
                                </CCol>
                            </CRow>
                            <hr />
                            <CRow>
                                <CCol sm={12}>
                                    <div style={{ paddingBottom: "10px" }}><b>Proyek Yang Akan Dikerjakan</b></div>
                                    <Table
                                        scroll={{ x: "max-content" }}
                                        columns={columnsProyek}
                                        dataSource={proyek ? proyek : ""}
                                        pagination={false}
                                        rowKey="id"
                                        bordered />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </TabPane>
                <TabPane tab="Cakupan Pekerjaan" key="2">
                    <CCard className="mb-4">
                        <CCardHeader style={{ paddingLeft: "20px" }}>
                            <h5><b>Prerequisite Perusahaan {data.company_name ? data.company_name : "Tidak ada nama"}</b></h5>
                        </CCardHeader>
                        <Tabs type="card" defaultActiveKey={data.total_d3 > 0 ? "0" : data.total_d4 > 0 ? "1" : "0"}>
                            <TabPane tab={"Kerja Praktik"} key={"0"} disabled={data.total_d3 === 0}>
                                <CCardBody style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                                    <Row>
                                        <Col span={24}>
                                            <Form
                                                form={form}
                                                name="basic"
                                                wrapperCol={{ span: 24 }}
                                                // onFinish={onFinish}
                                                // onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                                fields={data ? getKompetensi() : ""}
                                            >
                                                <b>Cakupan Pekerjaan</b>
                                                {data ? data.jobscopes_d3.length > 0 ? data.jobscopes_d3.map((item, i) => (
                                                    <div key={i}>
                                                        <Form.Item
                                                            name={`cakupanPekerjaanD3-${i}`}
                                                            key={i}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {jobscope && jobscope.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                )) : (
                                                    <><Row style={{ paddingTop: "5px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row><br /></>
                                                ) : ""}
                                            </Form>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab={"Praktik Kerja Lapangan"} key={"1"} disabled={data.total_d4 === 0}>
                                <CCardBody style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                                    <Row>
                                        <Col span={24}>
                                            <Form
                                                form={form}
                                                name="basic"
                                                wrapperCol={{ span: 24 }}
                                                // onFinish={onFinish}
                                                // onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                                fields={data ? getKompetensi() : ""}
                                            >
                                                <b>Cakupan Pekerjaan</b>
                                                {data ? data.jobscopes_d4.length > 0 ? data.jobscopes_d4.map((item, i) => (
                                                    <div key={i}>
                                                        <Form.Item
                                                            name={`cakupanPekerjaanD4-${i}`}
                                                            key={i}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {jobscope && jobscope.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                )) : (
                                                    <><Row style={{ paddingTop: "5px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row><br /></>
                                                ) : ""}
                                            </Form>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </TabPane>
                        </Tabs>
                    </CCard>
                </TabPane>
                <TabPane tab="Kompetensi" key="3">
                    <CCard className="mb-4">
                        <CCardHeader style={{ paddingLeft: "20px" }}>
                            <h5><b>Prerequisite Perusahaan {data.company_name ? data.company_name : "Tidak ada nama"}</b></h5>
                        </CCardHeader>
                        <Tabs type="card" defaultActiveKey={data.total_d3 > 0 ? "0" : data.total_d4 > 0 ? "1" : "0"}>
                            <TabPane tab={"Kerja Praktik"} key={"0"} disabled={data.total_d3 === 0}>
                                <CCardBody style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                                    <Row>
                                        <Col span={24}>
                                            <Form
                                                form={form}
                                                name="basic"
                                                wrapperCol={{ span: 24 }}
                                                // onFinish={onFinish}
                                                // onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                                fields={data ? getKompetensi() : ""}
                                            >
                                                <b>Bahasa Pemrograman</b>
                                                {data ? data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 1).length > 0 ?
                                                    data.competencies_d3.filter(item => item.competence_type === 1).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`bahasaPemrogramanD3-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 1).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Database</b>
                                                {data ? data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 2).length > 0 ?
                                                    data.competencies_d3.filter(item => item.competence_type === 2).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`databaseD3-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 2).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Framework</b>
                                                {data ? data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 3).length > 0 ?
                                                    data.competencies_d3.filter(item => item.competence_type === 3).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`frameworkD3-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 3).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Tools</b>
                                                {data ? data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 4).length > 0 ?
                                                    data.competencies_d3.filter(item => item.competence_type === 4).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`toolsD3-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 4).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Modelling Tools</b>
                                                {data ? data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 5).length > 0 ?
                                                    data.competencies_d3.filter(item => item.competence_type === 5).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`modellingD3-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 5).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Bahasa Komunikasi</b>
                                                {data ? data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 6).length > 0 ?
                                                    data.competencies_d3.filter(item => item.competence_type === 6).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`bahasaKomunikasiD3-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 6).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                            </Form>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </TabPane>
                            <TabPane tab={"Praktik Kerja Lapangan"} key={"1"} disabled={data.total_d4 === 0}>
                                <CCardBody style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                                    <Row>
                                        <Col span={24}>
                                            <Form
                                                form={form}
                                                name="basic"
                                                wrapperCol={{ span: 24 }}
                                                // onFinish={onFinish}
                                                // onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                                fields={data ? getKompetensi() : ""}
                                            >
                                                <b>Bahasa Pemrograman</b>
                                                {data ? data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 1).length > 0 ?
                                                    data.competencies_d4.filter(item => item.competence_type === 1).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`bahasaPemrogramanD4-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 1).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Database</b>
                                                {data ? data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 2).length > 0 ?
                                                    data.competencies_d4.filter(item => item.competence_type === 2).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`databaseD4-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 2).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Framework</b>
                                                {data ? data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 3).length > 0 ?
                                                    data.competencies_d4.filter(item => item.competence_type === 3).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`frameworkD4-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 3).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Tools</b>
                                                {data ? data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 4).length > 0 ?
                                                    data.competencies_d4.filter(item => item.competence_type === 4).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`toolsD4-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 4).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Modelling Tools</b>
                                                {data ? data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 5).length > 0 ?
                                                    data.competencies_d4.filter(item => item.competence_type === 5).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`modellingD4-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 5).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                                <b>Bahasa Komunikasi</b>
                                                {data ? data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 6).length > 0 ?
                                                    data.competencies_d4.filter(item => item.competence_type === 6).map((item, i) => (
                                                        <Row style={{ paddingTop: "5px" }} key={i}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={`bahasaKomunikasiD4-${i}`}
                                                                >
                                                                    <Select disabled style={{ width: "100%" }}>
                                                                        {kompetensi && kompetensi.filter(item => item.type === 6).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )) : (
                                                        <><Row style={{ paddingTop: "5px" }}>
                                                            <Col span={24}>
                                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                            </Col>
                                                        </Row><br /></>
                                                    ) : ""}
                                            </Form>
                                        </Col>
                                    </Row>
                                </CCardBody>
                            </TabPane>
                        </Tabs>
                    </CCard>
                </TabPane>
            </Tabs>
        </>
    )
}

export default DetailPrerequisite
