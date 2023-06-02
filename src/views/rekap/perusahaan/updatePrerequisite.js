import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
} from '@coreui/react';
import { Steps, Form, Input, Row, Col, Button, Select, notification, Spin, Space, Typography, Divider, Modal, Tabs } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { Step } = Steps;

const { Option } = Select;

const { TabPane } = Tabs;

const UpdatePrerequisite = () => {
    let history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState({});
    const [domisili, setDomisili] = useState([]);
    const [jobscope, setJobscope] = useState();
    const [kompetensi, setKompetensi] = useState();
    const [form1] = Form.useForm();
    const [name, setName] = useState("");
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [region, setRegion] = useState();
    const [isSpinner, setIsSpinner] = useState(true);
    const [chooseMinatD3, setChooseMinatD3] = useState([]);
    const [chooseMinatD4, setChooseMinatD4] = useState([]);
    const [chooseKompetensiD3, setChooseKompetensiD3] = useState([]);
    const [chooseKompetensiD4, setChooseKompetensiD4] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadings, setLoadings] = useState([]);
    const [value, setValue] = useState("");
    const [save, setSave] = useState(false);
    const [prev, setPrev] = useState(false);
    const [tipeKompetensi, setTipeKompetensi] = useState([])
    const [proyek, setProyek] = useState({});
    const [KP, setKP] = useState(0);
    const [PKL, setPKL] = useState(0);
    const [prodi, setProdi] = useState("0");
    axios.defaults.withCredentials = true;

    const enterLoading = index => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    }

    const onChangeProdi = (activeKey) => {
        setIsLoading(true)
        refreshData(activeKey)
    };

    const refreshData = (activeKey = "1") => {
        setProdi(activeKey)
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all/${activeKey}`).then(result => setKompetensi(result.data.data))
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/get-all/${activeKey}`).then(result => {
            setJobscope(result.data.data)
            setIsLoading(false)
        })
    }

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
        if (kompetensi === "Cakupan Pekerjaan") {
            await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/jobscope/create`, {
                name: name,
                prodi_id: prodi
            }).then((response) => {
                refreshData(prodi);
                notification.success({
                    message: 'Cakupan Pekerjaan berhasil dibuat'
                });
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                setName("");
                if (kompetensi === "Cakupan Pekerjaan") {
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
                if (kompetensi === "Cakupan Pekerjaan") {
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
                    message: 'Cakupan Pekerjaan gagal dibuat!'
                });
            });
        } else {
            await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/create`, {
                name: name,
                id_competencetype: data.id,
                prodi_id: prodi
            }).then((response) => {
                refreshData(prodi);
                notification.success({
                    message: 'Kompetensi berhasil dibuat'
                });
                setName("");
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                if (kompetensi === "Cakupan Pekerjaan") {
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
                if (kompetensi === "Cakupan Pekerjaan") {
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
                form.resetFields();
                setLoadings(prevLoadings => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
                notification.error({
                    message: 'Kompetensi gagal dibuat!'
                });
            });
        }
    };

    const handleCancelCreate = (kompetensi) => {
        if (kompetensi === "Cakupan Pekerjaan") {
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

    useEffect(() => {
        if (!id) {
            history.push("/");
        } else {
            const getDetail = async () => {
                let data = [];
                let kp = [];
                let pkl = [];
                axios.defaults.withCredentials = true;
                await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/${id}`)
                    .then(function (response) {
                        setData(response.data.data)
                        response.data.data.jobscopes_d3.map(item => {
                            return data.push(item.id_jobscope)
                        })
                        setChooseMinatD3(data);
                        data = [];
                        response.data.data.jobscopes_d4.map(item => {
                            return data.push(item.id_jobscope)
                        })
                        setChooseMinatD4(data);
                        data = [];
                        response.data.data.competencies_d3.map(item => {
                            return data.push(item.id_competence)
                        })
                        setChooseKompetensiD3(data)
                        data = [];
                        response.data.data.competencies_d4.map(item => {
                            return data.push(item.id_competence)
                        })
                        setChooseKompetensiD4(data)
                        if (response.data.data.project) {
                            if (response.data.data.project.split("|").length !== 0) {
                                response.data.data.project.split("|").map(item => {
                                    return item.split("**")[2] === "d3" ? kp.push({
                                        name: item.split("**")[0],
                                        kuota: item.split("**")[1]
                                    }) : pkl.push({
                                        name: item.split("**")[0],
                                        kuota: item.split("**")[1]
                                    })
                                })
                                setProyek({ d3: kp, d4: pkl })
                            } else {
                                response.data.data.project.split("**")[2] === "d3" ? kp.push({
                                    name: response.data.data.project.split("**")[0],
                                    kuota: response.data.data.project.split("**")[1]
                                }) : pkl.push({
                                    name: response.data.data.project.split("**")[0],
                                    kuota: response.data.data.project.split("**")[1]
                                })
                                setProyek({ d3: kp, d4: pkl })
                            }
                        }

                        if (response.data.data.region_id === 0) {
                            setRegion("Lain - lain")
                        } else {
                            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/domicile/${response.data.data.region_id}`)
                                .then(function (response) {
                                    setRegion(response.data.data)
                                })
                        }
                        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/competence/get-all-type`)
                            .then(result => {
                                data = result.data.data;
                                data.push({
                                    id: 0,
                                    name: "Cakupan Pekerjaan",
                                    description: "Cakupan Pekerjaan"
                                })
                                setTipeKompetensi(data)
                                setIsLoading(false)
                                setIsSpinner(false)
                            })
                        response.data.data.description && setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(response.data.data.description))));
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

    const next = () => {
        onChangeKompetensi()
        setIsSpinner(true)
        form1.validateFields()
        setCurrent(current + 1);
        setTimeout(() => setIsSpinner(false), 100)
        if (form1.getFieldValue('proyekKerjaPraktik')) {
            setKP(form1.getFieldValue('proyekKerjaPraktik').length)
        }
        if (form1.getFieldValue('proyekPraktikKerjaLapangan')) {
            setPKL(form1.getFieldValue('proyekPraktikKerjaLapangan').length)
        }
        if (form1.getFieldValue('proyekKerjaPraktik')) {
            if (form1.getFieldValue('proyekKerjaPraktik').length !== 0) {
                setIsLoading(true)
                refreshData("0")
                setProdi("0")
            } else {
                if (form1.getFieldValue('proyekPraktikKerjaLapangan')) {
                    if (form1.getFieldValue('proyekPraktikKerjaLapangan').length !== 0) {
                        setIsLoading(true)
                        refreshData("1")
                        setProdi("1")
                    }
                }
            }
        }else if (form1.getFieldValue('proyekKerjaPraktik')) {
            if (form1.getFieldValue('proyekPraktikKerjaLapangan')) {
                if (form1.getFieldValue('proyekPraktikKerjaLapangan').length !== 0) {
                    setIsLoading(true)
                    refreshData("1")
                    setProdi("1")
                }
            }
        }else{
            setIsLoading(true)
            refreshData("0")
            setProdi("0")
        }
        
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
                enterLoading(index)
                let competenciesD3 = [];
                let competenciesD4 = [];
                let cakupanPekerjaanD3 = [];
                let cakupanPekerjaanD4 = [];
                let facilitas = [];
                let arrayCakupan = [];
                let arrayCompetencies = [];
                let arrayFasilitas = [];
                let url;
                let proyekKP = [];
                let proyekPKL = [];
                let arrayProyekKP = [];
                let arrayProyekPKL = [];
                let total_d3 = 0;
                let total_d4 = 0;
                let arrayProyek = [];
                let proyek = "";
                let fas = "";
                let arrayComp = [];
                let arrayMinat = [];

                if (form1.getFieldValue('bahasaPemrogramanD3')) {
                    competenciesD3 = competenciesD3.concat(form1.getFieldValue('bahasaPemrogramanD3'));
                }
                if (form1.getFieldValue('databaseD3')) {
                    competenciesD3 = competenciesD3.concat(form1.getFieldValue('databaseD3'));
                }
                if (form1.getFieldValue('frameworkD3')) {
                    competenciesD3 = competenciesD3.concat(form1.getFieldValue('frameworkD3'));
                }
                if (form1.getFieldValue('modellingD3')) {
                    competenciesD3 = competenciesD3.concat(form1.getFieldValue('modellingD3'));
                }
                if (form1.getFieldValue('toolsD3')) {
                    competenciesD3 = competenciesD3.concat(form1.getFieldValue('toolsD3'));
                }
                if (form1.getFieldValue('bahasaKomunikasiD3')) {
                    competenciesD3 = competenciesD3.concat(form1.getFieldValue('bahasaKomunikasiD3'));
                }

                competenciesD3.map(item => {
                    return arrayCompetencies.push({
                        id: item.id_competence,
                        prodi_id: 0
                    })
                })

                if (form1.getFieldValue('bahasaPemrogramanD4')) {
                    competenciesD4 = competenciesD4.concat(form1.getFieldValue('bahasaPemrogramanD4'));
                }
                if (form1.getFieldValue('databaseD4')) {
                    competenciesD4 = competenciesD4.concat(form1.getFieldValue('databaseD4'));
                }
                if (form1.getFieldValue('frameworkD4')) {
                    competenciesD4 = competenciesD4.concat(form1.getFieldValue('frameworkD4'));
                }
                if (form1.getFieldValue('modellingD4')) {
                    competenciesD4 = competenciesD4.concat(form1.getFieldValue('modellingD4'));
                }
                if (form1.getFieldValue('toolsD4')) {
                    competenciesD4 = competenciesD4.concat(form1.getFieldValue('toolsD4'));
                }
                if (form1.getFieldValue('bahasaKomunikasiD4')) {
                    competenciesD4 = competenciesD4.concat(form1.getFieldValue('bahasaKomunikasiD4'));
                }

                competenciesD4.map(item => {
                    return arrayCompetencies.push({
                        id: item.id_competence,
                        prodi_id: 1
                    })
                })

                if (form1.getFieldValue('cakupanPekerjaanD3')) {
                    cakupanPekerjaanD3 = form1.getFieldValue('cakupanPekerjaanD3')
                }

                cakupanPekerjaanD3.map(item => {
                    return arrayCakupan.push({
                        id: item.id_jobscope,
                        prodi_id: 0
                    })
                })

                if (form1.getFieldValue('cakupanPekerjaanD4')) {
                    cakupanPekerjaanD4 = form1.getFieldValue('cakupanPekerjaanD4')
                }

                cakupanPekerjaanD4.map(item => {
                    return arrayCakupan.push({
                        id: item.id_jobscope,
                        prodi_id: 1
                    })
                })

                if (form1.getFieldValue('fasilitas')) {
                    facilitas = form1.getFieldValue('fasilitas')
                }
                if (form1.getFieldValue('proyekKerjaPraktik')) {
                    proyekKP = form1.getFieldValue('proyekKerjaPraktik')
                }
                if (form1.getFieldValue('proyekPraktikKerjaLapangan')) {
                    proyekPKL = form1.getFieldValue('proyekPraktikKerjaLapangan')
                }

                facilitas && facilitas.map(item => {
                    return arrayFasilitas.push(item.facility_name)
                })

                proyekKP && proyekKP.map(item => {
                    total_d3 = total_d3 + parseInt(item.kuota)
                    return arrayProyekKP.push(`${item.name}**${item.kuota}**d3`);
                })

                proyekPKL && proyekPKL.map(item => {
                    total_d4 = total_d4 + parseInt(item.kuota)
                    return arrayProyekPKL.push(`${item.name}**${item.kuota}**d4`);
                })

                arrayProyek = arrayProyekKP.concat(arrayProyekPKL)
                if (arrayProyek.length > 1) {
                    arrayProyek.map((item, index) => {
                        return proyek = index === arrayProyek.length - 1 ? proyek + item : proyek + item + "|"
                    })
                } else {
                    proyek = arrayProyek[0]
                }

                if (facilitas.length > 1) {
                    facilitas.map((item, index) => {
                        return fas = index === facilitas.length - 1 ? fas + item.facility_name : fas + item.facility_name + ","
                    })
                } else {
                    fas = facilitas.length === 1 ? facilitas[0].facility_name : ""
                }

                if (step === 0) {
                    data.jobscopes_d3.map(item => {
                        return arrayMinat.push({
                            id: item.id_jobscope,
                            prodi_id: 0
                        })
                    })

                    data.jobscopes_d4.map(item => {
                        return arrayMinat.push({
                            id: item.id_jobscope,
                            prodi_id: 1
                        })
                    })

                    data.competencies_d3.map(item => {
                        return arrayComp.push({
                            id: item.id_competence,
                            prodi_id: 0
                        })
                    })

                    data.competencies_d4.map(item => {
                        return arrayComp.push({
                            id: item.id_competence,
                            prodi_id: 1
                        })
                    })
                }

                if (step === 1) {
                    data.competencies_d3.map(item => {
                        return arrayComp.push({
                            id: item.id_competence,
                            prodi_id: 0
                        })
                    })

                    data.competencies_d4.map(item => {
                        return arrayComp.push({
                            id: item.id_competence,
                            prodi_id: 1
                        })
                    })
                }

                // console.log(step >= 1 ? arrayCakupan : arrayMinat === arrayCakupan ? arrayCakupan ? arrayCakupan : null : arrayMinat ? arrayMinat : null)
                // console.log(step >= 2 ? arrayCompetencies : arrayComp === arrayCompetencies ? arrayCompetencies ? arrayCompetencies : null : arrayMinat ? arrayMinat : null)

                // console.log(arrayCakupan)
                // console.log(arrayMinat)
                // console.log(proyek)
                // console.log(fas)
                // console.log(arrayProyekKP)
                // console.log(arrayProyekPKL)
                // console.log(total_d3)
                // console.log(total_d4)
                // console.log(parseInt(data.total_d3));
                // console.log(arrayFasilitas)
                // console.log(arrayCompetencies);
                // console.log(arrayCakupan);
                // console.log(DOMPurify.sanitize(convertedContent))
                if (localStorage.getItem("id_role") === "0") {
                    url = `${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/committee/${id}`;
                } else if (localStorage.getItem("id_role") === "2") {
                    url = `${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/company`
                }
                await axios.put(url, {
                    practical_address: data.practical_address,
                    in_advisor_name: data.in_advisor_name,
                    in_advisor_position: data.in_advisor_position,
                    in_advisor_mail: data.in_advisor_mail,
                    facility: fas,
                    project: proyek,
                    total_d3: parseInt(total_d3),
                    total_d4: parseInt(total_d4),
                    work_system: data.work_system,
                    description: DOMPurify.sanitize(convertedContent),
                    region_id: data.region_id,
                    jobscopes: step >= 1 ? arrayCakupan : arrayMinat === arrayCakupan ? arrayCakupan ? arrayCakupan : null : arrayMinat ? arrayMinat : null,
                    competencies: step >= 2 ? arrayCompetencies : arrayComp === arrayCompetencies ? arrayCompetencies ? arrayCompetencies : null : arrayComp ? arrayComp : null
                }).then((response) => {
                    if (localStorage.getItem("id_role") === "0") {
                        notification.success({
                            message: 'Prerequisite berhasil diubah'
                        });
                        history.push("/listPerusahaan");
                    } else if (localStorage.getItem("id_role") === "2") {
                        notification.success({
                            message: 'Prerequisite berhasil diubah'
                        });
                        setLoadings(prevLoadings => {
                            const newLoadings = [...prevLoadings];
                            newLoadings[index] = false;
                            return newLoadings;
                        });
                        history.push("/formulirKesediaan");
                    }
                }).catch((error) => {
                    setLoadings(prevLoadings => {
                        const newLoadings = [...prevLoadings];
                        newLoadings[index] = false;
                        return newLoadings;
                    });
                    notification.error({
                        message: 'Prerequisite gagal diubah!'
                    });
                });
            } else {
                next()
            }
        }
    };

    const onChangeKompetensi = () => {
        let data = [];
        if (prodi === "0") {
            form1.getFieldValue('bahasaPemrogramanD3') && form1.getFieldValue('bahasaPemrogramanD3').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('databaseD3') && form1.getFieldValue('databaseD3').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('frameworkD3') && form1.getFieldValue('frameworkD3').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('modellingD3') && form1.getFieldValue('modellingD3').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('toolsD3') && form1.getFieldValue('toolsD3').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('bahasaKomunikasiD3') && form1.getFieldValue('bahasaKomunikasiD3').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('bahasaPemrogramanD3') && setChooseKompetensiD3(data);
            form1.getFieldValue('databaseD3') && setChooseKompetensiD3(data);
            form1.getFieldValue('frameworkD3') && setChooseKompetensiD3(data);
            form1.getFieldValue('modellingD3') && setChooseKompetensiD3(data);
            form1.getFieldValue('toolsD3') && setChooseKompetensiD3(data);
            form1.getFieldValue('bahasaKomunikasiD3') && setChooseKompetensiD3(data);
        }

        if (prodi === "1") {
            form1.getFieldValue('bahasaPemrogramanD4') && form1.getFieldValue('bahasaPemrogramanD4').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('databaseD4') && form1.getFieldValue('databaseD4').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('frameworkD4') && form1.getFieldValue('frameworkD4').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('modellingD4') && form1.getFieldValue('modellingD4').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('toolsD4') && form1.getFieldValue('toolsD4').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('bahasaKomunikasiD4') && form1.getFieldValue('bahasaKomunikasiD4').map(item => {
                return item && data.push(item.id_competence)
            })
            form1.getFieldValue('bahasaPemrogramanD4') && setChooseKompetensiD4(data);
            form1.getFieldValue('databaseD4') && setChooseKompetensiD4(data);
            form1.getFieldValue('frameworkD4') && setChooseKompetensiD4(data);
            form1.getFieldValue('modellingD4') && setChooseKompetensiD4(data);
            form1.getFieldValue('toolsD4') && setChooseKompetensiD4(data);
            form1.getFieldValue('bahasaKomunikasiD4') && setChooseKompetensiD4(data);
        }

    }

    const onChangeMinat = () => {
        let data = [];
        if (prodi === "0") {
            if (form1.getFieldValue('cakupanPekerjaanD3')) {
                form1.getFieldValue('cakupanPekerjaanD3') !== undefined && form1.getFieldValue('cakupanPekerjaanD3').map(item => {
                    return data.push(item.id_jobscope)
                })
                setChooseMinatD3(data)
            }
        }
        if (prodi === "1") {
            if (form1.getFieldValue('cakupanPekerjaanD4')) {
                form1.getFieldValue('cakupanPekerjaanD4') !== undefined && form1.getFieldValue('cakupanPekerjaanD4').map(item => {
                    return data.push(item.id_jobscope)
                })
                setChooseMinatD4(data)
            }
        }
    }

    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Harap isi semua inputan wajib!',
        });
    };

    const getDomisili = async (val) => {
        axios.defaults.withCredentials = true;
        await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/domicile?domicile-like=${val}`)
            .then(function (response) {
                setDomisili(response.data.data.concat({ id: 0, region_name: "Lain - lain" }))
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

    function onChangeDomisili(value) {
        setData(pre => {
            return { ...pre, region_id: value }
        })
        setRegion(value);
    }

    function onChangeWorkSystem(value) {
        setData(pre => {
            return { ...pre, work_system: value }
        })
    }

    const steps = [
        {
            title: 'Identitas',
            content:
                <CRow>
                    <CCol sm={12}>
                        <Form
                            form={form1}
                            name="dynamic_form_nest_item"
                            wrapperCol={{ span: 24 }}
                            onFinish={() => onFinish(0, 0)}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            fields={[
                                {
                                    name: ["namePembimbing"],
                                    value: data.in_advisor_name && data.in_advisor_name
                                },
                                {
                                    name: ["emailPembimbing"],
                                    value: data.in_advisor_mail && data.in_advisor_mail
                                },
                                {
                                    name: ["jabatanPembimbing"],
                                    value: data.in_advisor_position && data.in_advisor_position
                                },
                                {
                                    name: ["domisili"],
                                    value: region && region
                                },
                                {
                                    name: ["address"],
                                    value: data.practical_address && data.practical_address
                                },
                                {
                                    name: ["sistemKerja"],
                                    value: data.work_system && data.work_system
                                },
                                {
                                    name: ["jmlD3"],
                                    value: data.total_d3 && data.total_d3
                                },
                                {
                                    name: ["jmlD4"],
                                    value: data.total_d4 && data.total_d4
                                }
                            ]}
                        >
                            <b>Nama Pembimbing Industri<span style={{ color: "red" }}> *</span></b>
                            <Form.Item
                                name="namePembimbing"
                                rules={[{ required: true, message: 'Nama pembimbing tidak boleh kosong!' }]}
                            >
                                <Input
                                    onChange={e => {
                                        setData(pre => {
                                            return { ...pre, in_advisor_name: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Row>
                                <Col span={12} style={{ paddingRight: "20px" }}>
                                    <b>Email Pembimbing Industri<span style={{ color: "red" }}> *</span></b>
                                    <Form.Item
                                        name="emailPembimbing"
                                        rules={[{ required: true, message: 'Email pembimbing tidak boleh kosong!' },
                                        { type: "email", message: 'Format email salah!' }]}
                                    >
                                        <Input
                                            placeholder='ex: foo@gmail.com'
                                            onChange={e => {
                                                setData(pre => {
                                                    return { ...pre, in_advisor_mail: e.target.value }
                                                })
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <b>Jabatan Pembimbing Industri<span style={{ color: "red" }}> *</span></b>
                                    <Form.Item
                                        name="jabatanPembimbing"
                                        rules={[{ required: true, message: 'Jabatan pembimbing tidak boleh kosong!' }]}
                                    >
                                        <Input
                                            onChange={e => {
                                                setData(pre => {
                                                    return { ...pre, in_advisor_position: e.target.value }
                                                })
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12} style={{ paddingRight: "20px" }}>
                                    <b>Domisili<span style={{ color: "red" }}> *</span></b>
                                    <Form.Item
                                        name="domisili"
                                        rules={[{ required: true, message: 'Domisili tidak boleh kosong!' }]}
                                    >
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            notFoundContent={value.length >= 3 ? <Spin size="small" /> : <>Ketikkan minimal 3 huruf untuk mencari domisili<br />Jika domisili tidak ada di pencarian maka pilih Lain - lain</>}
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
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <b>Sistem Kerja<span style={{ color: "red" }}> *</span></b>
                                    <Form.Item
                                        name="sistemKerja"
                                        rules={[{ required: true, message: 'Sistem kerja tidak boleh kosong!' }]}
                                    >
                                        <Select style={{ width: "100%" }} onChange={onChangeWorkSystem}>
                                            <Option value="WFH">WFH</Option>
                                            <Option value="WFO">WFO</Option>
                                            <Option value="WFH & WFO">WFH & WFO</Option>
                                        </Select>
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
                                            return { ...pre, practical_address: e.target.value }
                                        })
                                    }}
                                />
                            </Form.Item>

                            <b>Proyek Kerja Praktik</b>
                            <hr></hr>

                            <Form.List name="proyekKerjaPraktik"
                                initialValue={proyek.d3 && proyek.d3.map((item) => {
                                    return {
                                        name: item.name,
                                        kuota: item.kuota,
                                    }
                                })}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key}>
                                                <Col span={23}>
                                                    <Row>
                                                        <Col span={12} style={{ paddingRight: "20px" }}>
                                                            <b>Nama Produk / Proyek<span style={{ color: "red" }}> *</span></b>
                                                            <Form.Item
                                                                name={[name, "name"]}
                                                                fieldKey={[key, "name"]}
                                                                rules={[{ required: true, message: 'Nama proyek tidak boleh kosong!' }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <b>Jumlah Kuota Mahasiswa<span style={{ color: "red" }}> *</span></b>
                                                            <Form.Item
                                                                name={[name, "kuota"]}
                                                                fieldKey={[key, "kuota"]}
                                                                rules={[{ required: true, message: 'Jumlah kuota tidak boleh kosong!' },
                                                                { message: 'Format jumlah kuota mahasiswa hanya angka!', pattern: /^\d+$/ },
                                                                { message: 'Minimal jumlah kuota adalah 1!', pattern: /\b^([A-Za-z-9]+|[1-9][0-9]*)\b/ }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "25px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item style={{ paddingTop: "10px" }}>
                                            <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                + Proyek
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Proyek Praktik Kerja Lapangan</b>
                            <hr></hr>

                            <Form.List name="proyekPraktikKerjaLapangan"
                                initialValue={proyek.d4 && proyek.d4.map((item) => {
                                    return {
                                        name: item.name,
                                        kuota: item.kuota,
                                    }
                                })}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key}>
                                                <Col span={23}>
                                                    <Row>
                                                        <Col span={12} style={{ paddingRight: "20px" }}>
                                                            <b>Nama Produk / Proyek<span style={{ color: "red" }}> *</span></b>
                                                            <Form.Item
                                                                name={[name, "name"]}
                                                                fieldKey={[key, "name"]}
                                                                rules={[{ required: true, message: 'Nama proyek tidak boleh kosong!' }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <b>Jumlah Kuota Mahasiswa<span style={{ color: "red" }}> *</span></b>
                                                            <Form.Item
                                                                name={[name, "kuota"]}
                                                                fieldKey={[key, "kuota"]}
                                                                rules={[{ required: true, message: 'Jumlah kuota tidak boleh kosong!' },
                                                                { message: 'Minimal jumlah kuota adalah 1!', pattern: /\b^([A-Za-z-9]+|[1-9][0-9]*)\b/ }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "25px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item style={{ paddingTop: "10px" }}>
                                            <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                + Proyek
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Fasilitas</b>
                            <Form.List name="fasilitas"
                                initialValue={data && data.facility && data.facility.split(",").filter((item) => item !== "").map((item) => {
                                    return {
                                        facility_name: item
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
                                                        name={[name, "facility_name"]}
                                                        fieldKey={[key, "facility_name"]}
                                                        rules={[{ required: true, message: 'Fasilitas tidak boleh kosong!' }]}
                                                        style={{ paddingRight: "35px" }}
                                                    >
                                                        <Input style={{ width: "104%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={1} align="center" style={{ paddingTop: "5px", maxWidth: "2%", paddingLeft: "30px" }}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                + Fasilitas
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <b>Keterangan</b>
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
                        </Form>
                    </CCol>
                </CRow>
        },
        {
            title: 'Cakupan Pekerjaan',
            content:
                <Tabs type="card" onChange={onChangeProdi} defaultActiveKey={prodi}>
                    <TabPane tab={"Kerja Praktik"} key={"0"} disabled={KP === 0}>
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
                                    <b>Cakupan Pekerjaan</b>
                                    <Form.List name="cakupanPekerjaanD3"
                                        initialValue={data && data.jobscopes_d3 && data.jobscopes_d3.length > 0 && data.jobscopes_d3.map((item) => {
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
                                                                rules={[{ required: true, message: 'Cakupan pekerjaan tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
                                                                    onChange={onChangeMinat}
                                                                    dropdownRender={menu => (
                                                                        <>
                                                                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                                <Typography.Link onClick={() => showModalCreate("Cakupan Pekerjaan")} style={{ whiteSpace: 'nowrap' }}>
                                                                                    <PlusOutlined /> Tambah Cakupan Pekerjaan Baru
                                                                                </Typography.Link>
                                                                            </Space>
                                                                            <Divider style={{ margin: '8px 0' }} />
                                                                            {menu}
                                                                        </>
                                                                    )}>
                                                                    {jobscope && jobscope.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseMinatD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Cakupan Pekerjaan
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Form>
                            </CCol>
                        </CRow>
                    </TabPane>
                    <TabPane tab={"Praktik Kerja Lapangan"} key={"1"} disabled={PKL === 0}>
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
                                    <b>Cakupan Pekerjaan</b>
                                    <Form.List name="cakupanPekerjaanD4"
                                        initialValue={data && data.jobscopes_d4 && data.jobscopes_d4.length > 0 && data.jobscopes_d4.map((item) => {
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
                                                                rules={[{ required: true, message: 'Cakupan pekerjaan tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
                                                                    onChange={onChangeMinat}
                                                                    dropdownRender={menu => (
                                                                        <>
                                                                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                                <Typography.Link onClick={() => showModalCreate("Cakupan Pekerjaan")} style={{ whiteSpace: 'nowrap' }}>
                                                                                    <PlusOutlined /> Tambah Cakupan Pekerjaan Baru
                                                                                </Typography.Link>
                                                                            </Space>
                                                                            <Divider style={{ margin: '8px 0' }} />
                                                                            {menu}
                                                                        </>
                                                                    )}>
                                                                    {jobscope && jobscope.map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseMinatD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Cakupan Pekerjaan
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Form>
                            </CCol>
                        </CRow>
                    </TabPane>
                </Tabs>
        },
        {
            title: 'Kompetensi',
            content:
                <Tabs type="card" onChange={onChangeProdi} defaultActiveKey={prodi}>
                    <TabPane tab={"Kerja Praktik"} key={"0"} disabled={KP === 0}>
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
                                    <b>Bahasa Pemrograman</b>
                                    <Form.List name="bahasaPemrogramanD3"
                                        initialValue={data && data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 1).length > 0 &&
                                            data.competencies_d3.filter(item => item.competence_type === 1).map((item) => {
                                                return {
                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Bahasa pemrograman tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 1).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Bahasa Pemrograman
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Database</b>
                                    <Form.List name="databaseD3"
                                        initialValue={data && data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 2).length > 0 &&
                                            data.competencies_d3.filter(item => item.competence_type === 2).map((item) => {
                                                return {
                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Database tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 2).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Database
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Framework</b>
                                    <Form.List name="frameworkD3"
                                        initialValue={data && data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 3).length > 0 &&
                                            data.competencies_d3.filter(item => item.competence_type === 3).map((item) => {
                                                return {
                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Framework tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "100%" }}
                                                                    onChange={onChangeKompetensi}
                                                                    dropdownRender={menu => (
                                                                        <>
                                                                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                                <Typography.Link onClick={() => showModalCreate("Frameworks")} style={{ whiteSpace: 'nowrap' }}>
                                                                                    <PlusOutlined /> Tambah Frameworks Baru
                                                                                </Typography.Link>
                                                                            </Space>
                                                                            <Divider style={{ margin: '8px 0' }} />
                                                                            {menu}
                                                                        </>
                                                                    )}>
                                                                    {kompetensi && kompetensi.filter(item => item.type === 3).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Framework
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Tools</b>
                                    <Form.List name="toolsD3"
                                        initialValue={data && data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 4).length > 0 &&
                                            data.competencies_d3.filter(item => item.competence_type === 4).map((item) => {
                                                return {

                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Tools tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 4).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Tools
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Modelling Tools</b>
                                    <Form.List name="modellingD3"
                                        initialValue={data && data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 5).length > 0 &&
                                            data.competencies_d3.filter(item => item.competence_type === 5).map((item) => {
                                                return {

                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Modelling tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 5).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Modelling Tools
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Bahasa Komunikasi</b>
                                    <Form.List name="bahasaKomunikasiD3"
                                        initialValue={data && data.competencies_d3 && data.competencies_d3.filter(item => item.competence_type === 6).length > 0 &&
                                            data.competencies_d3.filter(item => item.competence_type === 6).map((item) => {
                                                return {

                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Bahasa komunikasi tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 6).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD3.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Bahasa Komunikasi
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Form>
                            </CCol>
                        </CRow>
                    </TabPane>
                    <TabPane tab={"Praktik Kerja Lapangan"} key={"1"} disabled={PKL === 0}>
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
                                    <b>Bahasa Pemrograman</b>
                                    <Form.List name="bahasaPemrogramanD4"
                                        initialValue={data && data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 1).length > 0 &&
                                            data.competencies_d4.filter(item => item.competence_type === 1).map((item) => {
                                                return {
                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Bahasa pemrograman tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 1).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Bahasa Pemrograman
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Database</b>
                                    <Form.List name="databaseD4"
                                        initialValue={data && data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 2).length > 0 &&
                                            data.competencies_d4.filter(item => item.competence_type === 2).map((item) => {
                                                return {
                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Database tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 2).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Database
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Framework</b>
                                    <Form.List name="frameworkD4"
                                        initialValue={data && data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 3).length > 0 &&
                                            data.competencies_d4.filter(item => item.competence_type === 3).map((item) => {
                                                return {
                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Framework tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "100%" }}
                                                                    onChange={onChangeKompetensi}
                                                                    dropdownRender={menu => (
                                                                        <>
                                                                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                                                                                <Typography.Link onClick={() => showModalCreate("Frameworks")} style={{ whiteSpace: 'nowrap' }}>
                                                                                    <PlusOutlined /> Tambah Frameworks Baru
                                                                                </Typography.Link>
                                                                            </Space>
                                                                            <Divider style={{ margin: '8px 0' }} />
                                                                            {menu}
                                                                        </>
                                                                    )}>
                                                                    {kompetensi && kompetensi.filter(item => item.type === 3).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Framework
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Tools</b>
                                    <Form.List name="toolsD4"
                                        initialValue={data && data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 4).length > 0 &&
                                            data.competencies_d4.filter(item => item.competence_type === 4).map((item) => {
                                                return {

                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Tools tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 4).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Tools
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Modelling Tools</b>
                                    <Form.List name="modellingD4"
                                        initialValue={data && data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 5).length > 0 &&
                                            data.competencies_d4.filter(item => item.competence_type === 5).map((item) => {
                                                return {

                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Modelling tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 5).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Modelling Tools
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <b>Bahasa Komunikasi</b>
                                    <Form.List name="bahasaKomunikasiD4"
                                        initialValue={data && data.competencies_d4 && data.competencies_d4.filter(item => item.competence_type === 6).length > 0 &&
                                            data.competencies_d4.filter(item => item.competence_type === 6).map((item) => {
                                                return {

                                                    id_competence: item.id_competence
                                                }
                                            })}
                                    >
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row key={key} style={{ paddingTop: "10px" }}>
                                                        <Col span={1} style={{ maxWidth: "2%" }}><span style={{ color: "red" }}> *</span></Col>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "id_competence"]}
                                                                fieldKey={[key, "id_competence"]}
                                                                rules={[{ required: true, message: 'Bahasa komunikasi tidak boleh kosong!' }]}
                                                                style={{ paddingRight: "35px" }}
                                                            >
                                                                <Select
                                                                    style={{ width: "104%" }}
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
                                                                    {kompetensi && kompetensi.filter(item => item.type === 6).map((item, i) => <Select.Option key={i} value={item.id} disabled={chooseKompetensiD4.includes(item.id)}>{item.name}</Select.Option>)}
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
                                                    <Button type="dashed" onClick={() => add()} block style={{ color: "#40a9ff", borderColor: "#40a9ff" }}>
                                                        + Bahasa Komunikasi
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Form>
                            </CCol>
                        </CRow>
                    </TabPane>
                </Tabs>
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

export default UpdatePrerequisite
