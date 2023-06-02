import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { Steps, Form, Input, Radio, Row, Col, Button, DatePicker, Select, notification, Modal, Typography, Space, Divider, Spin } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { TextArea } = Input;

const { Step } = Steps;

const { RangePicker } = DatePicker;

const UpdateCV = () => {
    const { id } = useParams();
    const [form1] = Form.useForm();
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [data, setData] = useState();
    const [domisili, setDomisili] = useState([]);
    const [chooseMinat, setChooseMinat] = useState([]);
    const [chooseKompetensi, setChooseKompetensi] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSpinner, setIsSpinner] = useState(true);
    let history = useHistory();
    const [jobscope, setJobscope] = useState();
    const [kompetensi, setKompetensi] = useState();
    const [region, setRegion] = useState();
    const [tipeKompetensi, setTipeKompetensi] = useState([])
    const [name, setName] = useState("");
    const [loadings, setLoadings] = useState([]);
    const [value, setValue] = useState("");
    const [save, setSave] = useState(false);
    const [prev, setPrev] = useState(false);
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

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

    const [isModalcreateVisible, setIsModalCreateVisible] = useState({
        cakupanPekerjaan: false,
        bahasaPemrograman: false,
        modelling: false,
        database: false,
        frameworks: false,
        tools: false,
        bahasaKomunikasi: false,
    })

    const getCreateModal = (kompetensi) => {
        if (kompetensi === "Bahasa Pemrograman") {
            return isModalcreateVisible.bahasaPemrograman
        } else if (kompetensi === "Modelling Tools") {
            return isModalcreateVisible.modelling
        } else if (kompetensi === "Database") {
            return isModalcreateVisible.database
        } else if (kompetensi === "Frameworks") {
            return isModalcreateVisible.frameworks
        } else if (kompetensi === "Tools") {
            return isModalcreateVisible.tools
        } else if (kompetensi === "Bahasa Komunikasi") {
            return isModalcreateVisible.bahasaKomunikasi
        } else {
            return isModalcreateVisible.cakupanPekerjaan
        }
    }

    const showModalCreate = (kompetensi) => {
        if (kompetensi === "Bahasa Pemrograman") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaPemrograman: true }
            })
        } else if (kompetensi === "Modelling Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, modelling: true }
            })
        } else if (kompetensi === "Database") {
            setIsModalCreateVisible(pre => {
                return { ...pre, database: true }
            })
        } else if (kompetensi === "Frameworks") {
            setIsModalCreateVisible(pre => {
                return { ...pre, frameworks: true }
            })
        } else if (kompetensi === "Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, tools: true }
            })
        } else if (kompetensi === "Bahasa Komunikasi") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaKomunikasi: true }
            })
        } else {
            setIsModalCreateVisible(pre => {
                return { ...pre, cakupanPekerjaan: true }
            })
        }
    };

    const handleOkCreate = async (data, index) => {
        enterLoading(index)
        let kompetensi = data.name;
        if (kompetensi === "Minat Pekerjaan") {
            await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/create`, {
                name: name,
                prodi_id: parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : 0
            }).then((response) => {
                refreshData(index);
                notification.success({
                    message: 'Minat Pekerjaan berhasil dibuat'
                });
                setName("");
                if (kompetensi === "Minat Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                form.resetFields();
            }).catch((error) => {
                if (kompetensi === "Minat Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setName("");
                form.resetFields();
                notification.error({
                    message: 'Minat Pekerjaan gagal dibuat!'
                });
            });
        } else {
            await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/create`, {
                name: name,
                id_competencetype: data.id,
                prodi_id: parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : 0
            }).then((response) => {
                refreshData();
                notification.success({
                    message: 'Kompetensi berhasil dibuat'
                });
                setName("");
                if (kompetensi === "Minat Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                form.resetFields();
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            }).catch((error) => {
                if (kompetensi === "Minat Pekerjaan") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, cakupanPekerjaan: false }
                    })
                } else if (kompetensi === "Bahasa Pemrograman") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaPemrograman: false }
                    })
                } else if (kompetensi === "Modelling Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, modelling: false }
                    })
                } else if (kompetensi === "Database") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, database: false }
                    })
                } else if (kompetensi === "Frameworks") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, frameworks: false }
                    })
                } else if (kompetensi === "Tools") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, tools: false }
                    })
                } else if (kompetensi === "Bahasa Komunikasi") {
                    setIsModalCreateVisible(pre => {
                        return { ...pre, bahasaKomunikasi: false }
                    })
                }
                setName("");
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                form.resetFields();
                notification.error({
                    message: 'Kompetensi gagal dibuat!'
                });
            });
        }
    };

    const handleCancelCreate = (kompetensi) => {
        if (kompetensi === "Minat Pekerjaan") {
            setIsModalCreateVisible(pre => {
                return { ...pre, cakupanPekerjaan: false }
            })
        } else if (kompetensi === "Bahasa Pemrograman") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaPemrograman: false }
            })
        } else if (kompetensi === "Modelling Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, modelling: false }
            })
        } else if (kompetensi === "Database") {
            setIsModalCreateVisible(pre => {
                return { ...pre, database: false }
            })
        } else if (kompetensi === "Frameworks") {
            setIsModalCreateVisible(pre => {
                return { ...pre, frameworks: false }
            })
        } else if (kompetensi === "Tools") {
            setIsModalCreateVisible(pre => {
                return { ...pre, tools: false }
            })
        } else if (kompetensi === "Bahasa Komunikasi") {
            setIsModalCreateVisible(pre => {
                return { ...pre, bahasaKomunikasi: false }
            })
        }
    };

    const next = () => {
        setIsSpinner(true)
        setCurrent(current + 1);
        setTimeout(() => setIsSpinner(false), 100)
    };

    const prevs = () => {
        setCurrent(current - 1);
    };

    const onFinish = async (index, step) => {
        if (prev === true) {
            prevs()
            setPrev(false)
        } else {
            if (save === true) {
                let jenjangPendidikan = [];
                let pengalamanPengerjaanTugas = [];
                let pengalamanBerorganisasi = [];
                let competencies = [];
                let minatPekerjaan = [];
                let skill = [];
                let seminarTutorialCourse = [];
                let kejuaraan = [];
                let comp = [];
                let minat = [];
                enterLoading(index)
                if (form1.getFieldValue('jenjangPendidikan')) {
                    jenjangPendidikan = form1.getFieldValue('jenjangPendidikan').map((item) => {
                        return {
                            institution_name: item.institution_name,
                            start_year: item.yearPendidikan[0]._d.getFullYear(),
                            end_year: item.yearPendidikan[1]._d.getFullYear(),
                        }
                    })
                }
                if (form1.getFieldValue('pengalamanPengerjaanTugas')) {
                    pengalamanPengerjaanTugas = form1.getFieldValue('pengalamanPengerjaanTugas')
                }
                if (form1.getFieldValue('pengalamanBerorganisasi')) {
                    pengalamanBerorganisasi = form1.getFieldValue('pengalamanBerorganisasi').map((item) => {
                        return {
                            organization_name: item.organization_name,
                            start_year: item.yearOrganisasi[0]._d.getFullYear(),
                            end_year: item.yearOrganisasi[1]._d.getFullYear(),
                        }
                    })
                }
                if (form1.getFieldValue('bahasaPemrograman')) {
                    competencies = competencies.concat(form1.getFieldValue('bahasaPemrograman'));
                }
                if (form1.getFieldValue('database')) {
                    competencies = competencies.concat(form1.getFieldValue('database'));
                }
                if (form1.getFieldValue('framework')) {
                    competencies = competencies.concat(form1.getFieldValue('framework'));
                }
                if (form1.getFieldValue('modelling')) {
                    competencies = competencies.concat(form1.getFieldValue('modelling'));
                }
                if (form1.getFieldValue('tools')) {
                    competencies = competencies.concat(form1.getFieldValue('tools'));
                }
                if (form1.getFieldValue('bahasaKomunikasi')) {
                    competencies = competencies.concat(form1.getFieldValue('bahasaKomunikasi'));
                }
                if (form1.getFieldValue('minatPekerjaan')) {
                    minatPekerjaan = form1.getFieldValue('minatPekerjaan')
                }
                if (form1.getFieldValue('skill')) {
                    skill = form1.getFieldValue('skill')
                }
                if (form1.getFieldValue('seminarTutorialCourse')) {
                    seminarTutorialCourse = form1.getFieldValue('seminarTutorialCourse').map((item) => {
                        return {
                            seminar_name: item.seminar_name,
                            role_description: item.role_descriptionSeminar,
                            year: item.yearSeminar._d.getFullYear()
                        }
                    })
                }
                if (form1.getFieldValue('kejuaraan')) {
                    kejuaraan = form1.getFieldValue('kejuaraan').map((item) => {
                        return {
                            championship_name: item.championship_name,
                            achievement: item.achievementKejuaraan,
                            year: item.yearKejuaraan._d.getFullYear()
                        }
                    })
                }

                competencies.map(item => {
                    return comp.push({
                        id_competence: item.id_competence,
                        id_knowledge: item.id_knowledge,
                        prodi_id: parseInt(localStorage.getItem("id_prodi"))
                    })
                })
                minatPekerjaan.map(item => {
                    return minat.push({
                        id_jobscope: item.id_jobscope,
                        prodi_id: parseInt(localStorage.getItem("id_prodi"))
                    })
                })

                // console.log(comp)
                // console.log(minat)
                // console.log(competencies)
                // console.log(minatPekerjaan)

                // console.log({
                //     nickname: data.nickname,
                //     address: data.address,
                //     email: data.email,
                //     religion: data.religion,
                //     gender: data.gender,
                //     place: data.place,
                //     birthday: data.birthday,
                //     marriage: data.marriage,
                //     citizenship: data.citizenship,
                //     no_phone: data.no_phone,
                //     domicile_id: data.domicile_id,
                //     educations: jenjangPendidikan,
                //     experiences: pengalamanPengerjaanTugas,
                //     organizations: pengalamanBerorganisasi,
                //     competencies: competencies,
                //     jobscopes: minatPekerjaan,
                //     skills: skill,
                //     seminars: seminarTutorialCourse,
                //     championships: kejuaraan
                // })

                await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv/update/${id}`, {
                    nickname: data.nickname,
                    address: data.address,
                    email: data.email,
                    religion: data.religion,
                    gender: data.gender,
                    place: data.place,
                    birthday: data.birthday,
                    marriage: data.marriage,
                    citizenship: data.citizenship,
                    no_phone: data.no_phone,
                    domicile_id: data.domicile_id,
                    educations: step >= 1 ? jenjangPendidikan : data.educations === jenjangPendidikan ? jenjangPendidikan ? jenjangPendidikan : null : data.educations ? data.educations : null,
                    experiences: step >= 2 ? pengalamanPengerjaanTugas : data.experiences === pengalamanPengerjaanTugas ? pengalamanPengerjaanTugas ? pengalamanPengerjaanTugas : null : data.experiences ? data.experiences : null,
                    organizations: step >= 1 ? pengalamanBerorganisasi : data.organizations === pengalamanBerorganisasi ? pengalamanBerorganisasi ? pengalamanBerorganisasi : null : data.organizations ? data.organizations : null,
                    competencies: step >= 4 ? comp : data.competencies === comp ? comp ? comp : null : data.competencies ? data.competencies : null,
                    jobscopes: step >= 3 ? minat : data.jobscopes === minat ? minat ? minat : null : data.jobscopes ? data.jobscopes : null,
                    skills: step >= 4 ? skill : data.skills === skill ? skill ? skill : null : data.skills ? data.skills : null,
                    seminars: step >= 1 ? seminarTutorialCourse : data.seminars === seminarTutorialCourse ? seminarTutorialCourse ? seminarTutorialCourse : null : data.seminars ? data.seminars : null,
                    championships: step >= 1 ? kejuaraan : data.championships === kejuaraan ? kejuaraan ? kejuaraan : null : data.championships ? data.championships : null
                }).then((response) => {
                    setLoadings(prevLoadings => {
                        const newLoadings = [...prevLoadings];
                        newLoadings[index] = false;
                        return newLoadings;
                    });
                    notification.success({
                        message: 'CV berhasil diubah'
                    });
                    history.push("/CV");
                }).catch((error) => {
                    setLoadings(prevLoadings => {
                        const newLoadings = [...prevLoadings];
                        newLoadings[index] = false;
                        return newLoadings;
                    });
                    notification.error({
                        message: 'CV gagal diubah!'
                    });
                });
            } else {
                next()
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
        });
    };

    const refreshData = (index) => {
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : 0}`).then(result => {
            setKompetensi(result.data.data)
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : 0}`).then(result => {
                setJobscope(result.data.data)
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            })

        })
    }

    useEffect(() => {
        const getCV = async () => {
            let data = [];
            axios.defaults.withCredentials = true;
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv/detail/${id}`)
                .then(function (response) {
                    setData(response.data.data)
                    response.data.data.jobscopes.map(item => {
                        return data.push(item.id_jobscope)
                    })
                    setChooseMinat(data);
                    data = [];
                    response.data.data.competencies.map(item => {
                        return data.push(item.competence_id)
                    })
                    setChooseKompetensi(data)
                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/domicile/${response.data.data.domicile_id}`)
                        .then(function (response) {
                            setRegion(response.data.data)
                            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : 0}`)
                                .then(function (response) {
                                    setJobscope(response.data.data)
                                    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/${parseInt(localStorage.getItem("id_role")) !== 2 ? parseInt(localStorage.getItem("id_prodi")) : 0}`)
                                        .then(function (response) {
                                            setKompetensi(response.data.data)
                                            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all-type`)
                                                .then(result => {
                                                    data = result.data.data;
                                                    data.push({
                                                        id: 0,
                                                        name: "Minat Pekerjaan",
                                                        description: "Minat Pekerjaan"
                                                    })
                                                    setTipeKompetensi(data)
                                                    setIsLoading(false)
                                                    setIsSpinner(false)
                                                })
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
        getCV();
    }, [history, id]);

    const getDomisili = async (val) => {
        axios.defaults.withCredentials = true;
        await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/domicile?domicile-like=${val}`)
            .then(function (response) {
                setDomisili(response.data.data)
            });
    }

    function onSearch(val) {
        setValue(val)
        if (val.length >= 3) {
            getDomisili(val);
        } else {
            setDomisili([]);
        }
    }

    function onChangeDateUpdate(date, dateString) {
        date && setData(pre => {
            return { ...pre, birthday: moment(date._d).format("yyyy/MM/DD") }
        })
    }

    function onChangeDomisili(value) {
        setData(pre => {
            return { ...pre, domicile_id: value }
        })
        setRegion(value);
    }

    function onChangeReligion(value) {
        setData(pre => {
            return { ...pre, religion: value }
        })
    }

    const onChangeKompetensi = () => {
        let data = [];
        form1.getFieldValue('bahasaPemrograman') && form1.getFieldValue('bahasaPemrograman').map(item => {
            return item && data.push(item.competence_id)
        })
        form1.getFieldValue('database') && form1.getFieldValue('database').map(item => {
            return item && data.push(item.competence_id)
        })
        form1.getFieldValue('framework') && form1.getFieldValue('framework').map(item => {
            return item && data.push(item.competence_id)
        })
        form1.getFieldValue('modelling') && form1.getFieldValue('modelling').map(item => {
            return item && data.push(item.competence_id)
        })
        form1.getFieldValue('tools') && form1.getFieldValue('tools').map(item => {
            return item && data.push(item.competence_id)
        })
        form1.getFieldValue('bahasaKomunikasi') && form1.getFieldValue('bahasaKomunikasi').map(item => {
            return item && data.push(item.competence_id)
        })
        setChooseKompetensi(data);
    }

    const onChangeMinat = () => {
        let data = [];
        // console.log(form1.getFieldValue('minatPekerjaan'))
        form1.getFieldValue('minatPekerjaan').map(item => {
            return item && data.push(item.id_jobscope)
        })
        setChooseMinat(data);
    }

    const steps = [
        {
            title: 'Identitas',
            content:
                <CRow>
                    <CCol sm={12}>
                        <Form
                            form={form1}
                            name="basic"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => onFinish(0, 0)}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            fields={data ? [
                                {
                                    name: ["name"],
                                    value: localStorage.getItem("name") && localStorage.getItem("name")
                                },
                                {
                                    name: ["nickname"],
                                    value: data.nickname && data.nickname
                                },
                                {
                                    name: ["address"],
                                    value: data.address && data.address
                                },
                                {
                                    name: ["noHP"],
                                    value: data.no_phone && data.no_phone
                                },
                                {
                                    name: ["email"],
                                    value: data.email && data.email
                                },
                                {
                                    name: ["jenKel"],
                                    value: data.gender && data.gender
                                },
                                {
                                    name: ["tempatLahir"],
                                    value: data.place && data.place
                                },
                                {
                                    name: ["tanggalLahir"],
                                    value: data.birthday && moment(data.birthday, 'YYYY/MM/DD')
                                },
                                {
                                    name: ["religion"],
                                    value: data.religion && data.religion
                                },
                                {
                                    name: ["status"],
                                    value: data.marriage && data.marriage
                                },
                                {
                                    name: ["kewarganegaraan"],
                                    value: data.citizenship && data.citizenship
                                },
                                {
                                    name: ["domisili"],
                                    value: region && region
                                },
                            ] : ""}
                        >
                            <b>Nama</b>
                            <Form.Item
                                name="name"
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, name: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>

                            <b>Nama Panggilan</b>
                            <Form.Item
                                name="nickname"
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, nickname: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>

                            <b>Domisili<span style={{ color: "red" }}> *</span></b>
                            <Form.Item
                                name="domisili"
                                rules={[{ required: true, message: 'Domisili tidak boleh kosong!' }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    notFoundContent={value.length >= 3 ? <Spin size="small" /> : "Ketikkan minimal 3 huruf untuk mencari domisili"}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    placeholder="Pilih domisili"
                                    onSearch={onSearch}
                                    style={{ width: "100%" }}
                                    onChange={onChangeDomisili}
                                >

                                    {domisili.map((item, i) => (<Select.Option key={i} value={item.id}>{item.region_name}</Select.Option>))}
                                </Select>
                                {/* <Input/> */}
                            </Form.Item>

                            <b>Alamat</b>
                            <Form.Item
                                name="address"
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, address: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>

                            <b>Nomor HP</b>
                            <Form.Item
                                name="noHP"
                                rules={[{ message: 'Format nomor telepon hanya angka!', pattern: /^\d+$/ }]}
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, no_phone: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>

                            <b>Email</b>
                            <Form.Item
                                name="email"
                                rules={[{ type: "email", message: 'Format email salah!' }]}
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, email: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>

                            <b>Kewarganegaraan</b>
                            <Form.Item
                                name="kewarganegaraan"
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, citizenship: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Row>
                                <Col span={8}>
                                    <b>Jenis Kelamin</b>
                                    <Form.Item
                                        name="jenKel"
                                    >
                                        <Radio.Group>
                                            <Radio
                                                value="M"
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, gender: "M" }
                                                    })
                                                }}
                                            >Laki laki</Radio>
                                            <Radio
                                                value="F"
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, gender: "F" }
                                                    })
                                                }}
                                            >Perempuan</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <b>Status</b>
                                    <Form.Item
                                        name="status"
                                        style={{ paddingRight: "20px" }}
                                    >
                                        <Radio.Group>
                                            <Radio
                                                value={true}
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, marriage: true }
                                                    })
                                                }}
                                            >Menikah</Radio>
                                            <Radio
                                                value={false}
                                                onChange={e => {
                                                    setData(pre => {
                                                        return { ...pre, marriage: false }
                                                    })
                                                }}
                                            >Belum Menikah</Radio>
                                        </Radio.Group>
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
                                        <Select onChange={onChangeReligion}>
                                            <Select.Option value="Islam">Islam</Select.Option>
                                            <Select.Option value="Protestan">Protestan</Select.Option>
                                            <Select.Option value="Katolik">Katolik</Select.Option>
                                            <Select.Option value="Hindu">Hindu</Select.Option>
                                            <Select.Option value="Budha">Budha</Select.Option>
                                            <Select.Option value="Konghucu">Konghucu</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <b>Tempat Lahir</b>
                                    <Form.Item
                                        name="tempatLahir"
                                        style={{ paddingRight: "20px" }}
                                    >
                                        <Input
                                            onChange={e => {
                                                setData(pre => {
                                                    return { ...pre, place: e.target.value }
                                                })
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <b>Tanggal Lahir</b>
                                    <Form.Item
                                        name="tanggalLahir"
                                    >
                                        <DatePicker style={{ width: "100%" }} onChange={onChangeDateUpdate} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                </Col>
                            </Row>
                        </Form>
                    </CCol>
                </CRow>
        },
        {
            title: 'Pencapaian',
            content:
                <CRow>
                    <CCol sm={12}>
                        <Form
                            form={form1}
                            name="dynamic_form_nest_item"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => onFinish(0, 1)}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <b>Jenjang Pendidikan</b>
                            <Form.List name="jenjangPendidikan"
                                initialValue={data && data.educations && data.educations.length > 0 && data.educations.map((item) => {
                                    return {
                                        yearPendidikan: [moment(item.start_year.toString()), moment(item.end_year.toString())],
                                        institution_name: item.institution_name
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "yearPendidikan"]}
                                                        fieldKey={[key, "yearPendidikan"]}
                                                        rules={[{ required: true, message: 'Tahun tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <RangePicker picker="year" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tempat<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={11}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "institution_name"]}
                                                        fieldKey={[key, "institution_name"]}
                                                        rules={[{ required: true, message: 'Tempat tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} style={{ paddingTop: "5px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Jenjang Pendidikan
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Pengalaman Berorganisasi</b>
                            <Form.List name="pengalamanBerorganisasi"
                                initialValue={data && data.organizations && data.organizations.length > 0 && data.organizations.map((item) => {
                                    return {
                                        yearOrganisasi: [moment(item.start_year.toString()), moment(item.end_year.toString())],
                                        organization_name: item.organization_name
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "yearOrganisasi"]}
                                                        fieldKey={[key, "yearOrganisasi"]}
                                                        rules={[{ required: true, message: 'Tahun tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <RangePicker picker="year" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Informasi<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={11}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "organization_name"]}
                                                        fieldKey={[key, "organization_name"]}
                                                        rules={[{ required: true, message: 'Informasi tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} style={{ paddingTop: "5px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Pengalaman Berorganisasi
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Seminar/Tutorial/Course</b>
                            <Form.List name="seminarTutorialCourse"
                                initialValue={data && data.seminars && data.seminars.length > 0 && data.seminars.map((item) => {
                                    return {
                                        yearSeminar: moment(item.year.toString()),
                                        seminar_name: item.seminar_name,
                                        role_descriptionSeminar: item.role_description
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "yearSeminar"]}
                                                        fieldKey={[key, "yearSeminar"]}
                                                        rules={[{ required: true, message: 'Tahun tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <DatePicker picker="year" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Nama Acara<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "seminar_name"]}
                                                        fieldKey={[key, "seminar_name"]}
                                                        rules={[{ required: true, message: 'Nama acara tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Peran<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "role_descriptionSeminar"]}
                                                        fieldKey={[key, "role_descriptionSeminar"]}
                                                        rules={[{ required: true, message: 'Peran tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} style={{ paddingTop: "5px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Seminar/Tutorial/Course
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Kejuaraan</b>
                            <Form.List name="kejuaraan"
                                initialValue={data && data.championships && data.championships.length > 0 && data.championships.map((item) => {
                                    return {
                                        yearKejuaraan: moment(item.year.toString()),
                                        achievementKejuaraan: item.achievement,
                                        championship_name: item.championship_name
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Tahun<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "yearKejuaraan"]}
                                                        fieldKey={[key, "yearKejuaraan"]}
                                                        rules={[{ required: true, message: 'Tahun tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <DatePicker picker="year" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Nama Kejuaraan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "championship_name"]}
                                                        fieldKey={[key, "championship_name"]}
                                                        rules={[{ required: true, message: 'Nama kejuaraan tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ paddingTop: "5px" }}>
                                                    Prestasi<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={4}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "achievementKejuaraan"]}
                                                        fieldKey={[key, "achievementKejuaraan"]}
                                                        rules={[{ required: true, message: 'Prestasi tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} style={{ paddingTop: "5px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Kejuaraan
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </CCol>
                </CRow>
        },
        {
            title: 'Pengalaman',
            content:
                <CRow>
                    <CCol sm={12}>
                        <Form
                            form={form1}
                            name="dynamic_form_nest_item"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => onFinish(0, 2)}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <b>Pengalaman Pengerjaan Tugas dalam Mata Kuliah</b>
                            <Form.List name="pengalamanPengerjaanTugas"
                                initialValue={data && data.experiences && data.experiences.length > 0 && data.experiences.map((item) => {
                                    return {
                                        description: item.description,
                                        achievement: item.achievement,
                                        course_name: item.course_name,
                                        task_name: item.task_name,
                                        tech_tool: item.tech_tool,
                                        role_description: item.role_description,
                                        lesson_learned: item.lesson_learned,
                                        time_description: item.time_description,
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key}>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Nama Mata Kuliah<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "course_name"]}
                                                            fieldKey={[key, "course_name"]}
                                                            rules={[{ required: true, message: 'Nama mata kuliah tidak boleh kosong!' }]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Deskripsi<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "description"]}
                                                            fieldKey={[key, "description"]}
                                                            rules={[{ required: true, message: 'Deskripsi tidak boleh kosong!' }]}
                                                        >
                                                            <TextArea rows={4} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Teknologi dan Alat<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "tech_tool"]}
                                                            fieldKey={[key, "tech_tool"]}
                                                            rules={[{ required: true, message: 'Teknologi dan alat tidak boleh kosong!' }]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Nama Tugas<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "task_name"]}
                                                            fieldKey={[key, "task_name"]}
                                                            rules={[{ required: true, message: 'Nama tugas tidak boleh kosong!' }]}
                                                        >
                                                            <TextArea rows={4} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Peran dalam Tim<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "role_description"]}
                                                            fieldKey={[key, "role_description"]}
                                                            rules={[{ required: true, message: 'Peran dalam tim tidak boleh kosong!' }]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Pencapaian<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "achievement"]}
                                                            fieldKey={[key, "achievement"]}
                                                            rules={[{ required: true, message: 'Pencapaian tidak boleh kosong!' }]}
                                                        >
                                                            <TextArea rows={4} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Waktu Pengerjaan<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "time_description"]}
                                                            fieldKey={[key, "time_description"]}
                                                            rules={[{ required: true, message: 'Waktu pengerjaan tidak boleh kosong!' }]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row style={{ paddingTop: "10px" }}>
                                                    <Col span={4}>
                                                        Hal yang dipelajari<span style={{ color: "red" }}> *</span>
                                                    </Col>
                                                    <Col span={20}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "lesson_learned"]}
                                                            fieldKey={[key, "lesson_learned"]}
                                                            rules={[{ required: true, message: 'Pencapaian tidak boleh kosong!' }]}
                                                        >
                                                            <TextArea rows={4} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => remove(name)} block>
                                                        - Hapus
                                                    </Button>
                                                </Form.Item>
                                                <hr style={{ border: "1px solid black" }} />
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Pengalaman Pengerjaan Tugas dalam Mata Kuliah
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </CCol>
                </CRow>
        },
        {
            title: 'Minat',
            content:
                <CRow>
                    <CCol sm={12}>
                        <Form
                            form={form1}
                            name="dynamic_form_nest_item"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => onFinish(0, 3)}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <b>Minat Pekerjaan</b>
                            <Form.List name="minatPekerjaan"
                                initialValue={data && data.jobscopes && data.jobscopes.length > 0 && data.jobscopes.map((item) => {
                                    return {
                                        id_jobscope: item.id_jobscope
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={22}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_jobscope"]}
                                                        fieldKey={[key, "id_jobscope"]}
                                                        rules={[{ required: true, message: 'Minat tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "35px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "104%" }}
                                                            onChange={onChangeMinat}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Minat Pekerjaan")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Minat Pekerjaan Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {jobscope && jobscope.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseMinat.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeMinat()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Minat Pekerjaan
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </CCol>
                </CRow>
        },
        {
            title: 'Kompetensi',
            content:
                <CRow>
                    <CCol sm={12}>
                        <Form
                            form={form1}
                            name="dynamic_form_nest_item"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => onFinish(0, 4)}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <b>Hardskill dan Softskill yang ingin dikembangkan</b>
                            <Form.List name="skill"
                                initialValue={data && data.skills && data.skills.length > 0 && data.skills.map((item) => {
                                    return {
                                        skill_name: item.skill_name
                                    }
                                })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={22}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "skill_name"]}
                                                        fieldKey={[key, "skill_name"]}
                                                        rules={[{ required: true, message: 'Skill tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "35px" }}
                                                    >
                                                        <Input style={{ width: "104%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{color: "red"}} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Hardskill dan Softskill yang ingin dikembangkan
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>


                            <b>Bahasa Pemrograman</b>
                            <Form.List name="bahasaPemrograman"
                                initialValue={data && data.competencies && data.competencies.filter(item => item.competence_type === 1).length > 0 &&
                                    data.competencies.filter(item => item.competence_type === 1).map((item) => {
                                        return {
                                            id_competence: item.competence_id,
                                            id_knowledge: item.knowledge_id
                                        }
                                    })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={13}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_competence"]}
                                                        fieldKey={[key, "id_competence"]}
                                                        rules={[{ required: true, message: 'Bahasa pemrograman tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeKompetensi}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Bahasa Pemrograman")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Bahasa Pemrograman Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {kompetensi && kompetensi.filter(item => item.type === 1).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensi.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Pengetahuan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_knowledge"]}
                                                        fieldKey={[key, "id_knowledge"]}
                                                        rules={[{ required: true, message: 'Pengetahuan tidak boleh kosong!' }]}
                                                    >
                                                        <Select style={{ width: "100%" }}>
                                                            {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeKompetensi()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Bahasa Pemrograman
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Database</b>
                            <Form.List name="database"
                                initialValue={data && data.competencies && data.competencies.filter(item => item.competence_type === 2).length > 0 &&
                                    data.competencies.filter(item => item.competence_type === 2).map((item) => {
                                        return {
                                            id_competence: item.competence_id,
                                            id_knowledge: item.knowledge_id
                                        }
                                    })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={13}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_competence"]}
                                                        fieldKey={[key, "id_competence"]}
                                                        rules={[{ required: true, message: 'Database tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeKompetensi}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Database")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Database Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {kompetensi && kompetensi.filter(item => item.type === 2).map((item, i) =>
                                                                <Select.Option key={i} value={item.id} disabled={chooseKompetensi.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Pengetahuan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_knowledge"]}
                                                        fieldKey={[key, "id_knowledge"]}
                                                        rules={[{ required: true, message: 'Pengetahuan tidak boleh kosong!' }]}
                                                    >
                                                        <Select style={{ width: "100%" }}>
                                                            {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeKompetensi()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Database
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Framework</b>
                            <Form.List name="framework"
                                initialValue={data && data.competencies && data.competencies.filter(item => item.competence_type === 3).length > 0 &&
                                    data.competencies.filter(item => item.competence_type === 3).map((item) => {
                                        return {
                                            id_competence: item.competence_id,
                                            id_knowledge: item.knowledge_id
                                        }
                                    })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={13}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_competence"]}
                                                        fieldKey={[key, "id_competence"]}
                                                        rules={[{ required: true, message: 'Framework tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeKompetensi}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Frameworks")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Framework Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {kompetensi && kompetensi.filter(item => item.type === 3).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensi.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Pengetahuan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_knowledge"]}
                                                        fieldKey={[key, "id_knowledge"]}
                                                        rules={[{ required: true, message: 'Pengetahuan tidak boleh kosong!' }]}
                                                    >
                                                        <Select style={{ width: "100%" }}>
                                                            {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeKompetensi()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Framework
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Tools</b>
                            <Form.List name="tools"
                                initialValue={data && data.competencies && data.competencies.filter(item => item.competence_type === 4).length > 0 &&
                                    data.competencies.filter(item => item.competence_type === 4).map((item) => {
                                        return {
                                            id_competence: item.competence_id,
                                            id_knowledge: item.knowledge_id
                                        }
                                    })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={13}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_competence"]}
                                                        fieldKey={[key, "id_competence"]}
                                                        rules={[{ required: true, message: 'Tools tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeKompetensi}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Tools")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Tools Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {kompetensi && kompetensi.filter(item => item.type === 4).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensi.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Pengetahuan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_knowledge"]}
                                                        fieldKey={[key, "id_knowledge"]}
                                                        rules={[{ required: true, message: 'Pengetahuan tidak boleh kosong!' }]}
                                                    >
                                                        <Select style={{ width: "100%" }}>
                                                            {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeKompetensi()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Tools
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Modelling Tools</b>
                            <Form.List name="modelling Tools"
                                initialValue={data && data.competencies && data.competencies.filter(item => item.competence_type === 5).length > 0 &&
                                    data.competencies.filter(item => item.competence_type === 5).map((item) => {
                                        return {
                                            id_competence: item.competence_id,
                                            id_knowledge: item.knowledge_id
                                        }
                                    })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={13}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_competence"]}
                                                        fieldKey={[key, "id_competence"]}
                                                        rules={[{ required: true, message: 'Modelling tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeKompetensi}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Modelling Tools")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Modelling Tools Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {kompetensi && kompetensi.filter(item => item.type === 5).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensi.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Pengetahuan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_knowledge"]}
                                                        fieldKey={[key, "id_knowledge"]}
                                                        rules={[{ required: true, message: 'Pengetahuan tidak boleh kosong!' }]}
                                                    >
                                                        <Select style={{ width: "100%" }}>
                                                            {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeKompetensi()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Modelling Tools
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Bahasa Komunikasi</b>
                            <Form.List name="bahasaKomunikasi"
                                initialValue={data && data.competencies && data.competencies.filter(item => item.competence_type === 6).length > 0 &&
                                    data.competencies.filter(item => item.competence_type === 6).map((item) => {
                                        return {
                                            id_competence: item.competence_id,
                                            id_knowledge: item.knowledge_id
                                        }
                                    })}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} style={{ paddingTop: "10px" }}>
                                                <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                <Col span={13}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_competence"]}
                                                        fieldKey={[key, "id_competence"]}
                                                        rules={[{ required: true, message: 'Bahasa komunikasi tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "20px" }}
                                                    >
                                                        <Select
                                                            style={{ width: "100%" }}
                                                            onChange={onChangeKompetensi}
                                                            dropdownRender={menu => (
                                                                <>
                                                                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                        <Typography.Link onClick={() => showModalCreate("Bahasa Komunikasi")} style={{ whiteSpace: 'nowrap' }}>
                                                                            <PlusOutlined /> Tambah Bahasa Komunikasi Baru
                                                                        </Typography.Link>
                                                                    </Space>
                                                                    <Divider style={{ margin: '8px 0' }} />
                                                                    {menu}
                                                                </>
                                                            )}>
                                                            {kompetensi && kompetensi.filter(item => item.type === 6).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensi.includes(item.id)}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3} style={{ paddingTop: "5px" }}>
                                                    Pengetahuan<span style={{ color: "red" }}> *</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_knowledge"]}
                                                        fieldKey={[key, "id_knowledge"]}
                                                        rules={[{ required: true, message: 'Pengetahuan tidak boleh kosong!' }]}
                                                    >
                                                        <Select style={{ width: "100%" }}>
                                                            {pengetahuan.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => {
                                                        remove(name)
                                                        onChangeKompetensi()
                                                    }}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{color: "#40a9ff", borderColor: "#40a9ff"}}>
                                                + Bahasa Komunikasi
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form>
                    </CCol>
                </CRow>
        },
    ];

    return isSpinner ? (<Spin indicator={antIcon} />) : isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <Steps current={current} type="navigation" className="site-navigation-steps">
                {steps.map(item => (
                    <Step title={item.title} key={item.title} />
                ))}
            </Steps>
            <div className="steps-content" style={{ paddingTop: "20px" }}>
                <CCard className="mb-4">
                    <CCardBody>
                        {steps[current].content}
                        <div className="steps-action" align="right">
                            {current > 0 && (
                                <>
                                    <Button type="primary" style={{ margin: '0 8px' }}
                                        onClick={() => {
                                            setPrev(true)
                                            setSave(false)
                                            form1.submit()
                                        }}>
                                        Kembali
                                    </Button>
                                    <Button style={{ marginRight: '8px' }} loading={loadings[0]} type="primary"
                                        onClick={() => {
                                            setSave(true)
                                            form1.submit()
                                        }}>
                                        Simpan
                                    </Button>
                                </>
                            )}
                            {current < steps.length - 1 && (
                                <>
                                    {current === 0 && (
                                        <Button style={{ margin: '0 8px' }} loading={loadings[0]} type="primary"
                                            onClick={() => {
                                                setSave(true)
                                                form1.submit()
                                            }}>
                                            Simpan
                                        </Button>
                                    )}
                                    <Button type="primary"
                                        onClick={() => {
                                            setSave(false)
                                            form1.submit()
                                        }}>
                                        Lanjutkan
                                    </Button>
                                </>
                            )}
                        </div>
                    </CCardBody>
                </CCard>
            </div>

            {tipeKompetensi.map((item, i) => (
                <div key={i}>
                    <Modal title={`Tambah ${item.name}`}
                        visible={getCreateModal(item.name)}
                        onOk={form.submit}
                        onCancel={() => handleCancelCreate(item.name)}
                        width={600}
                        zIndex={9999999}
                        footer={[
                            <Button key="back" onClick={() => handleCancelCreate(item.name)}>
                                Batal
                            </Button>,
                            <Button loading={loadings[1]} key="submit" type="primary" onClick={form.submit}>
                                Simpan
                            </Button>
                        ]}>
                        <Form
                            form={form}
                            name="basic"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => handleOkCreate(item, 1)}
                            autoComplete="off"
                        >
                            <b>Nama {item.name}<span style={{ color: "red" }}> *</span></b>
                            <Form.Item
                                name={`name`}
                                rules={[{ required: true, message: `Nama ${item.name.toLowerCase()} tidak boleh kosong!` }]}
                            >
                                <Input onChange={e => setName(e.target.value)} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            ))}
        </>
    )
}

export default UpdateCV
