import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Form, Input, Row, Col, Table, Image, Tabs, Alert, Spin, Button } from 'antd';
import {
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react'
import axios from 'axios';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import pic from '../../../../src/assets/images/logo_polban.png'
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TextArea } = Input;
const { TabPane } = Tabs;
const FileDownload = require('js-file-download');


const DetailEvaluasiPerusahaan = () => {
    const { id } = useParams();
    const history = useHistory();
    const [data, setData] = useState({})
    const [form] = Form.useForm();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true)
    const [isLoading2, setIsLoading2] = useState(true)
    const [loadings, setLoadings] = useState([]);
    const [tab, setTab] = useState("1");
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

    const refreshData = (key) => {
        let url;
        if (localStorage.getItem("id_role") === "1") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/get-by-participant?numeval=${key}`
        } else {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/${id}?numeval=${key}`
        }
        axios.get(url).then(response => {
            setData(response.data.data)
            setIsLoading2(false)
        }).catch(error => {
            setData(null)
            setIsLoading2(false)
        })
    }

    const exportPDF = async (evaluasi, index, id_participant) => {
        enterLoading(index)
        axios.defaults.withCredentials = true;
        await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/export-pdf?numeval=${evaluasi}&id=${id_participant}`, {
            responseType: 'blob',
        })
            .then((response) => {
                // notification.success({
                //     message: 'Ekspor evaluasi berhasil',
                // });
                FileDownload(response.data, `Data Evaluasi ${evaluasi} (${localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}).pdf`);
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            }).catch((error) => {
                // notification.error({
                //     message: 'Ekspor evaluasi gagal'
                // });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            });
    }

    useEffect(() => {
        let url;
        if (localStorage.getItem("id_role") === "1") {
            url = `${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/get-by-participant?numeval=${tab}`
        } else {
            if (location.state === undefined) {
                history.push({
                    pathname: "/dataEvaluasiPerusahaan",
                    state: { warning: true }
                })
            }
            if (localStorage.getItem("id_role") === "2") {
                url = `${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/${id}?numeval=${tab}`
            } else {
                url = `${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/${id}?numeval=${location.state.numEval}`
            }
        }
        const getDetailEvaluasi = async () => {
            axios.defaults.withCredentials = true;
            await axios.get(url)
                .then(function (response) {
                    setData(response.data.data)
                    setIsLoading(false)
                    setIsLoading2(false)
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
        getDetailEvaluasi();
    }, [history, id, location.state, tab]);

    function numToSSColumn(num) {
        let s = '', t;

        while (num > 0) {
            t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = (num - t) / 26 | 0;
        }
        return s || undefined;
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            width: '5%',
            align: "center",
            render: (value, item, index) => {
                return index <= data.valuation_core.length && index + 1
            }
        },
        {
            title: 'Aspek Penilaian Evaluasi',
            dataIndex: 'aspect_name',
            align: 'center',
            onCell: (record) => {
                return {
                    colSpan: record.aspect_name === "Kemampuan lain" ? 2 : record.aspect_name === "" ? 2 : 1,
                    style: {
                        background: record.aspect_name === "Kemampuan lain" && '#f2f2f2'
                    }
                }
            },
            render: (value, item, index) =>
                <div style={{ textAlign: "left" }}>
                    {index <= data.valuation_core.length ? item.aspect_name : `${numToSSColumn(index - data.valuation_core.length).toLowerCase()}. ${item.aspect_name}`}
                </div>
        },
        {
            title: 'Nilai',
            width: '10%',
            align: 'center',
            onCell: (record) => { return { colSpan: record.aspect_name === "Kemampuan lain" ? 0 : record.aspect_name === "" ? 0 : 1 } },
            dataIndex: 'value',
        }];

    const getDate = (tanggal) => {
        let date = new Date(tanggal)
        return `${date.getDate()} ${date.toLocaleDateString('id-EN', { month: "long" })} ${date.getFullYear()}`
    }

    const onChange = (activeKey) => {
        setIsLoading2(true)
        setTab(activeKey)
        refreshData(activeKey)
    };

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            {localStorage.getItem("id_role") === "1" ? (
                <>
                    {localStorage.getItem("id_prodi") === "0" ? (
                        <>
                            {data !== null ?
                                <>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ paddingLeft: "20px" }}>
                                            <Row>
                                                <Col span={12} style={{ textAlign: "left" }}>
                                                    <h5><b>Detail Evaluasi {localStorage.getItem("name")} ({localStorage.getItem("id_prodi") === "0" ? "D3" : "D4"})</b></h5>
                                                </Col>
                                                <Col span={12} style={{ textAlign: "right" }}>
                                                    <Button
                                                        id="download"
                                                        shape="round"
                                                        loading={loadings[0]}
                                                        style={{ backgroundColor: "#3399FF", borderColor: "#3399FF", color: "white" }}
                                                        onClick={() => exportPDF(tab, tab, data.nim)}
                                                    >
                                                        Ekspor ke PDF
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CCardHeader>
                                        <CCardBody style={{ paddingLeft: "20px" }}>
                                            <Row style={{ border: "1px solid black" }}>
                                                <Col span={24}>
                                                    <Row style={{ height: "90px" }} justify="space-around" align="middle">
                                                        <Col span={4} style={{ textAlign: "center" }}>
                                                            <Row style={{ borderRight: "1px solid black", borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                <Image
                                                                    width={45}
                                                                    src={pic}
                                                                />
                                                            </Row>
                                                        </Col>
                                                        <Col span={20} style={{ borderBottom: "1px solid black", textAlign: "center", height: "90px" }}>
                                                            <Row style={{ borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    <h5>JURUSAN TEKNIK KOMPUTER DAN INFORMATIKA (JTK)</h5>
                                                                    <h6>POLITEKNIK NEGERI BANDUNG</h6>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={24}>
                                                    <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                        <Col span={4} style={{ textAlign: "center" }}>
                                                            <Row style={{ borderRight: "1px solid black", height: "45px" }} justify="space-around" align="middle"><b>FORMULIR</b></Row>
                                                        </Col>
                                                        <Col span={13} style={{ borderRight: "1px solid black", textAlign: "center", height: "45px" }}>
                                                            <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    <b>DAFTAR HADIR {localStorage.getItem("id_prodi") === "0" ? "KERJA PRAKTIK (KP)" : "PRAKTIK KERJA LAPANGAN (PKL)"}</b><br />
                                                                    Program Studi {localStorage.getItem("id_prodi") === "0" ? "D3" : "D4"} Teknik Informatika
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={7} style={{ textAlign: "center" }}>
                                                            <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    NO. DOKUMEN<br />
                                                                    K8.0803.IK.01.07.FHKP
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                                                <Col span={24} style={{ textAlign: "center" }}>
                                                    <h5><b>Form Evaluasi - {tab}</b></h5>
                                                </Col>
                                            </Row>
                                            <Row style={{ border: "1px solid black" }}>
                                                <Col span={24}>
                                                    <Row style={{ height: "90px" }}>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Perusahaan</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {data.company_name}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Alamat</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {data.company_address}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Contact Person / Email / Telp.</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {`${data.cp_name} / ${data.cp_email} / ${data.cp_phone}`}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row justify='space-around' align="middle" style={{ paddingTop: "20px" }}>
                                                <Col span={24} style={{ textAlign: "center" }}>
                                                    <p style={{ textAlign: "justify" }}>Evaluasi yang Bapak/ Ibu berikan akan sangat membantu kami dalam memperbaiki sistem pengajaran maupun program pada masa yang akan datang. Mohon kesediaannya untuk mengevaluasi peserta {localStorage.getItem("id_prodi") === "0" ? "KP D3" : "PKL D4"} Teknik Informatika JTK yang ada dalam lingkungan unit Bapak/ Ibu dengan memberikan penilaian sesuai dengan rentang nilai sebagai berikut</p>
                                                </Col>
                                            </Row>
                                            <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>A: Baik Sekali (85 - 100)</b></h6>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>B: Baik (75 - 84)</b></h6>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>C: Cukup (65 - 74)</b></h6>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>D: Kurang (50 - 64)</b></h6>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Table scroll={{x: "max-content"}} style={{ paddingBottom: "20px" }} columns={columns} dataSource={data.valuation_core} rowKey="aspect_name" pagination={false} bordered />
                                            <b>Catatan/Masukan:</b>
                                            <Form
                                                form={form}
                                                name="basic"
                                                wrapperCol={{ span: 24 }}
                                                // onFinish={onFinish}
                                                // onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                                fields={[
                                                    {
                                                        name: ['catatan'],
                                                        value: data.comment
                                                    }
                                                ]}
                                            >
                                                <Form.Item
                                                    name="catatan"
                                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                >
                                                    <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                                <Row style={{ border: "1px solid black" }}>
                                                    <Col span={24}>
                                                        <Row style={{ height: "90px" }}>
                                                            <Col span={6}>
                                                                <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Peserta {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</Row>
                                                            </Col>
                                                            <Col span={1}>
                                                                <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                            </Col>
                                                            <Col span={14}>
                                                                <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                    <Col span={24}>
                                                                        {localStorage.getItem("name")}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col span={6}>
                                                                <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Mulai {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</Row>
                                                            </Col>
                                                            <Col span={1}>
                                                                <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                            </Col>
                                                            <Col span={14}>
                                                                <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                    <Col span={24}>
                                                                        {getDate(data.start_date)}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col span={6}>
                                                                <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Posisi saat {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</Row>
                                                            </Col>
                                                            <Col span={1}>
                                                                <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                            </Col>
                                                            <Col span={14}>
                                                                <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                    <Col span={24}>
                                                                        {data.position}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </CCardBody>
                                    </CCard>
                                </> :
                                <>
                                    <div style={{ paddingBottom: "20px" }}>
                                        <Alert
                                            message="Catatan"
                                            description={`Data evaluasi ${localStorage.getItem("id_prodi") === "1" ? `${id}` : "1"} belum diisi oleh perusahaan atau Anda belum dialokasikan ke perusahaan manapun`}
                                            type="info"
                                            showIcon
                                            closable />
                                    </div>
                                </>}
                        </>) : (
                        <>
                            <Tabs type="card" onChange={onChange}>
                                <TabPane tab="Evaluasi 1" key="1" disabled={isLoading2}>
                                </TabPane>
                                <TabPane tab="Evaluasi 2" key="2" disabled={isLoading2}>
                                </TabPane>
                                <TabPane tab="Evaluasi 3" key="3" disabled={isLoading2}>
                                </TabPane>
                            </Tabs>
                            {isLoading2 ? (<Spin indicator={antIcon} />) : data !== null ? (
                                <>
                                    <CCard className="mb-4">
                                        <CCardHeader style={{ paddingLeft: "20px" }}>
                                            <Row>
                                                <Col span={12} style={{ textAlign: "left" }}>
                                                    <h5><b>Detail Evaluasi {localStorage.getItem("name")} ({localStorage.getItem("id_prodi") === "0" ? "D3" : "D4"})</b></h5>
                                                </Col>
                                                <Col span={12} style={{ textAlign: "right" }}>
                                                    <Button
                                                        id="download"
                                                        shape="round"
                                                        loading={loadings[tab]}
                                                        style={{ backgroundColor: "#3399FF", borderColor: "#3399FF", color: "white" }}
                                                        onClick={() => exportPDF(tab, tab, data.nim)}
                                                    >
                                                        Ekspor ke PDF
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CCardHeader>
                                        <CCardBody style={{ paddingLeft: "20px" }}>
                                            <Row style={{ border: "1px solid black" }}>
                                                <Col span={24}>
                                                    <Row style={{ height: "90px" }} justify="space-around" align="middle">
                                                        <Col span={4} style={{ textAlign: "center" }}>
                                                            <Row style={{ borderRight: "1px solid black", borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                <Image
                                                                    width={45}
                                                                    src={pic}
                                                                />
                                                            </Row>
                                                        </Col>
                                                        <Col span={20} style={{ borderBottom: "1px solid black", textAlign: "center", height: "90px" }}>
                                                            <Row style={{ borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    <h5>JURUSAN TEKNIK KOMPUTER DAN INFORMATIKA (JTK)</h5>
                                                                    <h6>POLITEKNIK NEGERI BANDUNG</h6>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={24}>
                                                    <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                        <Col span={4} style={{ textAlign: "center" }}>
                                                            <Row style={{ borderRight: "1px solid black", height: "45px" }} justify="space-around" align="middle"><b>FORMULIR</b></Row>
                                                        </Col>
                                                        <Col span={13} style={{ borderRight: "1px solid black", textAlign: "center", height: "45px" }}>
                                                            <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    <b>DAFTAR HADIR {localStorage.getItem("id_prodi") === "0" ? "KERJA PRAKTIK (KP)" : "PRAKTIK KERJA LAPANGAN (PKL)"}</b><br />
                                                                    Program Studi {localStorage.getItem("id_prodi") === "0" ? "D3" : "D4"} Teknik Informatika
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={7} style={{ textAlign: "center" }}>
                                                            <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    NO. DOKUMEN<br />
                                                                    K8.0803.IK.01.07.FHKP
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                                                <Col span={24} style={{ textAlign: "center" }}>
                                                    <h5><b>Form Evaluasi - {tab}</b></h5>
                                                </Col>
                                            </Row>
                                            <Row style={{ border: "1px solid black" }}>
                                                <Col span={24}>
                                                    <Row style={{ height: "90px" }}>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Perusahaan</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {data.company_name}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Alamat</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {data.company_address}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Contact Person / Email / Telp.</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {`${data.cp_name} / ${data.cp_email} / ${data.cp_phone}`}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row justify='space-around' align="middle" style={{ paddingTop: "20px" }}>
                                                <Col span={24} style={{ textAlign: "center" }}>
                                                    <p style={{ textAlign: "justify" }}>Evaluasi yang Bapak/ Ibu berikan akan sangat membantu kami dalam memperbaiki sistem pengajaran maupun program pada masa yang akan datang. Mohon kesediaannya untuk mengevaluasi peserta {localStorage.getItem("id_prodi") === "0" ? "KP D3" : "PKL D4"} Teknik Informatika JTK yang ada dalam lingkungan unit Bapak/ Ibu dengan memberikan penilaian sesuai dengan rentang nilai sebagai berikut</p>
                                                </Col>
                                            </Row>
                                            <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>A: Baik Sekali (85 - 100)</b></h6>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>B: Baik (75 - 84)</b></h6>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>C: Cukup (65 - 74)</b></h6>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row justify="space-around" align="middle">
                                                        <h6><b>D: Kurang (50 - 64)</b></h6>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Table scroll={{x: "max-content"}} style={{ paddingBottom: "20px" }} columns={columns} dataSource={data.valuation_non_core.length > 0 ? data.valuation_core.concat({ value: "", aspect_name: "Kemampuan lain" }).concat(data.valuation_non_core) : data.valuation_core} rowKey="aspect_name" pagination={false} bordered />
                                            <b>Catatan/Masukan:</b>
                                            {tab === "3" ?
                                                <>
                                                    <Form
                                                        form={form}
                                                        name="basic"
                                                        wrapperCol={{ span: 24 }}
                                                        // onFinish={onFinish}
                                                        // onFinishFailed={onFinishFailed}
                                                        autoComplete="off"
                                                        fields={[
                                                            {
                                                                name: ['catatanExcelent'],
                                                                value: data.comment.split("|")[0]
                                                            },
                                                            {
                                                                name: ['catatanLemah'],
                                                                value: data.comment.split("|")[1]
                                                            }
                                                        ]}
                                                    >
                                                        <CCard className="mb-4">
                                                            <CCardBody>
                                                                Kemampuan yang paling <i>excelent</i>:
                                                                <Form.Item
                                                                    name="catatanExcelent"
                                                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                                >
                                                                    <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                                </Form.Item>
                                                                Kemampuan yang paling <i>worst</i>:
                                                                <Form.Item
                                                                    name="catatanLemah"
                                                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                                >
                                                                    <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                                </Form.Item>
                                                            </CCardBody>
                                                        </CCard>
                                                    </Form>
                                                </> :
                                                <>
                                                    <Form
                                                        form={form}
                                                        name="basic"
                                                        wrapperCol={{ span: 24 }}
                                                        // onFinish={onFinish}
                                                        // onFinishFailed={onFinishFailed}
                                                        autoComplete="off"
                                                        fields={[
                                                            {
                                                                name: ['catatan'],
                                                                value: data.comment
                                                            }
                                                        ]}
                                                    >
                                                        <Form.Item
                                                            name="catatan"
                                                            rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                        >
                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Form>
                                                </>}
                                            <Row style={{ border: "1px solid black" }}>
                                                <Col span={24}>
                                                    <Row style={{ height: "90px" }}>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Peserta {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {localStorage.getItem("name")}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Mulai {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {getDate(data.start_date)}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Posisi saat {localStorage.getItem("id_prodi") === "0" ? "KP" : "PKL"}</Row>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                        </Col>
                                                        <Col span={14}>
                                                            <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                <Col span={24}>
                                                                    {data.position}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </CCardBody>
                                    </CCard>
                                </>) :
                                <>
                                    <div style={{ paddingBottom: "20px" }}>
                                        <Alert
                                            message="Catatan"
                                            description={`Data Evaluasi ${tab} Belum diisi atau Anda belum dialokasikan ke perusahaan manapun`}
                                            type="info"
                                            showIcon
                                            closable />
                                    </div>
                                </>}
                        </>)}
                </>) : (
                <>
                    {localStorage.getItem("id_role") === "2" ? (
                        <>
                            {location.state.id_prodi === 0 ? (
                                <>
                                    {data !== null ?
                                        <>
                                            <CCard className="mb-4">
                                                <CCardHeader style={{ paddingLeft: "20px" }}>
                                                    <Row>
                                                        <Col span={12} style={{ textAlign: "left" }}>
                                                            <h5><b>Detail Evaluasi {location.state.participant_name} ({location.state.id_prodi === 0 ? "D3" : "D4"})</b></h5>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: "right" }}>
                                                            <Button
                                                                id="download"
                                                                shape="round"
                                                                loading={loadings[0]}
                                                                style={{ backgroundColor: "#3399FF", borderColor: "#3399FF", color: "white" }}
                                                                onClick={() => exportPDF(tab, tab, data.nim)}
                                                            >
                                                                Ekspor ke PDF
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </CCardHeader>
                                                <CCardBody style={{ paddingLeft: "20px" }}>
                                                    <Row style={{ border: "1px solid black" }}>
                                                        <Col span={24}>
                                                            <Row style={{ height: "90px" }} justify="space-around" align="middle">
                                                                <Col span={4} style={{ textAlign: "center" }}>
                                                                    <Row style={{ borderRight: "1px solid black", borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                        <Image
                                                                            width={45}
                                                                            src={pic}
                                                                        />
                                                                    </Row>
                                                                </Col>
                                                                <Col span={20} style={{ borderBottom: "1px solid black", textAlign: "center", height: "90px" }}>
                                                                    <Row style={{ borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            <h5>JURUSAN TEKNIK KOMPUTER DAN INFORMATIKA (JTK)</h5>
                                                                            <h6>POLITEKNIK NEGERI BANDUNG</h6>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                <Col span={4} style={{ textAlign: "center" }}>
                                                                    <Row style={{ borderRight: "1px solid black", height: "45px" }} justify="space-around" align="middle"><b>FORMULIR</b></Row>
                                                                </Col>
                                                                <Col span={13} style={{ borderRight: "1px solid black", textAlign: "center", height: "45px" }}>
                                                                    <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            <b>DAFTAR HADIR {location.state.id_prodi === 0 ? "KERJA PRAKTIK (KP)" : "PRAKTIK KERJA LAPANGAN (PKL)"}</b><br />
                                                                            Program Studi {location.state.id_prodi === 0 ? "D3" : "D4"} Teknik Informatika
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={7} style={{ textAlign: "center" }}>
                                                                    <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            NO. DOKUMEN<br />
                                                                            K8.0803.IK.01.07.FHKP
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                                                        <Col span={24} style={{ textAlign: "center" }}>
                                                            <h5><b>Form Evaluasi - {tab}</b></h5>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ border: "1px solid black" }}>
                                                        <Col span={24}>
                                                            <Row style={{ height: "90px" }}>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Perusahaan</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {data.company_name}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Alamat</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {data.company_address}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Contact Person / Email / Telp.</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {`${data.cp_name} / ${data.cp_email} / ${data.cp_phone}`}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='space-around' align="middle" style={{ paddingTop: "20px" }}>
                                                        <Col span={24} style={{ textAlign: "center" }}>
                                                            <p style={{ textAlign: "justify" }}>Evaluasi yang Bapak/ Ibu berikan akan sangat membantu kami dalam memperbaiki sistem pengajaran maupun program pada masa yang akan datang. Mohon kesediaannya untuk mengevaluasi peserta {location.state.id_prodi === 0 ? "KP D3" : "PKL D4"} Teknik Informatika JTK yang ada dalam lingkungan unit Bapak/ Ibu dengan memberikan penilaian sesuai dengan rentang nilai sebagai berikut</p>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>A: Baik Sekali (85 - 100)</b></h6>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>B: Baik (75 - 84)</b></h6>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>C: Cukup (65 - 74)</b></h6>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>D: Kurang (50 - 64)</b></h6>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Table scroll={{x: "max-content"}} style={{ paddingBottom: "20px" }} columns={columns} dataSource={data.valuation_core} rowKey="aspect_name" pagination={false} bordered />
                                                    <b>Catatan/Masukan:</b>
                                                    <Form
                                                        form={form}
                                                        name="basic"
                                                        wrapperCol={{ span: 24 }}
                                                        // onFinish={onFinish}
                                                        // onFinishFailed={onFinishFailed}
                                                        autoComplete="off"
                                                        fields={[
                                                            {
                                                                name: ['catatan'],
                                                                value: data.comment
                                                            }
                                                        ]}
                                                    >
                                                        <Form.Item
                                                            name="catatan"
                                                            rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                        >
                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                        <Row style={{ border: "1px solid black" }}>
                                                            <Col span={24}>
                                                                <Row style={{ height: "90px" }}>
                                                                    <Col span={6}>
                                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Peserta {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                                    </Col>
                                                                    <Col span={1}>
                                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                    </Col>
                                                                    <Col span={14}>
                                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                            <Col span={24}>
                                                                                {localStorage.getItem("name")}
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Mulai {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                                    </Col>
                                                                    <Col span={1}>
                                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                    </Col>
                                                                    <Col span={14}>
                                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                            <Col span={24}>
                                                                                {getDate(data.start_date)}
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col span={6}>
                                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Posisi saat {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                                    </Col>
                                                                    <Col span={1}>
                                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                    </Col>
                                                                    <Col span={14}>
                                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                            <Col span={24}>
                                                                                {data.position}
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </CCardBody>
                                            </CCard>
                                        </> :
                                        <>
                                            <div style={{ paddingBottom: "20px" }}>
                                                <Alert
                                                    message="Catatan"
                                                    description={`Data evaluasi ${location.state.id_prodi === "1" ? `${id}` : "1"} belum diisi oleh perusahaan`}
                                                    type="info"
                                                    showIcon
                                                    closable />
                                            </div>
                                        </>}
                                </>) : (
                                <>
                                    <Tabs type="card" onChange={onChange}>
                                        <TabPane tab="Evaluasi 1" key="1" disabled={isLoading2}>
                                        </TabPane>
                                        <TabPane tab="Evaluasi 2" key="2" disabled={isLoading2}>
                                        </TabPane>
                                        <TabPane tab="Evaluasi 3" key="3" disabled={isLoading2}>
                                        </TabPane>
                                    </Tabs>
                                    {isLoading2 ? (<Spin indicator={antIcon} />) : data !== null ? (
                                        <>
                                            <CCard className="mb-4">
                                                <CCardHeader style={{ paddingLeft: "20px" }}>
                                                    <Row>
                                                        <Col span={12} style={{ textAlign: "left" }}>
                                                            <h5><b>Detail Evaluasi {location.state.participant_name} ({location.state.id_prodi === 0 ? "D3" : "D4"})</b></h5>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: "right" }}>
                                                            <Button
                                                                id="download"
                                                                shape="round"
                                                                loading={loadings[tab]}
                                                                style={{ backgroundColor: "#3399FF", borderColor: "#3399FF", color: "white" }}
                                                                onClick={() => exportPDF(tab, tab, data.nim)}
                                                            >
                                                                Ekspor ke PDF
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </CCardHeader>
                                                <CCardBody style={{ paddingLeft: "20px" }}>
                                                    <Row style={{ border: "1px solid black" }}>
                                                        <Col span={24}>
                                                            <Row style={{ height: "90px" }} justify="space-around" align="middle">
                                                                <Col span={4} style={{ textAlign: "center" }}>
                                                                    <Row style={{ borderRight: "1px solid black", borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                        <Image
                                                                            width={45}
                                                                            src={pic}
                                                                        />
                                                                    </Row>
                                                                </Col>
                                                                <Col span={20} style={{ borderBottom: "1px solid black", textAlign: "center", height: "90px" }}>
                                                                    <Row style={{ borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            <h5>JURUSAN TEKNIK KOMPUTER DAN INFORMATIKA (JTK)</h5>
                                                                            <h6>POLITEKNIK NEGERI BANDUNG</h6>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                <Col span={4} style={{ textAlign: "center" }}>
                                                                    <Row style={{ borderRight: "1px solid black", height: "45px" }} justify="space-around" align="middle"><b>FORMULIR</b></Row>
                                                                </Col>
                                                                <Col span={13} style={{ borderRight: "1px solid black", textAlign: "center", height: "45px" }}>
                                                                    <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            <b>DAFTAR HADIR {location.state.id_prodi === 0 ? "KERJA PRAKTIK (KP)" : "PRAKTIK KERJA LAPANGAN (PKL)"}</b><br />
                                                                            Program Studi {location.state.id_prodi === 0 ? "D3" : "D4"} Teknik Informatika
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={7} style={{ textAlign: "center" }}>
                                                                    <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            NO. DOKUMEN<br />
                                                                            K8.0803.IK.01.07.FHKP
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                                                        <Col span={24} style={{ textAlign: "center" }}>
                                                            <h5><b>Form Evaluasi - {tab}</b></h5>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ border: "1px solid black" }}>
                                                        <Col span={24}>
                                                            <Row style={{ height: "90px" }}>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Perusahaan</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {data.company_name}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Alamat</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {data.company_address}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Contact Person / Email / Telp.</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {`${data.cp_name} / ${data.cp_email} / ${data.cp_phone}`}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='space-around' align="middle" style={{ paddingTop: "20px" }}>
                                                        <Col span={24} style={{ textAlign: "center" }}>
                                                            <p style={{ textAlign: "justify" }}>Evaluasi yang Bapak/ Ibu berikan akan sangat membantu kami dalam memperbaiki sistem pengajaran maupun program pada masa yang akan datang. Mohon kesediaannya untuk mengevaluasi peserta {location.state.id_prodi === 0 ? "KP D3" : "PKL D4"} Teknik Informatika JTK yang ada dalam lingkungan unit Bapak/ Ibu dengan memberikan penilaian sesuai dengan rentang nilai sebagai berikut</p>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>A: Baik Sekali (85 - 100)</b></h6>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>B: Baik (75 - 84)</b></h6>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>C: Cukup (65 - 74)</b></h6>
                                                            </Row>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Row justify="space-around" align="middle">
                                                                <h6><b>D: Kurang (50 - 64)</b></h6>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Table scroll={{x: "max-content"}} style={{ paddingBottom: "20px" }} columns={columns} dataSource={data.valuation_non_core.length > 0 ? data.valuation_core.concat({ value: "", aspect_name: "Kemampuan lain" }).concat(data.valuation_non_core) : data.valuation_core} rowKey="aspect_name" pagination={false} bordered />
                                                    <b>Catatan/Masukan:</b>
                                                    {tab === "3" ?
                                                        <>
                                                            <Form
                                                                form={form}
                                                                name="basic"
                                                                wrapperCol={{ span: 24 }}
                                                                // onFinish={onFinish}
                                                                // onFinishFailed={onFinishFailed}
                                                                autoComplete="off"
                                                                fields={[
                                                                    {
                                                                        name: ['catatanExcelent'],
                                                                        value: data.comment.split("|")[0]
                                                                    },
                                                                    {
                                                                        name: ['catatanLemah'],
                                                                        value: data.comment.split("|")[1]
                                                                    }
                                                                ]}
                                                            >
                                                                <CCard className="mb-4">
                                                                    <CCardBody>
                                                                        Kemampuan yang paling <i>excelent</i>:
                                                                        <Form.Item
                                                                            name="catatanExcelent"
                                                                            rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                                        >
                                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                                        </Form.Item>
                                                                        Kemampuan yang paling <i>worst</i>:
                                                                        <Form.Item
                                                                            name="catatanLemah"
                                                                            rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                                        >
                                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                                        </Form.Item>
                                                                    </CCardBody>
                                                                </CCard>
                                                            </Form>
                                                        </> :
                                                        <>
                                                            <Form
                                                                form={form}
                                                                name="basic"
                                                                wrapperCol={{ span: 24 }}
                                                                // onFinish={onFinish}
                                                                // onFinishFailed={onFinishFailed}
                                                                autoComplete="off"
                                                                fields={[
                                                                    {
                                                                        name: ['catatan'],
                                                                        value: data.comment
                                                                    }
                                                                ]}
                                                            >
                                                                <Form.Item
                                                                    name="catatan"
                                                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                                >
                                                                    <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                                </Form.Item>
                                                            </Form>
                                                        </>}
                                                    <Row style={{ border: "1px solid black" }}>
                                                        <Col span={24}>
                                                            <Row style={{ height: "90px" }}>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Peserta {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {localStorage.getItem("name")}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Mulai {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {getDate(data.start_date)}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Posisi saat {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                                </Col>
                                                                <Col span={1}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                                        <Col span={24}>
                                                                            {data.position}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </CCardBody>
                                            </CCard>
                                        </>) :
                                        <>
                                            <div style={{ paddingBottom: "20px" }}>
                                                <Alert
                                                    message="Catatan"
                                                    description={`Data Evaluasi ${tab} Belum diisi`}
                                                    type="info"
                                                    showIcon
                                                    closable />
                                            </div>
                                        </>}
                                </>)}
                        </>
                    ) : (<>
                        {data !== null ?
                            <>
                                <CCard className="mb-4">
                                    <CCardHeader style={{ paddingLeft: "20px" }}>
                                        <Row>
                                            <Col span={12} style={{ textAlign: "left" }}>
                                                <h5><b>Detail Evaluasi {location.state.name}</b></h5>
                                            </Col>
                                            <Col span={12} style={{ textAlign: "right" }}>
                                                <h5><b>{location.state.id_prodi === 0 ? "D3" : "D4"}</b></h5>
                                            </Col>
                                        </Row>
                                    </CCardHeader>
                                    <CCardBody style={{ paddingLeft: "20px" }}>
                                        <Row style={{ border: "1px solid black" }}>
                                            <Col span={24}>
                                                <Row style={{ height: "90px" }} justify="space-around" align="middle">
                                                    <Col span={4} style={{ textAlign: "center" }}>
                                                        <Row style={{ borderRight: "1px solid black", borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                            <Image
                                                                width={45}
                                                                src={pic}
                                                            />
                                                        </Row>
                                                    </Col>
                                                    <Col span={20} style={{ borderBottom: "1px solid black", textAlign: "center", height: "90px" }}>
                                                        <Row style={{ borderBottom: "1px solid black", height: "90px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                <h5>JURUSAN TEKNIK KOMPUTER DAN INFORMATIKA (JTK)</h5>
                                                                <h6>POLITEKNIK NEGERI BANDUNG</h6>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={24}>
                                                <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                    <Col span={4} style={{ textAlign: "center" }}>
                                                        <Row style={{ borderRight: "1px solid black", height: "45px" }} justify="space-around" align="middle"><b>FORMULIR</b></Row>
                                                    </Col>
                                                    <Col span={13} style={{ borderRight: "1px solid black", textAlign: "center", height: "45px" }}>
                                                        <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                <b>DAFTAR HADIR {location.state.id_prodi === 0 ? "KERJA PRAKTIK (KP)" : "PRAKTIK KERJA LAPANGAN (PKL)"}</b><br />
                                                                Program Studi {location.state.id_prodi === 0 ? "D3" : "D4"} Teknik Informatika
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={7} style={{ textAlign: "center" }}>
                                                        <Row style={{ height: "45px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                NO. DOKUMEN<br />
                                                                K8.0803.IK.01.07.FHKP
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                                            <Col span={24} style={{ textAlign: "center" }}>
                                                <h5><b>Form Evaluasi - {location.state.numEval}</b></h5>
                                            </Col>
                                        </Row>
                                        <Row style={{ border: "1px solid black" }}>
                                            <Col span={24}>
                                                <Row style={{ height: "90px" }}>
                                                    <Col span={6}>
                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Perusahaan</Row>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                {data.company_name}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Alamat</Row>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                {data.company_address}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Contact Person / Email / Telp.</Row>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                {`${data.cp_name} / ${data.cp_email} / ${data.cp_phone}`}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row justify='space-around' align="middle" style={{ paddingTop: "20px" }}>
                                            <Col span={24} style={{ textAlign: "center" }}>
                                                <p style={{ textAlign: "justify" }}>Evaluasi yang Bapak/ Ibu berikan akan sangat membantu kami dalam memperbaiki sistem pengajaran maupun program pada masa yang akan datang. Mohon kesediaannya untuk mengevaluasi peserta {location.state.id_prodi === 0 ? "KP D3" : "PKL D4"} Teknik Informatika JTK yang ada dalam lingkungan unit Bapak/ Ibu dengan memberikan penilaian sesuai dengan rentang nilai sebagai berikut</p>
                                            </Col>
                                        </Row>
                                        <Row justify='space-around' align="middle" style={{ paddingBottom: "20px", paddingTop: "10px" }}>
                                            <Col span={6}>
                                                <Row justify="space-around" align="middle">
                                                    <h6><b>A: Baik Sekali (85 - 100)</b></h6>
                                                </Row>
                                            </Col>
                                            <Col span={6}>
                                                <Row justify="space-around" align="middle">
                                                    <h6><b>B: Baik (75 - 84)</b></h6>
                                                </Row>
                                            </Col>
                                            <Col span={6}>
                                                <Row justify="space-around" align="middle">
                                                    <h6><b>C: Cukup (65 - 74)</b></h6>
                                                </Row>
                                            </Col>
                                            <Col span={6}>
                                                <Row justify="space-around" align="middle">
                                                    <h6><b>D: Kurang (50 - 64)</b></h6>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Table scroll={{x: "max-content"}} style={{ paddingBottom: "20px" }} columns={columns} dataSource={data.valuation_non_core.length > 0 ? data.valuation_core.concat({ value: "", aspect_name: "Kemampuan lain" }).concat(data.valuation_non_core) : data.valuation_core} rowKey="aspect_name" pagination={false} bordered />
                                        <b>Catatan/Masukan:</b>
                                        {parseInt(location.state.numEval) === 3 ?
                                            <>
                                                <Form
                                                    form={form}
                                                    name="basic"
                                                    wrapperCol={{ span: 24 }}
                                                    // onFinish={onFinish}
                                                    // onFinishFailed={onFinishFailed}
                                                    autoComplete="off"
                                                    fields={[
                                                        {
                                                            name: ['catatanExcelent'],
                                                            value: data.comment.split("|")[0]
                                                        },
                                                        {
                                                            name: ['catatanLemah'],
                                                            value: data.comment.split("|")[1]
                                                        }
                                                    ]}
                                                >
                                                    <CCard className="mb-4">
                                                        <CCardBody>
                                                            Kemampuan yang paling <i>excelent</i>:
                                                            <Form.Item
                                                                name="catatanExcelent"
                                                                rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                            >
                                                                <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                            </Form.Item>
                                                            Kemampuan yang paling <i>worst</i>:
                                                            <Form.Item
                                                                name="catatanLemah"
                                                                rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                            >
                                                                <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                            </Form.Item>
                                                        </CCardBody>
                                                    </CCard>
                                                </Form>
                                            </> :
                                            <>
                                                <Form
                                                    form={form}
                                                    name="basic"
                                                    wrapperCol={{ span: 24 }}
                                                    // onFinish={onFinish}
                                                    // onFinishFailed={onFinishFailed}
                                                    autoComplete="off"
                                                    fields={[
                                                        {
                                                            name: ['catatan'],
                                                            value: data.comment
                                                        }
                                                    ]}
                                                >
                                                    <Form.Item
                                                        name="catatan"
                                                        rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                    >
                                                        <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Form>
                                            </>}
                                        <Row style={{ border: "1px solid black" }}>
                                            <Col span={24}>
                                                <Row style={{ height: "90px" }}>
                                                    <Col span={6}>
                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Nama Peserta {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                {location.state.name}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Mulai {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                {getDate(data.start_date)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Posisi saat {location.state.id_prodi === 0 ? "KP" : "PKL"}</Row>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                                            <Col span={24}>
                                                                {data.position}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </CCardBody>
                                </CCard>
                            </> :
                            <>
                                <div style={{ paddingBottom: "20px" }}>
                                    <Alert
                                        message="Catatan"
                                        description={`Data Evaluasi ${location.state.numEval} Belum diisi`}
                                        type="info"
                                        showIcon
                                        closable />
                                </div>
                            </>}
                    </>)}
                </>)}
        </>
    )
}

export default DetailEvaluasiPerusahaan
