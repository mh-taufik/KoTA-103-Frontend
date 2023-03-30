import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Form, Input, Row, Col, Table, Button, Image, notification, Modal, Spin } from 'antd';
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


const FormulirEvaluasiPerusahaan = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;

    const location = useLocation();
    const history = useHistory();
    const [data, setData] = useState({})
    const [assessment_aspect, setAssessmentAspect] = useState([])
    const [dataAspek, setDataAspek] = useState([])
    const [optAspek, setOptAspek] = useState([])

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }
    function numToSSColumn(num) {
        let s = '', t;

        while (num > 0) {
            t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = (num - t) / 26 | 0;
        }
        return s || undefined;
    }

    const addAspek = () => {
        let aspek = dataAspek.filter(item => item.name !== "")
        let opt = optAspek
        aspek.push({
            id: dataAspek.length + 1,
            name: "|"
        })
        opt.push({
            id: dataAspek.length + 1,
            name: "|"
        })
        aspek.push({
            id: dataAspek.length + 2,
            name: ""
        })
        setOptAspek(opt)
        setDataAspek(aspek)
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            width: '5%',
            align: "center",
            render: (value, item, index) => {
                return index < assessment_aspect + 1 ? index + 1 : ""
            }
        },
        {
            title: 'Aspek Penilaian Evaluasi',
            dataIndex: 'name',
            align: 'center',
            onCell: (record) => {
                return {
                    colSpan: record.name === "Kemampuan Lain" ? 2 : record.name === "" ? 2 : 1,
                    style: {
                        background: record.name === "Kemampuan Lain" && '#f2f2f2'
                    }
                }
            },
            render: (value, item, index) =>
                <>
                    {index < assessment_aspect + 1 ? (
                        <div style={{ textAlign: "left" }}>
                            {item.name}
                        </div>
                    ) : item.name === "" ? (
                        <>
                            <Button
                                type="primary"
                                onClick={() => addAspek()}
                                size="small"
                            >
                                Tambah aspek kemampuan lain
                            </Button>
                        </>) : (
                        <div style={{ textAlign: "left" }}>
                            <Row align="middle">
                                <Col span={1} style={{ paddingRight: "10px" }}>{numToSSColumn(index - assessment_aspect).toLowerCase()}.</Col>
                                <Col span={23}>
                                    <Form.Item
                                        name={`aspek-${index}`}
                                        style={{ marginBottom: "0px" }}
                                        rules={[{ required: true, message: 'Aspek tidak boleh kosong!' }]}
                                    >
                                        <Input size='small' style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    )}
                </>
        },
        {
            title: 'Nilai',
            width: '10%',
            align: 'center',
            dataIndex: 'nilai',
            onCell: (record) => { return { colSpan: record.name === "Kemampuan Lain" ? 0 : record.name === "" ? 0 : 1 } },
            render: (value, item, index) =>
                <>
                    {item.name !== "Kemampuan Lain" && (
                        <Form.Item
                            name={`nilai-${index}`}
                            style={{ marginBottom: "0px" }}
                            rules={[{ required: true, message: 'Nilai tidak boleh kosong!' },
                            { message: 'Nilai hanya bisa diisi oleh angka!', pattern: /^(?:\d*)$/ },
                            { message: 'Nilai minimal adalah 50!', pattern: /\b^([A-Za-z]+|[1-9]\d{2,}|[5-9]\d)$\b/ },
                            { message: 'Nilai maksimal adalah 100!', pattern: /\b([A-Za-z]+|[0-9]|[0-9][0-9]|0+|100)\b/ }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
                </>
        }];

    const onFinish = (index) => {
        Modal.confirm({
            title: "Setelah disimpan, formulir evaluasi tidak dapat diubah kembali!",
            content: "Pastikan semua isian data sudah benar, Simpan data evaluasi?",
            okText: "Ya",
            onOk: () => {
                handleOkCreate(index)
            }
        })
    }

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
        });
    };

    const handleOkCreate = async (index) => {
        enterLoading(index)
        let valuation = []
        let catatan = ""
        let opstValuation = []
        data.assessment_aspect.map((item, index) => {
            return valuation.push({
                aspect_name: item,
                is_core: true,
                value: form.getFieldValue(`nilai-${index}`)
            })
        })
        optAspek.map((item, index) => {
            return opstValuation.push({
                aspect_name: form.getFieldValue(`aspek-${index + data.assessment_aspect.length - 1}`),
                is_core: false,
                value: form.getFieldValue(`nilai-${index + data.assessment_aspect.length - 1}`)
            })
        })
        valuation = valuation.filter(item => item.aspect_name !== "Kemampuan Lain").filter(item => item.aspect_name !== "")
        axios.defaults.withCredentials = true;
        location.state.id_prodi === 0 ? catatan = form.getFieldValue('catatan') : parseInt(location.state.numEval) === 3 ? catatan = form.getFieldValue('catatanExcelent') + "|" + form.getFieldValue('catatanLemah') : catatan = form.getFieldValue('catatan')
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/update/${id}`, {
            comment: catatan,
            num_evaluation: location.state.numEval,
            position: form.getFieldValue('posisi'),
            valuation: valuation.concat(opstValuation)
        })
            .then(function (response) {
                notification.success({
                    message: 'Evaluasi peserta berhasil diisi',
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                Modal.confirm({
                    title: "Terimakasih telah mengisikan formulir evaluasi peserta.",
                    // content: "Pastikan semua isian data sudah benar, Simpan data evaluasi?",
                    okText: "Ya",
                    onOk: () => {
                        history.push({
                            pathname: "/dataEvaluasiPerusahaan",
                            state: {
                                session: true,
                            }
                        });
                    },
                    cancelButtonProps:{disabled: true, className: "modal-footer-hiden-button"}
                })

            })
            .catch(function (error) {
                notification.success({
                    message: 'Evaluasi peserta gagal diisi',
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            });
    }

    useEffect(() => {
        if (location.state === undefined) {
            history.push({
                pathname: "/dataEvaluasiPerusahaan",
                state: { warning: true }
            })
        } else {
            let item = []
            let item2 = []
            const getFormEvaluasi = async () => {
                axios.defaults.withCredentials = true;
                await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/evaluation/form?id=${id}&numeval=${location.state.numEval}&prodi=${location.state.id_prodi}`)
                    .then(function (response) {
                        item = response.data.data
                        setAssessmentAspect(response.data.data.assessment_aspect.length)
                        location.state.id_prodi === 1 && parseInt(location.state.numEval) === 3 && item.assessment_aspect.push("Kemampuan Lain")
                        location.state.id_prodi === 1 && parseInt(location.state.numEval) === 3 && item.assessment_aspect.push("")
                        setData(item)
                        item.assessment_aspect.map((item, i) => {
                            return item2.push({
                                id: i,
                                name: item
                            })
                        })
                        setDataAspek(item2)
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
            getFormEvaluasi();
        }
    }, [history, location.state, id]);

    const getDate = (tanggal) => {
        let date = new Date(tanggal)
        return `${date.getDate()} ${date.toLocaleDateString('id-EN', { month: "long" })} ${date.getFullYear()}`
    }

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CCard className="mb-4">
                <CCardHeader style={{ paddingLeft: "20px" }}>
                    <Row>
                        <Col span={12} style={{ textAlign: "left" }}>
                            <h5><b>Formulir Evaluasi {location.state.name}</b></h5>
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
                    <Form
                        form={form}
                        name="basic"
                        wrapperCol={{ span: 24 }}
                        onFinish={() => onFinish(0)}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Table scroll={{ x: "max-content" }} style={{ paddingBottom: "20px" }} columns={columns} dataSource={dataAspek} rowKey={record => record.id} pagination={false} bordered />
                        <b>Catatan/Masukan:<span style={{ color: "red" }}> * </span></b>
                        {location.state.id_prodi === 0 ? (
                            <>
                                <Form.Item
                                    name="catatan"
                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </>) : (
                            <>
                                {parseInt(location.state.numEval) === 3 ? (
                                    <>
                                        <CCard className="mb-4">
                                            <CCardBody>
                                                Kemampuan yang paling <i>excelent</i>:
                                                <Form.Item
                                                    name="catatanExcelent"
                                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>
                                                Kemampuan yang paling <i>worst</i>:
                                                <Form.Item
                                                    name="catatanLemah"
                                                    rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                                >
                                                    <TextArea rows={4} />
                                                </Form.Item>
                                            </CCardBody>
                                        </CCard>
                                    </>) : (
                                    <>
                                        <Form.Item
                                            name="catatan"
                                            rules={[{ required: true, message: 'Catatan tidak boleh kosong!' }]}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                    </>
                                )}
                            </>)}

                        <Row style={{ border: "1px solid black" }}>
                            <Col span={24} style={{ padding: "20px" }}>
                                <Row style={{ height: "100px" }}>
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
                                        <Row style={{ height: "30px" }} justify="start" align="middle">&ensp; Posisi saat {location.state.id_prodi === 0 ? "KP" : "PKL"} <span style={{ color: "red" }}> &nbsp;* </span></Row>
                                    </Col>
                                    <Col span={1}>
                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">:</Row>
                                    </Col>
                                    <Col span={14}>
                                        <Row style={{ height: "30px" }} justify="space-around" align="middle">
                                            <Col span={24}>
                                                <Form.Item
                                                    name="posisi"
                                                    rules={[{ required: true, message: 'Posisi KP/PKL tidak boleh kosong!' }]}
                                                >
                                                    <Input size="small" style={{ width: '50%' }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
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
        </>
    )
}

export default FormulirEvaluasiPerusahaan
