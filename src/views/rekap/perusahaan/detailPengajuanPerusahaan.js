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
import { Button, Row, Col, Checkbox, Table, Modal, notification, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const DetailPengajuanPerusahaan = () => {
    let history = useHistory();
    const { id } = useParams();
    const [data, setData] = useState({});
    const [criteria, setCriteria] = useState([]);
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

    useEffect(() => {
        if (!id) {
            history.push("/");
        } else {
            const getDetail = async () => {
                axios.defaults.withCredentials = true;
                await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/submission/detail/${id}`)
                    .then(function (response1) {
                        setData(response1.data.data)
                        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/criteria`)
                            .then(function (response2) {
                                setCriteria(response2.data.data)
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
    const columnsTeknologi = [
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
            title: 'Nama Produk/Proyek',
            dataIndex: 'name',
            width: '20%',
        },
        {
            title: 'Keterangan',
            dataIndex: 'description',
        }
    ]

    const columnsKeunggulan = [
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
            title: 'Keterangan',
            dataIndex: 'keterangan',
            render: (value, item, index) => {
                return item
            }
        }
    ]

    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    const showModalAccept = (index) => {
        Modal.confirm({
            title: "Konfirmasi Terima Pengajuan",
            okText: "Ya",
            onOk: () => {
                handleOkAccept(index)
            }
        })
    };

    const showModalDelete = (index) => {
        Modal.confirm({
            title: "Konfirmasi Tolak Pengajuan",
            okText: "Ya",
            onOk: () => {
                handleOkDelete(index)
            }
        })
    };

    const handleOkAccept = async (index) => {
        enterLoading(index)
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}company/submission/accept/${id}`, {
        }).then((response) => {
            notification.success({
                message: 'Data pengajuan berhasil diterima'
            });
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            Modal.info({
                title: `Data perusahaan dan akun perusahaan berhasil dibuat`,
                content: (
                    <>
                        Berikut merupakan username dan password dari akun perusahaan yang telah dibuat<br />
                        Username : {data.company_mail}<br />
                        Password : 1234
                    </>
                ),
                okText: "Ok",
                cancelText: "Close",
                onOk: () => {
                    history.push("/pengajuanPerusahaan")
                },
                onCancel: () => {
                    history.push("/pengajuanPerusahaan")
                },
            })

        }).catch((error) => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            if (error.response.data.message.search("Username already taken") === -1) {
                notification.error({
                    message: 'Data pengajuan gagal diterima!'
                });
            } else {
                notification.error({
                    message: 'Email perusahaan sudah ada!'
                });
            }
        });
    };

    const handleOkDelete = async (index) => {
        enterLoading(index)
        await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}company/submission/decline/${id}`, {
        }).then((response) => {
            notification.success({
                message: 'Data pengajuan berhasil ditolak'
            });
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            history.push("/pengajuanPerusahaan")
        }).catch((error) => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
            notification.error({
                message: 'Data pengajuan gagal ditolak!'
            });
        });
    };

    return isLoading ? (<Spin indicator={antIcon} />) : (
        <>
            <CRow>
                <CCol style={{ textAlign: "right", paddingBottom: "15px" }}>
                    <Button
                        id="accept"
                        shape="round"
                        loading={loadings[0]}
                        style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white" }}
                        onClick={() => showModalAccept(0)}
                    >
                        Terima Pengajuan
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                        id="decline"
                        shape="round"
                        loading={loadings[1]}
                        style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white" }}
                        onClick={() => showModalDelete(1)}
                    >
                        Tolak Pengajuan
                    </Button>
                </CCol>
            </CRow>
            <CCard className="mb-4">
                <CCardHeader style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                    <CRow>
                        <CCol><h5><b>Profil Perusahaan {data.company_name}</b></h5></CCol>
                        <CCol style={{ textAlign: "right" }}><h5><b>{data && data.prodi}</b></h5></CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody style={{ paddingLeft: "20px" }}>
                    <CRow>
                        <CCol sm={6}>
                            <CRow><CCol sm={12}><b>Nama Pengusul</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.proposer ? (
                                <>
                                    {data.proposer.map((item, index) => {
                                        return <div key={index}>{index + 1}. {item}</div>
                                    })}
                                </>
                            ) : "Tidak ada Pengusul"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Website Official Perusahaan</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.website ? data.website : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Email Official Perusahaan</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.company_mail ? data.company_mail : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Nomor Telepon Perusahaan</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.no_phone ? data.no_phone : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Alamat</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.address ? data.address : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Berdiri Tahun</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.since_year ? data.since_year : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jumlah Karyawan</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.num_employee ? data.num_employee : "Data belum diisi"}</CCol></CRow>
                        </CCol>
                        <CCol sm={6}>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Nama Narahubung</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.cp_name ? data.cp_name : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Email Narahubung</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.cp_mail ? data.cp_mail : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Nomor Telepon Narahubung</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.cp_phone ? data.cp_phone : "Data belum diisi"}</CCol></CRow>
                            <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jabatan Narahubung</b></CCol></CRow>
                            <CRow><CCol sm={12}>{data && data.cp_position ? data.cp_position : "Data belum diisi"}</CCol></CRow>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol sm={12} style={{ paddingTop: "10px" }}>
                            <div style={{ paddingBottom: "10px" }}><b>Penerapan Teknologi</b></div>
                            <Table
                                scroll={{ x: "max-content" }}
                                columns={columnsTeknologi}
                                dataSource={data && data.projects ? data.projects : ""}
                                pagination={false}
                                rowKey="id"
                                bordered />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol sm={12} style={{ paddingTop: "10px" }}>
                            <div style={{ paddingBottom: "10px" }}><b>Keunggulan Perusahaan</b></div>
                            <Table
                                scroll={{ x: "max-content" }}
                                columns={columnsKeunggulan}
                                dataSource={data && data.advantages ? data.advantages : ""}
                                pagination={false}
                                rowKey="id"
                                bordered />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol sm={12} style={{ paddingTop: "10px" }}>
                            <div style={{ paddingBottom: "10px" }}><b>Mekanisme Penerimaan KP/PKL di Perusahaan</b></div>
                            <CCard>
                                <CCardBody>
                                    {data && data.recept_mechanism ? <div className="preview" dangerouslySetInnerHTML={createMarkup(data.recept_mechanism)}></div> : "Data belum diisi"}
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol sm={12} style={{ paddingTop: "10px" }}>
                            <div style={{ paddingBottom: "10px" }}><b>Kriteria Perusahaan</b></div>
                            <CCard>
                                <CCardBody>
                                    <Row>
                                        {criteria && criteria.map((item, i) => {
                                            return <Col span={24} key={i}>
                                                <Checkbox checked={data && data.criteria && data.criteria.find(data => data === item.criteriaName) ? true : false} disabled style={{ lineHeight: '32px' }}>
                                                    {item.criteriaName}
                                                </Checkbox>
                                            </Col>
                                        })}
                                    </Row>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default DetailPengajuanPerusahaan
