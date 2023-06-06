import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import { Button, Card, FloatButton, Popover, Space, Spin, Tag, notification } from 'antd'
import routes from 'src/routes'

const ReviewLogbook = (props) => {
  var params = useParams()
  const NIM_PESERTA_BY_PARAMS = params.nim
  const LOGBOOK = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [tanggalLogbook, setTanggalLogbook] = useState()
  const [loadings, setLoadings] = useState([])
  const [tanggalProyek, setTanggalProyek] = useState()
  const [tools, setTools] = useState()
  const [hasilKerja, setHasilKerja] = useState()
  const [projectManager, setProjectManager] = useState()
  const [keterangan, setKeterangan] = useState()
  const [namaProyek, setNamaProyek] = useState()
  const [technicalLeader, setTechnicalLeader] = useState()
  const [tugasPeserta, setTugasPeserta] = useState()
  const [waktuDanKegiatanPeserta, setWaktuDanKegiatanPeserta] = useState()
  const [statusPengecekanPembimbing, setStatusPengecekanPembimbing] = useState(0)
  const [submitAccepted, setSubmitAccepted] = useState(1)
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [usernamePeserta, setUsernamePeserta] = useState()
  var dataLogbook = []
  const rolePengguna = localStorage.id_role
  const [logbookAttributesData, setLogbookAttributesData] = useState([''])
  axios.defaults.withCredentials = true
  let history = useHistory()

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  useEffect(() => {

    const getDataLogbook = async (index) => {
      const ID_LOGBOOK = parseInt(LOGBOOK)
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/get/${ID_LOGBOOK}`)
        .then((result) => {
          const convertDate = (date) => {
            var temp_date_split = date.split('-')
            const month = [
              'Januari',
              'Februari',
              'Maret',
              'April',
              'Mei',
              'Juni',
              'Juli',
              'Agustus',
              'September',
              'Oktober',
              'November',
              'Desember',
            ]
            var date_month = temp_date_split[1]
            var month_of_date = month[parseInt(date_month) - 1]
            return date ? `${temp_date_split[2]}  ${month_of_date}  ${temp_date_split[0]}` : null
          }

          let data = result.data.data
          let temp_res = []
       
              temp_res = {
                date : convertDate(data.date),
                description : data.description,
                grade : data.grade,
                id : data.id,
                participant_id : data.participant_id,
                project_manager : data.project_manager,
                project_name : data.project_name,
                status : data.status.status,
                task : data.task,
                technical_leader : data.technical_leader,
                time_and_activity : data.time_and_activity,
                tools : data.tools,
                work_result : data.work_result
              }
      

          console.log(temp_res)
          setLogbookAttributesData(temp_res)
          setIsLoading(false)
        })
        .catch(function (error) {
          if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
            history.push({
              pathname: '/login',
              state: {
                session: true,
              },
            })
          } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
            history.push('/404')
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    }
    getDataLogbook()
  }, [history])

  const hoverButtonKembali = <div>Klik tombol, untuk kembali ke list logbook</div>

  const handlingButtonKembali = () => {
    rolePengguna !== '1'
      ? history.push(`/rekapDokumenPeserta/logbookPeserta/${NIM_PESERTA_BY_PARAMS}`)
      : history.push(`/logbook`)
  }

  const setTagColorStatus = (status) =>{
    if(status === 'Terlambat'){
      return 'red'
    }else{
      return 'green'
    }

  } 
  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <React.Fragment>
     

        <div className="container">
          <h3 align="center" className="title-s">
          
           FORM LOGBOOK PESERTA
          </h3>

          <Form>
            <Row className='spacebottom'>
              <Col span={2}>
               Tanggal Logbook : 
              </Col>
              <Col span={8}>{logbookAttributesData.date}</Col>
              <Col span={2}>Status Pengumpulan : </Col>
              <Col span={4}><Tag color={setTagColorStatus(logbookAttributesData.status)}>{logbookAttributesData.status}</Tag></Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="namaProyek">
                  <Form.Label>Nama Proyek</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={logbookAttributesData.project_name}
                    name="namaproyek"
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="projectManager">
                  <Form.Label>Project Manager</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectmanager"
                    defaultValue={logbookAttributesData.project_manager}
                    required
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="technicalLeader">
                  <Form.Label>Technical Leader</Form.Label>
                  <Form.Control
                    type="text"
                    name="technicalleader"
                    defaultValue={logbookAttributesData.technical_leader}
                    required
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="tugas">
                  <Form.Label>Tugas</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="tugas"
                    defaultValue={logbookAttributesData.task}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="waktuDanKegiatan">
                  <Form.Label>Waktu dan Kegiatan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="waktudankegiatan"
                    defaultValue={logbookAttributesData.time_and_activity}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="toolsYangDigunakan">
                  <Form.Label>Tools Yang Digunakan</Form.Label>
                  <Form.Control
                    type="text"
                    name="tools"
                    defaultValue={logbookAttributesData.tools}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="hasilKerja">
                  <Form.Label>Hasil Kerja</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="hasilkerja"
                    defaultValue={logbookAttributesData.work_result}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="keterangan">
                  <Form.Label>Keterangan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="keterangan"
                    defaultValue={logbookAttributesData.description}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

         
          </Form>
        </div>
      </React.Fragment>
      <FloatButton
        type="primary"
        onClick={handlingButtonKembali}
        icon={<ArrowLeftOutlined />}
        tooltip={<div>Kembali ke Rekap Logbook</div>}
      />
    </>
  )
}

export default ReviewLogbook
