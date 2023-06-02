import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { Tabs, Form, Input, Row, Col, Select, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const { TabPane } = Tabs;

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const DetailCV = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    let history = useHistory();
    const [data, setData] = useState();
    const [jobscope, setJobscope] = useState();
    const [kompetensi, setKompetensi] = useState();
    const [isLoading, setIsLoading] = useState(true)
    axios.defaults.withCredentials = true;
    const pengetahuan = [
        {
            id: 5,
            name: 'Sangat Baik'
        },
        {
            id: 4,
            name: 'Baik'
        },
        {
            id: 3,
            name: 'Cukup Baik'
        },
        {
            id: 2,
            name: 'Kurang Baik'
        },
        {
            id: 1,
            name: 'Sangat Buruk'
        },
    ]
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (!id) {
            history.push("/");
        } else {
            const getCV = async () => {
                axios.defaults.withCredentials = true;
                await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv/detail/${id}`)
                    .then(function (response1) {
                        setData(response1.data.data)
                        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/domicile/${response1.data.data.domicile_id}`)
                            .then(function (response2) {
                                setData(pre => {
                                    return { ...pre, domicile_id: response2.data.data }
                                })
                                if (parseInt(localStorage.getItem("id_role")) !== 2) {
                                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/${parseInt(localStorage.getItem("id_prodi"))}`)
                                        .then(function (response3) {
                                            setJobscope(response3.data.data)
                                            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/${parseInt(localStorage.getItem("id_prodi"))}`)
                                                .then(function (response4) {
                                                    setKompetensi(response4.data.data)
                                                    setIsLoading(false)
                                                })
                                        })
                                } else {
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
                                }

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
            getCV();
        }
    }, [history, id]);

    const getPencapaian = () => {
        let pencapaian = [];

        if (data.educations) {
            pencapaian = pencapaian.concat(data.educations.map((item, i) =>
            (
                {
                    name: [`tahunPendidikan-${i}`],
                    value: `${item.start_year} - ${item.end_year}`,
                }
            )))
            pencapaian = pencapaian.concat(data.educations.map((item, i) =>
            (
                {
                    name: [`tempatPendidikan-${i}`],
                    value: item.institution_name,
                }
            )))
        }
        if (data.organizations) {
            pencapaian = pencapaian.concat(data.organizations.map((item, i) =>
            (
                {
                    name: [`tahunOrganisasi-${i}`],
                    value: `${item.start_year} - ${item.end_year}`,
                }
            )))
            pencapaian = pencapaian.concat(data.organizations.map((item, i) =>
            (
                {
                    name: [`informasiOrganisasi-${i}`],
                    value: item.organization_name,
                }
            )))
        }
        if (data.seminars) {
            pencapaian = pencapaian.concat(data.seminars.map((item, i) =>
            (
                {
                    name: [`tahunSeminar-${i}`],
                    value: item.year,
                }
            )))
            pencapaian = pencapaian.concat(data.seminars.map((item, i) =>
            (
                {
                    name: [`acaraSeminar-${i}`],
                    value: item.seminar_name,
                }
            )))
            pencapaian = pencapaian.concat(data.seminars && data.seminars.map((item, i) =>
            (
                {
                    name: [`peranSeminar-${i}`],
                    value: item.role_description,
                }
            )))
        }
        if (data.championships) {
            pencapaian = pencapaian.concat(data.championships.map((item, i) =>
            (
                {
                    name: [`tahunKejuaraan-${i}`],
                    value: item.year,
                }
            )))
            pencapaian = pencapaian.concat(data.championships.map((item, i) =>
            (
                {
                    name: [`namaKejuaraan-${i}`],
                    value: item.championship_name,
                }
            )))
            pencapaian = pencapaian.concat(data.championships.map((item, i) =>
            (
                {
                    name: [`prestasiKejuaraan-${i}`],
                    value: item.achievement,
                }
            )))
        }

        return pencapaian;
    }

    const getPengalaman = () => {
        let pengalaman = [];

        if (data.experiences) {
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`namaMataKuliah-${i}`],
                    value: item.course_name,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`description-${i}`],
                    value: item.description,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`technology-${i}`],
                    value: item.tech_tool,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`taskName-${i}`],
                    value: item.task_name,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`peranTim-${i}`],
                    value: item.role_description,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`pencapaian-${i}`],
                    value: item.achievement,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`lesson-${i}`],
                    value: item.lesson_learned,
                }
            )))
            pengalaman = pengalaman.concat(data.experiences.map((item, i) =>
            (
                {
                    name: [`waktuPengerjaan-${i}`],
                    value: item.time_description,
                }
            )))
        }
        return pengalaman
    }

    const getKompetensi = () => {
        let kompetensi = [];

        if (data.jobscopes) {
            kompetensi = kompetensi.concat(data.jobscopes.map((item, i) =>
            (
                {
                    name: [`minatPekerjaan-${i}`],
                    value: item.id_jobscope,
                }
            )))
        }

        if (data.skills) {
            kompetensi = kompetensi.concat(data.skills.map((item, i) =>
            (
                {
                    name: [`skill-${i}`],
                    value: item.skill_name,
                }
            )))
        }

        if (data.competencies) {
            if (data.competencies.filter(item => item.competence_type === 1).length > 0) {
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 1).map((item, i) =>
                (
                    {
                        name: [`bahasaPemrograman-${i}`],
                        value: item.competence_id,
                    }
                )))
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 1).map((item, i) =>
                (
                    {
                        name: [`pengetahuanBahasaPemrograman-${i}`],
                        value: item.knowledge_id,
                    }
                )))
            }
            if (data.competencies.filter(item => item.competence_type === 2).length > 0) {
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 2).map((item, i) =>
                (
                    {
                        name: [`database-${i}`],
                        value: item.competence_id,
                    }
                )))
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 2).map((item, i) =>
                (
                    {
                        name: [`pengetahuanDatabase-${i}`],
                        value: item.knowledge_id,
                    }
                )))
            }
            if (data.competencies.filter(item => item.competence_type === 3).length > 0) {
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 3).map((item, i) =>
                (
                    {
                        name: [`framework-${i}`],
                        value: item.competence_id,
                    }
                )))
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 3).map((item, i) =>
                (
                    {
                        name: [`pengetahuanFramework-${i}`],
                        value: item.knowledge_id,
                    }
                )))
            }
            if (data.competencies.filter(item => item.competence_type === 4).length > 0) {
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 4).map((item, i) =>
                (
                    {
                        name: [`tools-${i}`],
                        value: item.competence_id,
                    }
                )))
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 4).map((item, i) =>
                (
                    {
                        name: [`pengetahuanTools-${i}`],
                        value: item.knowledge_id,
                    }
                )))
            }
            if (data.competencies.filter(item => item.competence_type === 5).length > 0) {
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 5).map((item, i) =>
                (
                    {
                        name: [`modelling-${i}`],
                        value: item.competence_id,
                    }
                )))
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 5).map((item, i) =>
                (
                    {
                        name: [`pengetahuanModelling-${i}`],
                        value: item.knowledge_id,
                    }
                )))
            }
            if (data.competencies.filter(item => item.competence_type === 6).length > 0) {
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 6).map((item, i) =>
                (
                    {
                        name: [`bahasaKomunikasi-${i}`],
                        value: item.competence_id,
                    }
                )))
                kompetensi = kompetensi.concat(data.competencies.filter(item => item.competence_type === 6).map((item, i) =>
                (
                    {
                        name: [`pengetahuanBahasaKomunikasi-${i}`],
                        value: item.knowledge_id,
                    }
                )))
            }
        }

        return kompetensi;
    }

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <Tabs type="card">
                <TabPane tab="Identitas" key="1">
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={12}>
                                    <Form
                                        form={form}
                                        name="basic"
                                        wrapperCol={{ span: 24 }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        fields={data ? [
                                            {
                                                name: ["name"],
                                                value: data.name ? data.name : "Belum mengisi"
                                            },
                                            {
                                                name: ["nickname"],
                                                value: data.nickname ? data.nickname : "Belum mengisi"
                                            },
                                            {
                                                name: ["address"],
                                                value: data.address ? data.address : "Belum mengisi"
                                            },
                                            {
                                                name: ["noHP"],
                                                value: data.no_phone ? data.no_phone : "Belum mengisi"
                                            },
                                            {
                                                name: ["email"],
                                                value: data.email ? data.email : "Belum mengisi"
                                            },
                                            {
                                                name: ["jenKel"],
                                                value: data.gender ? data.gender === "F" ? "Perempuan" : "Laki laki" : "Belum mengisi"
                                            },
                                            {
                                                name: ["tempatLahir"],
                                                value: data.place ? data.place : "Belum mengisi"
                                            },
                                            {
                                                name: ["tanggalLahir"],
                                                value: data.birthday ? data.birthday : "Belum mengisi"
                                            },
                                            {
                                                name: ["religion"],
                                                value: data.religion ? data.religion : "Belum mengisi"
                                            },
                                            {
                                                name: ["status"],
                                                value: data.marriage !== null ? data.marriage ? "Menikah" : "Belum menikah" : "Belum mengisi"
                                            },
                                            {
                                                name: ["kewarganegaraan"],
                                                value: data.citizenship ? data.citizenship : "Belum mengisi"
                                            },
                                            {
                                                name: ["domisili"],
                                                value: data.domicile_id ? data.domicile_id : "Belum mengisi"
                                            }
                                        ] : ""}
                                    >
                                        <b>Nama</b>
                                        <Form.Item
                                            name="name"
                                        >
                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                        </Form.Item>

                                        <b>Nama Panggilan</b>
                                        <Form.Item
                                            name="nickname"
                                        >
                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                        </Form.Item>

                                        <b>Domisili</b>
                                        <Form.Item
                                            name="domisili"
                                        >
                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                        </Form.Item>

                                        <b>Alamat</b>
                                        <Form.Item
                                            name="address"
                                        >
                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                        </Form.Item>

                                        <b>Nomor HP</b>
                                        <Form.Item
                                            name="noHP"
                                        >
                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                        </Form.Item>

                                        <b>Email</b>
                                        <Form.Item
                                            name="email"
                                        >
                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                        </Form.Item>

                                        <Row>
                                            <Col span={8}>
                                                <b>Jenis Kelamin</b>
                                                <Form.Item
                                                    name="jenKel"
                                                    style={{ paddingRight: "20px" }}
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <b>Tempat Lahir</b>
                                                <Form.Item
                                                    name="tempatLahir"
                                                    style={{ paddingRight: "20px" }}
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <b>Tanggal Lahir</b>
                                                <Form.Item
                                                    name="tanggalLahir"
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={8}>
                                                <b>Agama</b>
                                                <Form.Item
                                                    name="religion"
                                                    style={{ paddingRight: "20px" }}
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <b>Status</b>
                                                <Form.Item
                                                    name="status"
                                                    style={{ paddingRight: "20px" }}
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <b>Kewarganegaraan</b>
                                                <Form.Item
                                                    name="kewarganegaraan"
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </TabPane>
                <TabPane tab="Pencapaian" key="2">
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={12}>
                                    <Form
                                        form={form}
                                        name="basic"
                                        wrapperCol={{ span: 24 }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        fields={data ? getPencapaian() : ""}
                                    >
                                        <b>Jenjang Pendidikan</b>
                                        {data ? data.educations && data.educations.length > 0 ? data.educations.map((item, i) => (
                                            <Row style={{ paddingTop: "10px" }} key={i}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        name={`tahunPendidikan-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tempat
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name={`tempatPendidikan-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )) : (
                                            <Form.Item
                                                name="defaultValue"
                                            >
                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                            </Form.Item>
                                        ) : ""}
                                        <b>Pengalaman Berorganisasi</b>
                                        {data ? data.organizations && data.organizations.length > 0 ? data.organizations.map((item, i) => (
                                            <Row style={{ paddingTop: "10px" }} key={i}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        name={`tahunOrganisasi-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Informasi
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name={`informasiOrganisasi-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )) : (
                                            <Form.Item
                                                name="defaultValue"
                                            >
                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                            </Form.Item>
                                        ) : ""}
                                        <b>Seminar/Tutorial/Course</b>
                                        {data ? data.seminars && data.seminars.length > 0 ? data.seminars.map((item, i) => (
                                            <Row style={{ paddingTop: "10px" }} key={i}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        name={`tahunSeminar-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Nama Acara
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        name={`acaraSeminar-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Peran
                                                </Col>
                                                <Col span={5}>
                                                    <Form.Item
                                                        name={`peranSeminar-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )) : (
                                            <Form.Item
                                                name="defaultValue"
                                            >
                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                            </Form.Item>
                                        ) : ""}
                                        <b>Kejuaraan</b>
                                        {data ? data.championships && data.championships.length > 0 ? data.championships.map((item, i) => (
                                            <Row style={{ paddingTop: "10px" }} key={i}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        name={`tahunKejuaraan-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Nama Kejuaraan
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        name={`namaKejuaraan-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Prestasi
                                                </Col>
                                                <Col span={5}>
                                                    <Form.Item
                                                        name={`prestasiKejuaraan-${i}`}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )) : (
                                            <Form.Item
                                                name="defaultValue"
                                            >
                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                            </Form.Item>
                                        ) : ""}
                                        <Form.Item
                                            name="defaultValue"
                                            initialValue={"Belum mengisi"}
                                        >
                                            <Input hidden />
                                        </Form.Item>
                                    </Form>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </TabPane>
                <TabPane tab="Pengalaman" key="3">
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={12}>
                                    <Form
                                        form={form}
                                        name="basic"
                                        wrapperCol={{ span: 24 }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        fields={data ? getPengalaman() : ""}
                                    >
                                        <b>Pengalaman Pengerjaan Tugas dalam Mata Kuliah</b>
                                        {data ? data.experiences && data.experiences.length > 0 ? data.experiences.map((item, i) => (
                                            <div key={i}>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Nama Mata Kuliah
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`namaMataKuliah-${i}`}
                                                        >
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Deskripsi
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`description-${i}`}
                                                        >
                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Teknologi dan Alat
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`technology-${i}`}
                                                        >
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Tugas yang dikerjakan
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`taskName-${i}`}
                                                        >
                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Peran dalam Tim
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`peranTim-${i}`}
                                                        >
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Pencapaian
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`pencapaian-${i}`}
                                                        >
                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Waktu Pengerjaan
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`waktuPengerjaan-${i}`}
                                                        >
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Hal yang dipelajari
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            name={`lesson-${i}`}
                                                        >
                                                            <TextArea rows={4} readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <hr style={{ border: "1px solid black" }} />
                                            </div>
                                        )) : (
                                            <Form.Item
                                                name="defaultValue"
                                            >
                                                <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                            </Form.Item>
                                        ) : ""}
                                        <Form.Item
                                            name="defaultValue"
                                        >
                                            <Input hidden />
                                        </Form.Item>
                                    </Form>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </TabPane>
                <TabPane tab="Minat" key="4">
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={12}>
                                    <Form
                                        form={form}
                                        name="basic"
                                        wrapperCol={{ span: 24 }}
                                        // onFinish={onFinish}
                                        // onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        fields={data ? getKompetensi() : ""}
                                    >
                                        <b>Minat Pekerjaan</b>
                                        {data ? data.jobscopes.length > 0 ? data.jobscopes.map((item, i) => (
                                            <div key={i}>
                                                <Form.Item
                                                    name={`minatPekerjaan-${i}`}
                                                    key={i}
                                                >
                                                    <Select disabled style={{ width: "100%" }}>
                                                        {jobscope && jobscope.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        )) : (
                                            <Row style={{ paddingTop: "10px" }}>
                                                <Col span={24}>
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                </Col>
                                            </Row>
                                        ) : ""}
                                    </Form>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </TabPane>
                <TabPane tab="Kompetensi" key="5">
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={12}>
                                    <Form
                                        form={form}
                                        name="basic"
                                        wrapperCol={{ span: 24 }}
                                        // onFinish={onFinish}
                                        // onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        fields={data ? getKompetensi() : ""}
                                    >
                                        <b>Hardskill dan Softskill yang ingin dikembangkan</b>
                                        {data && data.skills.length > 0 ? data.skills.map((item, i) => (
                                            <div key={i}>
                                                <Form.Item
                                                    name={`skill-${i}`}
                                                    key={i}
                                                >
                                                    <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} />
                                                </Form.Item>
                                            </div>
                                        )) :
                                            <>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={24}>
                                                        <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                    </Col>
                                                </Row>
                                                <br />
                                            </>}
                                        <b>Bahasa Pemrograman</b>
                                        {data ? data.competencies && data.competencies.filter(item => item.competence_type === 1).length > 0 ?
                                            data.competencies.filter(item => item.competence_type === 1).map((item, i) => (
                                                <Row style={{ paddingTop: "10px" }} key={i}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            name={`bahasaPemrograman-${i}`}
                                                            style={{ paddingRight: "20px" }}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {kompetensi && kompetensi.filter(item => item.type === 1).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                        Pengetahuan
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name={`pengetahuanBahasaPemrograman-${i}`}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <>
                                                    <Row style={{ paddingTop: "10px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </>
                                            ) : ""}
                                        <b>Database</b>
                                        {data ? data.competencies && data.competencies.filter(item => item.competence_type === 2).length > 0 ?
                                            data.competencies.filter(item => item.competence_type === 2).map((item, i) => (
                                                <Row style={{ paddingTop: "10px" }} key={i}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            name={`database-${i}`}
                                                            style={{ paddingRight: "20px" }}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {kompetensi && kompetensi.filter(item => item.type === 2).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                        Pengetahuan
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name={`pengetahuanDatabase-${i}`}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <>
                                                    <Row style={{ paddingTop: "10px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </>
                                            ) : ""}
                                        <b>Framework</b>
                                        {data ? data.competencies && data.competencies.filter(item => item.competence_type === 3).length > 0 ?
                                            data.competencies.filter(item => item.competence_type === 3).map((item, i) => (
                                                <Row style={{ paddingTop: "10px" }} key={i}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            name={`framework-${i}`}
                                                            style={{ paddingRight: "20px" }}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {kompetensi && kompetensi.filter(item => item.type === 3).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                        Pengetahuan
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name={`pengetahuanFramework-${i}`}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <>
                                                    <Row style={{ paddingTop: "10px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </>
                                            ) : ""}
                                        <b>Tools</b>
                                        {data ? data.competencies && data.competencies.filter(item => item.competence_type === 4).length > 0 ?
                                            data.competencies.filter(item => item.competence_type === 4).map((item, i) => (
                                                <Row style={{ paddingTop: "10px" }} key={i}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            name={`tools-${i}`}
                                                            style={{ paddingRight: "20px" }}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {kompetensi && kompetensi.filter(item => item.type === 4).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                        Pengetahuan
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name={`pengetahuanTools-${i}`}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <>
                                                    <Row style={{ paddingTop: "10px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </>
                                            ) : ""}
                                        <b>Modelling Tools</b>
                                        {data ? data.competencies && data.competencies.filter(item => item.competence_type === 5).length > 0 ?
                                            data.competencies.filter(item => item.competence_type === 5).map((item, i) => (
                                                <Row style={{ paddingTop: "10px" }} key={i}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            name={`modelling-${i}`}
                                                            style={{ paddingRight: "20px" }}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {kompetensi && kompetensi.filter(item => item.type === 5).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                        Pengetahuan
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name={`pengetahuanModelling-${i}`}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <>
                                                    <Row style={{ paddingTop: "10px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </>
                                            ) : ""}
                                        <b>Bahasa Komunikasi</b>
                                        {data ? data.competencies && data.competencies.filter(item => item.competence_type === 6).length > 0 ?
                                            data.competencies.filter(item => item.competence_type === 6).map((item, i) => (
                                                <Row style={{ paddingTop: "10px" }} key={i}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            name={`bahasaKomunikasi-${i}`}
                                                            style={{ paddingRight: "20px" }}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {kompetensi && kompetensi.filter(item => item.type === 6).map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3} style={{ paddingTop: "5px" }}>
                                                        Pengetahuan
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name={`pengetahuanBahasaKomunikasi-${i}`}
                                                        >
                                                            <Select disabled style={{ width: "100%" }}>
                                                                {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )) : (
                                                <>
                                                    <Row style={{ paddingTop: "10px" }}>
                                                        <Col span={24}>
                                                            <Input readOnly style={{ cursor: "not-allowed", background: "#EEEEEE" }} value={"Belum Mengisi"} />
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </>
                                            ) : ""}
                                    </Form>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </TabPane>
            </Tabs>
        </>
    )
}

export default DetailCV
