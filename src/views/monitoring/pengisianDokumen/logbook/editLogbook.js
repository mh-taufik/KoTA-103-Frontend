import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import {ArrowLeftOutlined } from '@ant-design/icons';
import TextField from '@mui/material/TextField'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import { FloatButton, Popover, notification } from 'antd'
import routes from 'src/routes'

const FormEditLogbook = (props) => {
  const params = useParams()
  const ID_LOGBOOK = params.id

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
  const [kendala, setKendala] = useState()
  const [statusPengecekanPembimbing, setStatusPengecekanPembimbing] = useState(0)
  const [submitAccepted, setSubmitAccepted] = useState(1)
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [usernamePeserta, setUsernamePeserta] = useState()
  var dataLogbook = []
  const [logbookAttributesData, setLogbookAttributesData] = useState([''])
  var idLogbook
  var LOGBOOK = params.id
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
      enterLoading(index)
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/get/${ID_LOGBOOK}`)
        .then((response) => {
          dataLogbook = response.data.data
          console.log('data', dataLogbook)
        
          setLogbookAttributesData(response.data.data)
          let temp = response.data.data
          let temp_res = []
          let getTempRes = function (obj){
          
              setNamaProyek(obj.project_name)
              setProjectManager(obj.project_manager)
              setTechnicalLeader(obj.technical_leader)
              setTugasPeserta(obj.task)
              setWaktuDanKegiatanPeserta(obj.time_and_activity)
              setTools(obj.tools)
              setHasilKerja(obj.work_result)
              setKeterangan(obj.description)
              setKendala(obj.encountered_problem)
           
          }
          getTempRes(temp)
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




  const putLogbookParticipantChanged = async (index) => {
    //console.log(namaProyek, tools, hasilKerja, projectManager, keterangan,technicalLeader,tugasPeserta,waktuDanKegiatanPeserta,kendala,ID_LOGBOOK)
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/update`, {
          project_name: namaProyek,
          tools : tools,
          work_result : hasilKerja,
          project_manager : projectManager,
          description : keterangan,
          technical_leader : technicalLeader,
          task : tugasPeserta,
          time_and_activity :  waktuDanKegiatanPeserta,
          encountered_problem : kendala,
          id : ID_LOGBOOK
        
      })
      .then((response) => {
        console.log(response)
        notification.success({
          message: 'Logbook berhasil diubah',
        })
        refreshData(index)
        history.push(`/logbook/detaillogbook/${ID_LOGBOOK}`)
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

  const refreshData = (index) => {
    axios.get(`http://localhost:1337/api/logbooks/${LOGBOOK}`).then((result) => {
      setLogbookPeserta(result.data.data)
      setLogbookAttributesData(result.data.data.attributes)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }


  //CLICKED SUBMIT BUTTON
  const submitLogbook = () => {
    putLogbookParticipantChanged()
    // console.log('id logbook = ', LOGBOOK)
    // console.log('hasil edit : ', namaProyek)
    // history.push(`/logbook/formEditLogbook/reviewEdit/${LOGBOOK}`)
  }

  return (
    <>
      <React.Fragment>
        <div className="container">
       
          <h3 align="center" className="title-s">
            FORM PENGISAN LOGBOOK - EDIT LOGBOOK 
          </h3>

          <Form>
            <Row>
              <Col>
                <Form.Group controlId="tanggalLogbook">
                  <Form.Label>Tanggal Logbook</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggallogbook"
                    value={logbookAttributesData.date}
                    placeholder="Tanggal Logbook"
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="namaProyek">
                  <Form.Label>Nama Proyek</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={logbookAttributesData.project_name}
                    name="namaproyek"
                    placeholder="Nama Proyek"
                    onChange={(e) => setNamaProyek(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="projectManager">
                  <Form.Label>Project Manager</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Project Manager"
                    name="projectmanager"
                    defaultValue={logbookAttributesData.project_manager}
                    onChange={(e) => setProjectManager(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="technicalLeader">
                  <Form.Label>Technical Leader</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="technicalLeader"
                    name="technicalleader"
                    defaultValue={logbookAttributesData.technical_leader}
                    onChange={(e) => setTechnicalLeader(e.target.value)}
                    required
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
                    placeholder="tugas"
                    name="tugas"
                    defaultValue={logbookAttributesData.task}
                    onChange={(e) => setTugasPeserta(e.target.value)}
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
                    placeholder="Waktu Dan Kegiatan"
                    name="waktudankegiatan"
                    defaultValue={logbookAttributesData.time_and_activity}
                    onChange={(e) => setWaktuDanKegiatanPeserta(e.target.value)}
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
                    placeholder="Tools Yang Digunakan"
                    onChange={(e) => setTools(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="hasilKerja">
                  <Form.Label>Hasil Kerja</Form.Label>
                  <Form.Control
                    type="text"
                    name="hasilkerja"
                    defaultValue={logbookAttributesData.work_result}
                    placeholder="Hasil Kerja"
                    onChange={(e) => setHasilKerja(e.target.value)}
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
                    placeholder="keterangan"
                    name="keterangan"
                    defaultValue={logbookAttributesData.description}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="keterangan">
                  <Form.Label>Kendala</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="kendala"
                    defaultValue={logbookAttributesData.encountered_problem}
                    onChange={(e) => setKendala(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button className="form-control btn btn-primary" onClick={putLogbookParticipantChanged  }>
              Submit Logbook
            </Button>
          </Form>
        </div>
        <FloatButton type='primary' icon={<ArrowLeftOutlined />}  onClick={()=>history.push(`/logbook`)} tooltip={<div>Kembali ke Rekap Logbook</div>} />




      </React.Fragment>
    </>
  )
}

export default FormEditLogbook
