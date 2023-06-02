import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, DatePicker, Checkbox, Select, Modal, notification, Alert, Spin } from 'antd';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CCardHeader,
    CRow,
} from '@coreui/react'
import { MinusCircleOutlined } from '@ant-design/icons';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PengajuanPerusahaan = () => {
    const [form] = Form.useForm();
    const [dataKriteria, setDataKriteria] = useState([])
    let history = useHistory();
    const [timelineStatus, setTimelineStatus] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    )
    const [convertedContent, setConvertedContent] = useState(null);
    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(currentContentAsHTML);
    }
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

    useEffect(() => {
        async function getDataKriteriaPerusahaan() {
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria`)
                .then(result => {
                    setDataKriteria(result.data.data)
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/1`)
                        .then(result => {
                            setTimelineStatus(result.data.data)
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
        getDataKriteriaPerusahaan()
    }, [history]);

    const onFinish = (index) => {
        Modal.confirm({
            title: "Setelah diajukan, formulir isian tidak dapat diubah kembali!",
            content: "Pastikan semua isian data sudah benar, Ajukan data pengajuan perusahaan?",
            okText: "Ya",
            onOk: () => {
                handleOkCreate(index)
            }
        })
    };

    const handleOkCreate = async (index) => {
        enterLoading(index)
        let proposer = [];
        let advantages = [];
        form.getFieldValue('namaPengusul') && form.getFieldValue('namaPengusul').map(item => {
            return proposer.push(item.nim ? `${item.namaPengusul} (${item.nim})` : item.namaPengusul)
        })
        form.getFieldValue('keunggulanPerusahaan') && form.getFieldValue('keunggulanPerusahaan').map(item => {
            return advantages.push(item.keunggulanPerusahaan)
        })
        let data = "";
        proposer.map((item, index) => {
            return index !== proposer.length - 1 ? data += item + "|" : data += item
        })
        await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}company/submission/create`, {
            proposer: data,
            company_name: form.getFieldValue('namaInstansi'),
            company_mail: form.getFieldValue('email'),
            address: form.getFieldValue('alamat'),
            no_phone: form.getFieldValue('noTelp'),
            cp_name: form.getFieldValue('namaCP'),
            cp_phone: form.getFieldValue('nohpCP'),
            cp_mail: form.getFieldValue('emailCP'),
            cp_position: form.getFieldValue('jabatanCP'),
            website: form.getFieldValue('website'),
            since_year: form.getFieldValue('berdiriTahun') && form.getFieldValue('berdiriTahun')._d.getFullYear(),
            num_employee: parseInt(form.getFieldValue('jumPegawai')),
            recept_mechanism: DOMPurify.sanitize(convertedContent),
            prodi: form.getFieldValue('prodi'),
            criteria: form.getFieldValue('kriteriaPerusahaan'),
            advantages: advantages,
            projects: form.getFieldValue('penerapanTeknologi')
        }).then((response) => {
            notification.success({
                message: 'Data pengajuan berhasil diajukan',
            });
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            form.resetFields();
        }).catch((error) => {
            form.resetFields();
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            notification.error({
                message: 'Data pengajuan sudah pernah diajukan!',
            });
        });
    };

    const checkDate = () => {
        let now = new Date();
        let startDate = new Date(timelineStatus.start_date);
        let endDate = new Date(timelineStatus.end_date);

        if (now >= startDate && now <= endDate) {
            return true
        } else {
            return false
        }
    }

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
        });
    };

    return isLoading ? (<Spin indicator={antIcon} />) : (
        timelineStatus ? checkDate() ?
            <>
                <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
                    <CContainer style={{ paddingTop: "40px" }}>
                        <CRow className="justify-content-center">
                            <CCol md={10}>
                                <CCardGroup>
                                    <CCard>
                                        <CCardHeader style={{ paddingLeft: "20px" }}>
                                            <h5><b>Formulir Pengajuan Perusahaan</b></h5>
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
                                                        <b>Identitas Pengusul</b>
                                                        <hr></hr>
                                                        <Form.List name="namaPengusul">
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row key={key}>
                                                                            <Col span={2}>Nama Pengusul<span style={{ color: "red" }}> *</span></Col>
                                                                            <Col span={10} style={{ paddingRight: "20px" }}>
                                                                                <Form.Item
                                                                                    {...restField}
                                                                                    name={[name, "namaPengusul"]}
                                                                                    fieldKey={[key, "namaPengusul"]}
                                                                                    rules={[{ required: true, message: 'Nama pengusul tidak boleh kosong!' }]}
                                                                                >
                                                                                    <Input />
                                                                                </Form.Item>
                                                                            </Col>
                                                                            <Col span={1}>NIM</Col>
                                                                            <Col span={10}>
                                                                                <Form.Item
                                                                                    {...restField}
                                                                                    name={[name, "nim"]}
                                                                                    fieldKey={[key, "nim"]}
                                                                                >
                                                                                    <Input placeholder='Jika bukan mahasiswa, tidak perlu mengisikan NIM'/>
                                                                                </Form.Item>
                                                                            </Col>
                                                                            <Col span={1} align="center">
                                                                                <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                                            </Col>
                                                                        </Row>
                                                                    ))}
                                                                    <Form.Item style={{ paddingTop: "10px" }}>
                                                                        <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                                            + Nama Pengusul
                                                                        </Button>
                                                                    </Form.Item>
                                                                </>
                                                            )}
                                                        </Form.List>

                                                        <b>Identitas Perusahaan</b>
                                                        <hr></hr>
                                                        <Row>
                                                            <Col span={3}>Nama Instansi<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={8} style={{ paddingRight: "20px" }}>
                                                                <Form.Item
                                                                    name="namaInstansi"
                                                                    rules={[{ required: true, message: 'Nama instansi tidak boleh kosong!' }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>Diajukan untuk Program Studi<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    name="prodi"
                                                                    rules={[{ required: true, message: 'Penerima program studi tidak boleh kosong!' }]}
                                                                >
                                                                    <Select>
                                                                        <Select.Option value="D3">D3</Select.Option>
                                                                        <Select.Option value="D4">D4</Select.Option>
                                                                        <Select.Option value="D3 dan D4">D3 dan D4</Select.Option>
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col span={3}>Alamat<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={8} style={{ paddingRight: "20px" }}>
                                                                <Form.Item
                                                                    name="alamat"
                                                                    rules={[{ required: true, message: 'Alamat tidak boleh kosong!' }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>Jumlah Pegawai</Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    name="jumPegawai"
                                                                    rules={[{ message: 'Format jumlah pegawai hanya angka!', pattern: /^\d+$/ }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col span={3}>Official Website Perusahaan</Col>
                                                            <Col span={8} style={{ paddingRight: "20px" }}>
                                                                <Form.Item
                                                                    name="website"
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>Berdiri Tahun</Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    name="berdiriTahun"
                                                                >
                                                                    <DatePicker picker="year" style={{ width: "100%" }} />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col span={3}>No. Telepon<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={8} style={{ paddingRight: "20px" }}>
                                                                <Form.Item
                                                                    name="noTelp"
                                                                    rules={[{ message: 'Format nomor telepon hanya angka!', pattern: /^\d+$/ },
                                                                    { required: true, message: 'Nomor telepon tidak boleh kosong!' }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={6}>Email Perusahaan<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    name="email"
                                                                    rules={[{ message: 'Format email salah!', type: "email" },
                                                                    { required: true, message: 'Email perusahaan tidak boleh kosong!' }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>

                                                        <b>Identitas Narahubung</b>
                                                        <hr></hr>
                                                        <Row>
                                                            <Col span={5}>Nama Narahubung<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={7} style={{ paddingRight: "20px" }}>
                                                                <Form.Item
                                                                    name="namaCP"
                                                                    rules={[{ required: true, message: 'Nama narahubung tidak boleh kosong!' }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={5}>Jabatan Narahubung<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    name="jabatanCP"
                                                                    rules={[{ required: true, message: 'Nama narahubung tidak boleh kosong!' }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={5}>No. HP Narahubung<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={7} style={{ paddingRight: "20px" }}>
                                                                <Form.Item
                                                                    name="nohpCP"
                                                                    rules={[{ required: true, message: 'Nomor hp narahubung tidak boleh kosong!' },
                                                                    { message: 'Format nomor telepon hanya angka!', pattern: /^\d+$/ }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={5}>Email Narahubung<span style={{ color: "red" }}> *</span></Col>
                                                            <Col span={7}>
                                                                <Form.Item
                                                                    name="emailCP"
                                                                    rules={[{ message: 'Format email salah!', type: "email" }]}
                                                                >
                                                                    <Input />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>

                                                        <b>Penerapan Teknologi</b>
                                                        <hr></hr>

                                                        <Form.List name="penerapanTeknologi">
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row key={key}>
                                                                            <Col span={23}>
                                                                                <Row>
                                                                                    <Col span={6} style={{ paddingTop: "5px" }}>
                                                                                        Nama Produk / Proyek<span style={{ color: "red" }}> *</span>
                                                                                    </Col>
                                                                                    <Col span={6} style={{ paddingRight: "20px" }}>
                                                                                        <Form.Item
                                                                                            name={[name, "name"]}
                                                                                            fieldKey={[key, "name"]}
                                                                                            rules={[{ required: true, message: 'Nama proyek tidak boleh kosong!' }]}
                                                                                        >
                                                                                            <Input />
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                                                        Keterangan<span style={{ color: "red" }}> *</span>
                                                                                    </Col>
                                                                                    <Col span={9} style={{ paddingLeft: "10px" }}>
                                                                                        <Form.Item
                                                                                            name={[name, "description"]}
                                                                                            fieldKey={[key, "description"]}
                                                                                            rules={[{ required: true, message: 'Keterangan tidak boleh kosong!' }]}
                                                                                        >
                                                                                            <Input />
                                                                                        </Form.Item>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                            <Col span={1} align="center">
                                                                                <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                                            </Col>
                                                                        </Row>
                                                                    ))}
                                                                    <Form.Item style={{ paddingTop: "10px" }}>
                                                                        <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                                            + Penerapan Teknologi
                                                                        </Button>
                                                                    </Form.Item>
                                                                </>
                                                            )}
                                                        </Form.List>

                                                        <b>Keunggulan Perusahaan</b>
                                                        <hr></hr>

                                                        <Form.List name="keunggulanPerusahaan">
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row key={key}>
                                                                            <Col span={1}><span style={{ color: "red" }}> *</span></Col>
                                                                            <Col span={22}>
                                                                                <Form.Item
                                                                                    name={[name, "keunggulanPerusahaan"]}
                                                                                    fieldKey={[key, "keunggulanPerusahaan"]}
                                                                                >
                                                                                    <Input />
                                                                                </Form.Item>
                                                                            </Col>
                                                                            <Col span={1} align="center">
                                                                                <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                                            </Col>
                                                                        </Row>
                                                                    ))}
                                                                    <Form.Item style={{ paddingTop: "10px" }}>
                                                                        <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                                            + Keunggulan Perusahaan
                                                                        </Button>
                                                                    </Form.Item>
                                                                </>
                                                            )}
                                                        </Form.List>

                                                        <b>Mekanisme Perusahaan</b>
                                                        <hr></hr>
                                                        <CCard>
                                                            <CCardBody>
                                                                <Form.Item
                                                                    name="description"
                                                                >
                                                                    <Editor
                                                                        editorState={editorState}
                                                                        onEditorStateChange={handleEditorChange}
                                                                        wrapperClassName="wrapper-class"
                                                                        editorClassName="editor-class"
                                                                        toolbarClassName="toolbar-class"
                                                                        placeholder='ex: Terdapat test dan wawancara'
                                                                        toolbar={{
                                                                            options: ['inline', 'blockType', 'fontSize', 'textAlign', 'list',
                                                                                'history', 'colorPicker'],
                                                                            inline: {
                                                                                options: ['italic', 'bold'],
                                                                                bold: { className: 'demo-option-custom' },
                                                                                italic: { className: 'demo-option-custom' },
                                                                                underline: { className: 'demo-option-custom' },
                                                                                strikethrough: { className: 'demo-option-custom' },
                                                                                monospace: { className: 'demo-option-custom' },
                                                                                superscript: { className: 'demo-option-custom' },
                                                                                subscript: { className: 'demo-option-custom' }
                                                                            },
                                                                            blockType: {
                                                                                className: 'demo-option-custom-wide',
                                                                                dropdownClassName: 'demo-dropdown-custom'
                                                                            },
                                                                            fontSize: { className: 'demo-option-custom-medium' }
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </CCardBody>
                                                        </CCard>

                                                        <b>Kriteria Perusahaan<span style={{ color: "red" }}> *</span></b>
                                                        <hr></hr>
                                                        <CCard>
                                                            <CCardBody>
                                                                <Form.Item
                                                                    name="kriteriaPerusahaan"
                                                                    rules={[{ required: true, message: 'Minimal pilih salah satu kriteria!' }]}
                                                                >
                                                                    <Checkbox.Group>
                                                                        <Row>
                                                                            {dataKriteria && dataKriteria.map((item, i) =>
                                                                                <>
                                                                                    <Col span={24}>
                                                                                        <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
                                                                                            {item.criteriaName}
                                                                                        </Checkbox>
                                                                                    </Col>
                                                                                </>
                                                                            )}
                                                                        </Row>
                                                                    </Checkbox.Group>
                                                                </Form.Item>
                                                            </CCardBody>
                                                        </CCard>
                                                        <CRow>
                                                            <CCol sm={12} style={{ textAlign: "right", paddingTop: "10px" }}>
                                                                <Button
                                                                    id="button-submit"
                                                                    size="sm"
                                                                    shape="round"
                                                                    loading={loadings[0]}
                                                                    style={{ color: "white", background: "#3399FF", marginBottom: 16 }}
                                                                    onClick={form.submit}
                                                                >
                                                                    Ajukan
                                                                </Button>
                                                            </CCol>
                                                        </CRow>
                                                    </Form>
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </CCard>
                                </CCardGroup>
                            </CCol>
                        </CRow>
                    </CContainer>
                </div>
            </> :
            <>
                <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
                    <CContainer>
                        <CRow className="justify-content-center">
                            <CCol md={6}>
                                <CCardGroup>
                                    <CCard>
                                        <CCardBody>
                                            <Alert
                                                message="Catatan"
                                                description="Formulir Pengajuan Perusahaan tidak dapat diisi karena diluar waktu yang telah ditetapkan."
                                                type="info"
                                                showIcon
                                            />
                                        </CCardBody>
                                    </CCard>
                                </CCardGroup>
                            </CCol>
                        </CRow>
                    </CContainer>
                </div>

            </> : ""
    )
}

export default PengajuanPerusahaan
