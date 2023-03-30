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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencil
} from '@fortawesome/free-solid-svg-icons'
import { Button, notification, Spin, Row, Col, Alert, Modal } from 'antd';

import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const IdentitasPerusahaan = () => {
  let history = useHistory()
  const { id } = useParams()
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([])
  const [statusMapping, setStatusMapping] = useState()
  axios.defaults.withCredentials = true;

  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  const updatePerusahaan = () => {
    if (localStorage.getItem("id_role") === "0") {
      history.push(`/listPerusahaan/detailPerusahaan/updatePerusahaan/${id}`);
    } else if (localStorage.getItem("id_role") === "2") {
      history.push(`/profilPerusahaan/updatePerusahaan/${data.id_company}`);
    }
  }

  const refreshData = async (index) => {
    await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/${id}`)
      .then(function (response) {
        setData(response.data.data)
        response.data.data.lecturer_id !== null && axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-committee?id=${response.data.data.lecturer_id}`)
          .then(function (resp) {
            resp.data.data ?
              setData(pre => {
                return { ...pre, lecturer_id: resp.data.data.name }
              })
              : console.log("panitia tidak ada")
            setLoadings(prevLoadings => {
              const newLoadings = [...prevLoadings];
              newLoadings[index] = false;
              return newLoadings;
            });
          })
      })
  }

  const updateStatus = (status, index) => {
    if (status) {
      Modal.confirm({
        title: "Tindakan ini akan memengaruhi data KP dan PKL!",
        content: "Apakah perusahaan sudah dipastikan tidak menerima KP dan PKL?",
        okText: "Ya",
        onOk: () => {
          updateStatusPerusahaan(index)
        }
      })
    } else {
      updateStatusPerusahaan(index)
    }
  }

  const updateStatusPerusahaan = async (index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}company/change-status/${id}`)
      .then(function (resp) {
        refreshData(index)
        notification.success({
          message: !data.status ? 'Perusahaan berhasil diaktifkan' : 'Perusahaan berhasil dinonaktifkan'
        });
      })
      .catch(function (error) {
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        notification.error({
          message: 'Status perusahaan gagal diubah'
        });
      });
  }

  useEffect(() => {
    const getDetail = async () => {
      let url;
      let idMapping;
      if (localStorage.getItem("id_role") === "0" || localStorage.getItem("id_role") === "3") {
        url = `${process.env.REACT_APP_API_GATEWAY_URL}company/${id}`;
      } else if (localStorage.getItem("id_role") === "2") {
        url = `${process.env.REACT_APP_API_GATEWAY_URL}company/get-by-company`;
      }
      axios.defaults.withCredentials = true;
      await axios.get(url)
        .then(function (response) {
          setData(response.data.data)
          response.data.data.lecturer_id !== null && axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-committee?id=${response.data.data.lecturer_id}`)
            .then(function (resp) {
              resp.data.data ?
                setData(pre => {
                  return { ...pre, lecturer_id: resp.data.data.name }
                })
                : console.log("panitia tidak ada")
            })
          if (localStorage.getItem("id_role") !== "2") {
            if (localStorage.getItem("id_prodi") === "0") {
              idMapping = 1
            } else if (localStorage.getItem("id_prodi") === "1") {
              idMapping = 2
            }
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/get-is-final/${idMapping}`)
              .then(function (response) {
                setStatusMapping(response.data.data)
                setIsLoading(false)
              })
          } else {
            setIsLoading(false)
          }
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
  }, [history, id]);
  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      {data ? (
        <>
          {localStorage.getItem("id_role") === "2" ? (
            <CRow>
              <CCol style={{ textAlign: "right", paddingBottom: "15px" }}>
                <Button
                  id="update"
                  shape="round"
                  style={{ color: "black", background: "#FCEE21" }}
                  onClick={updatePerusahaan}
                >
                  <FontAwesomeIcon icon={faPencil} style={{ paddingRight: "5px" }} /> Ubah Data Perusahaan
                </Button>
              </CCol>
            </CRow>
          ) : localStorage.getItem("id_role") === "0" ? (
            <>
              {statusMapping === 1 && (
                <div style={{ paddingBottom: "20px" }}>
                  <Alert
                    message="Catatan"
                    description="Status perusahaan tidak dapat diubah karena pemetaan sudah dilakukan."
                    type="info"
                    showIcon
                    closable />
                </div>
              )}
              <Row justify="end">
                <Col style={{ textAlign: "center", paddingBottom: "15px", paddingRight: "15px" }}>
                  <Button
                    id="update"
                    shape="round"
                    disabled={statusMapping === 1}
                    loading={loadings[0]}
                    style={!data.status ? { backgroundColor: "#339900", borderColor: "#339900", color: "white" } : { backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white" }}
                    onClick={() => updateStatus(data.status, 0)}
                  >
                    {!data.status ? "Aktifkan Perusahaan" : "Nonaktifkan Perusahaan"}
                  </Button></Col>
                <Col style={{ textAlign: "center", paddingBottom: "15px" }}>
                  <Button
                    id="update"
                    shape="round"
                    style={{ color: "black", background: "#FCEE21" }}
                    onClick={updatePerusahaan}
                  >
                    <FontAwesomeIcon icon={faPencil} style={{ paddingRight: "5px" }} /> Ubah Data Perusahaan
                  </Button>
                </Col>
              </Row>
            </>) : ""}
          <CCard className="mb-4">
            <CCardHeader style={{ paddingLeft: "20px" }}>
              <h5><b>Profil Perusahaan {data.company_name ? data.company_name : "Belum diisi"}</b></h5>
            </CCardHeader>
            <CCardBody style={{ paddingLeft: "20px" }}>
              <CRow>
                <CCol sm={6}>
                  <CRow><CCol sm={12}><b>Nama Pengusul</b></CCol></CRow>
                  {data.proposer ? data.proposer ? (
                    <>
                      {data.proposer.map((item, i) => (
                        <>
                          <CRow><CCol sm={12}>{i + 1}. {item}</CCol></CRow>
                        </>
                      ))}
                    </>
                  ) : "Pengusul Tidak Ada" : "Pengusul Tidak Ada"}
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Website Official Perusahaan</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.website ? data.website : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Email Official Perusahaan</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.company_email ? data.company_email : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Nomor Telepon Perusahaan</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.telp ? data.telp : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Alamat</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.address ? data.address : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Berdiri Tahun</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.since_years ? data.since_years : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jumlah Karyawan</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.num_employee ? data.num_employee : "Belum diisi"}</CCol></CRow>
                </CCol>
                <CCol sm={6}>
                  <CRow><CCol sm={12}><b>PIC (Panitia)</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.lecturer_id ? data.lecturer_id : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Nama Narahubung</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.cp_name ? data.cp_name : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Email Narahubung</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.cp_email ? data.cp_email : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Nomor Telepon Narahubung</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.cp_telp ? data.cp_telp : "Belum diisi"}</CCol></CRow>
                  <CRow><CCol sm={12} style={{ paddingTop: "10px" }}><b>Jabatan Narahubung</b></CCol></CRow>
                  <CRow><CCol sm={12}>{data.cp_position ? data.cp_position : "Belum diisi"}</CCol></CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </>
      ) : "data tidak ada"}
    </>
  )
}

export default IdentitasPerusahaan
