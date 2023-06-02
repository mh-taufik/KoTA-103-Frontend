import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
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
import { Popover, message, notification } from 'antd'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'



const FormPengisianLogbook = (props) => {
  const params = useParams()
  const NIM_PESERTA = params.id
  const [idPeserta, setIdPeserta] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
  const [tanggalLogbook, setTanggalLogbook] = useState()
  const [loadings, setLoadings] = useState([])
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
  const [usernamePeserta, setUsernamePeserta] = useState()
  const [isSesuaiRpp, setIsSesuaiRpp] = useState('')
  const [kendala, setKendala] = useState('')
  axios.defaults.withCredentials = true
  let history = useHistory()
  const [modal, setModal] = useState(false);
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);

  const toggle = () =>{ setModal(!modal)};
  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setIsSesuaiRpp(false)
    setCloseAll(false);
  };
  const toggleYes = () =>{
    setIsSesuaiRpp(true)
    submitLogbook(true,'')
    console.log('daa', isSesuaiRpp)
  }
  const toggleAll = () => {
    setNestedModal(!nestedModal);
    console.log('ISI SESUAI RPP', isSesuaiRpp, ' dan ', kendala)
    submitLogbook(false, kendala)
    setCloseAll(true);
  };
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  useEffect(() => {
    console.log('usernamePeserta', params.id)
   
  }, [])

  const handleInputLogbookDate = (date) => {
    //  console.log('tanggal', value)

    axios
      .get(`http://localhost:1337/api/logbooks?filters[tanggallogbook][$eq]=${date}`)
      .then((result) => {
        const ress = result.data.data.length
        if (ress > 0) {
          notification.warning({
            message: 'Pilih tanggal lain, logbook sudah tersedia',
          })
          setSubmitAccepted(0)
          window.location.reload(false);
          
        }else{
          setTanggalLogbook(date)
        }
      })
  }

  useEffect(() => {
    setUsernamePeserta(params.id)
    getIdPeserta()
  }, [history])

  const submitLogbook = (sesuai, kendala) => {
    if(submitAccepted===0){
      console.log('tidak bisa')
      notification.info({message:'Silahkan ganti tanggal logbook'})
      window.location.reload(false);
    }else{
      console.log('bisa')
     
      var idParticipant = idPeserta
     saveDataLogbook(idParticipant, sesuai, kendala)
      //var a = typeof(idPeserta)
      // setTimeout(function () {
      //   history.push(`/rekapDokumenPeserta/logbookPeserta/${NIM_PESERTA}`)
      // },2000)
     
      // console.log("idgina", idParticipant)

    }
  

  }

  const getIdPeserta = async (data, index) => {
    enterLoading(index)
    await axios
      .get(`http://localhost:1337/api/pesertas?filters[username][$eq]=${NIM_PESERTA}`)
      .then((response) => {
        console.log(response)
        console.log("id Peserta",response.data.data[0].id)
        setIdPeserta(response.data.data[0].id)
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
  const saveDataLogbook = async (data, kesesuaian, kendala) => {
    // enterLoading(index)
    await axios
      .post('http://localhost:1337/api/logbooks', {
        'data': {
          'tanggallogbook': tanggalLogbook,
          'namaproyek': namaProyek,
          'tools': tools,
          'hasilkerja': hasilKerja,
          'projectmanager': projectManager,
          'keterangan': keterangan,
          'technicalleader': technicalLeader,
          'tugas': tugasPeserta,
          'waktudankegiatan': waktuDanKegiatanPeserta,
          'statuspengecekan': statusPengecekanPembimbing,
          'statuspengumpulan' : '-',
          'sesuaiperencanaan' : kesesuaian,
          'kendala' : kendala,
          'peserta': {
            'connect' : [data]
            },
          },
        },
      )
      .then((response) => {
        notification.success({
          message:'Logbook berhasil ditambahkan'
        });
        console.log('ID', response.data.data)
        history.push(`/logbook`)
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

  const handleKembaliKeListPeserta = () =>{
    history.push(`/logbook`)
  }
  return (
    <>
      <React.Fragment>
        <div className=" container">
        <Popover content={<div>Klik tombol untuk kembali ke rekap logbook</div>}>
              <Button type="primary" shape="round" size="medium" onClick={handleKembaliKeListPeserta}>
                Kembali
              </Button>
            </Popover>
          <h3 align="center" className="title-s">
            FORM PENGISIAN LOGBOOK
          </h3>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="tanggalLogbook">
                  <Form.Label >Tanggal Logbook</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggallogbook"
                    value={tanggalLogbook}
                    placeholder="Tanggal Logbook"
                    onChange={(e) => handleInputLogbookDate(e.target.value)}
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
                    value={namaProyek}
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
                    value={projectManager}
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
                    value={technicalLeader}
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
                    value={tugasPeserta}
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
                    value={waktuDanKegiatanPeserta}
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
                    value={tools}
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
                    value={hasilKerja}
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
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button className="form-control btn btn-primary" onClick={toggle}>
              Submit Logbook
            </Button>

            <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <b>PASTIKAN TANGGAL LOGBOOK SESUAI !!!</b><br/>
          Apakah isi logbook Anda sesuai dengan perencanaan yang tertulis di RPP?, klik ya jika benar
      
          <br />
          <Modal
            isOpen={nestedModal}
            toggle={toggleNested}
            onClosed={closeAll ? toggle : undefined}
          >
            <ModalHeader>Kendala yang dihadapi</ModalHeader>
            <ModalBody>
              <Form>
              <Row>
              <Col>
                <Form.Group className="mb-3" controlId="kendala">
                  <Form.Label>Kendala</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Kendala yang dihadapi"
                    name="kendala"
                    value={kendala}
                    onChange={(e) => setKendala(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleAll}>
                Submit
              </Button>
            </ModalFooter>
          </Modal>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleYes}>
            Ya
          </Button>{' '}
          <Button color="secondary" onClick={toggleNested}>
            Tidak
          </Button>
        </ModalFooter>
      </Modal>
          </Form>
        </div>
      </React.Fragment>
    </>
  )
}

export default FormPengisianLogbook
