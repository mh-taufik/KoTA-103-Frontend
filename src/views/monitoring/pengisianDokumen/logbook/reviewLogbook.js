import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import {ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import { Button, Card, FloatButton, Popover, Space, notification } from 'antd'
import routes from 'src/routes'

const ReviewLogbook = (props) => {
  var params = useParams()
  const nim_peserta = params.nim
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
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
    // console.log("nama proyek awal : ", logbookPeserta.attributes.namaproyek)

    // alert('idLogbook :', params.id)
    console.log(params.id)
    idLogbook = params.id
    console.log('id', idLogbook)
  }, [history])

  const handleInputLogbookDate = (date) => {
    // console.log('tanggal', value)

    axios
      .get(`http://localhost:1337/api/logbooks?filters[tanggallogbook][$eq]=${date}`)
      .then((result) => {
        const ress = result.data.data.length
        if (ress > 0) {
          notification.warning({
            message: 'Pilih tanggal lain, logbook sudah tersedia',
          })
          setSubmitAccepted(0)
        }
      })
  }

  const getDataLogbookChosen = async (index) => {
    enterLoading(index)
    await axios
      .get(`http://localhost:1337/api/logbooks/${LOGBOOK}`)
      .then((response) => {
        dataLogbook = response.data.data
        console.log('data', dataLogbook)
        setLogbookPeserta(response.data.data)

        setLogbookAttributesData(response.data.data.attributes)
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

    // console.log('nama proyek awal : ', logbookPeserta.attributes.namaproyek)
  }


  useEffect(() => {
    getDataLogbookChosen()
  }, [history])


  const hoverButtonKembali = <div>Klik tombol, untuk kembali ke list logbook</div>

  const handlingButtonKembali = () => {
    (rolePengguna !=='1')? history.push(`/rekapDokumenPeserta/logbookPeserta/${nim_peserta}`): history.push(`/logbook`)
  }

  return (
    <>
      <React.Fragment>
     

        <div className="container">
          <h3 align="center" className="title-s">
            {rolePengguna === '1' && <>FORM LOGBOOK</>}
            LOGBOOK PESERTA
          </h3>

          <Form>
            <Row>
              <Col>
                <Form.Group controlId="tanggalLogbook">
                  <Form.Label>Tanggal Logbook</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggallogbook"
                    placeholder={false}
                    value={logbookAttributesData.tanggallogbook}
                    onChange={(e) => handleInputLogbookDate(e.target.value)}
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
                    defaultValue={logbookAttributesData.namaproyek}
                    name="namaproyek"
                    onChange={(e) => setNamaProyek(e.target.value)}
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
                    defaultValue={logbookAttributesData.projectmanager}
                    onChange={(e) => setProjectManager(e.target.value)}
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
                    defaultValue={logbookAttributesData.technicalleader}
                    onChange={(e) => setTechnicalLeader(e.target.value)}
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
                    name="tugas"
                    defaultValue={logbookAttributesData.tugas}
                    onChange={(e) => setTugasPeserta(e.target.value)}
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
                    name="waktudankegiatan"
                    defaultValue={logbookAttributesData.waktudankegiatan}
                    onChange={(e) => setWaktuDanKegiatanPeserta(e.target.value)}
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
                    onChange={(e) => setTools(e.target.value)}
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
                    type="text"
                    name="hasilkerja"
                    defaultValue={logbookAttributesData.hasilkerja}
                    onChange={(e) => setHasilKerja(e.target.value)}
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
                    name="keterangan"
                    defaultValue={logbookAttributesData.keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

         
          </Form>
        </div>
      </React.Fragment>
      <FloatButton type='primary' onClick={handlingButtonKembali} icon={<ArrowLeftOutlined />} tooltip={<div>Kembali ke Rekap Logbook</div>} />
    </>
  )
}

export default ReviewLogbook
