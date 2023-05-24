import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'
import './rpp.css'
import { Button, Modal } from 'antd'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh, SentimentVeryDissatisfiedOutlined } from '@mui/icons-material'
import { PoweroffOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { useHistory } from 'react-router-dom'

const PengisianRpp = () => {
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [rowDeliverables, setRowDeliverables] = useState([])
  const [noOfRows, setNoOfRows] = useState(1)
  const [noOfRowsDeliverables, setNoOfRowsDeliverables] = useState(1)
  const [noOfRowsMilestones, setNoOfRowsMilestones] = useState(1)
  const [noOfRowsCapaianPerminggu, setNoOfRowsCapaianPerminggu] = useState(1)
  const [
    noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan,
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan,
  ] = useState(1)
  const [topikPekerjaan, setTopikPekerjaan] = useState()
  const [peranDalamPekerjaan, setPeranDalamPekerjaan] = useState()
  const [deskripsiTugas, setDeskripsiTugas] = useState()
  const [tanggalMulaiPekerjaan, setTanggalMulaiPekerjaan] = useState()
  const [tanggalBerakhirPekerjaan, setTanggalBerakhirPekerjaan] = useState()
  const [deliverables, setDeliverables] = useState([{ date: '' }])
  const [deliverablesCopy, setDeliverablesCopy] = useState([{ date: '', keluaran: '' }])
  const [tesA, setTesA] = useState([{ date: '', keluaran: '' }])
  const [milestones, setMilestones] = useState([])
  const [capaianPerminggu, setCapaianPerminggu] = useState({ mingguke: '', capaian: '' })
  const [jadwalPenyelesaianKeseluruhan, SetJadwalPenyelesaianKeseluruhan] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet)
  }

  function changePageBack() {
    changePage(-1)
  }

  function changePageNext() {
    changePage(+1)
  }

  //LOADING PROCESS HANDLED
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  //SAVE DATA DELIVERABLES TO STATE OF DELIVERABLES
  const handleDataDeliverables = (idx, event, type) => {
    // alert(idx, event)
    setDeliverablesCopy(deliverables)
    if (type === 'date') {
      deliverables.map((rec, ind) => {
        //  console.log("data ==> ", rec.date)
        var indeks = idx + 1
        if (rec.id === idx) {
          return [
            console.log('data sudah ada'),
            (deliverables[indeks].date = event),
            setDeliverables(deliverables),
          ]
        } else {
          setDeliverables([
            ...deliverables,
            {
              date: event,
              id: idx,
            },
          ])
        }
      })
    } else {
      deliverables.map((rec, ind) => {
        //  console.log("data ==> ", rec.date)
        var indeks = idx + 1
        if (rec.id === idx) {
          return [
            console.log('data sudah ada'),
            (deliverables[indeks].keluaran = event),
            setDeliverables(deliverables),
          ]
        } else {
          setDeliverables([
            ...deliverables,
            {
              keluaran: event,
              id: idx,
            },
          ])
        }
      })
    }
    console.log('data deliverables=> ', deliverables)
  }

  const tesHandle = () => {
    console.log(deliverables)
    // console.log('data copy==> ', deliverablesCopy)
  }

  const handleSubmitRPP = () => {}

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
 

  const aksiLihatLebihJelasRPP = () => {
    history.push('/rencanaPenyelesaianProyek/contohPengisianRPP')
  }
  

  return (
    <>
      <React.Fragment>
        <div className="container">
          <Space>
            <Button type="primary" onClick={showModal}>
              Lihat Contoh RPP
            </Button>
            <Modal
              title="Format Pengisian Dokumen RPP"
              visible={isModalOpen}
              open={isModalOpen}
              onCancel={handleOk}
              style={{ top: 0 }}
              footer={[
                <Button key="close" onClick={handleOk}>
                  Tutup
                </Button>,
              ]}
            >
              <Document file="/contohrpp.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                <Page height="600" pageNumber={pageNumber} />
              </Document>
              <p>
                {' '}
                Page {pageNumber} of {numPages}
              </p>

              <Space wrap>
                {pageNumber > 1 && (
                  <Button className="btn-pdf" type="primary" onClick={changePageBack}>
                    Halaman Sebelumnya
                  </Button>
                )}
                {pageNumber < numPages && (
                  <Button className="btn-pdf" onClick={changePageNext} type="primary">
                    Halaman Selanjutnya
                  </Button>
                )}
                <Button className="btn-pdf" type="primary" onClick={aksiLihatLebihJelasRPP}>
                  Lihat Lebih Jelas
                </Button>
              </Space>
            </Modal>
          </Space>

          <div className="spacing"></div>
          <h3 align="center" className="title-s">
            FORM PENGISIAN RPP
          </h3>
          <Form>
            <Row className="date-sp">
              <Col>
                <Form.Group controlId="tanggalMulaiPekerjaan">
                  <Form.Label>Tanggal Mulai Pengerjaan</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggalMulaiPekerjaan"
                    placeholder="Tanggal Mulai Pengerjaan"
                    onChange={(e) => setTanggalMulaiPekerjaan(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="tanggalSelesaiPekerjaan">
                  <Form.Label>Tanggal Selesai Pengerjaan</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggalSelesaiPekerjaan"
                    placeholder="Tanggal Selesai Pengerjaan"
                    onChange={(e) => setTanggalBerakhirPekerjaan(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="topikPekerjaan">
                  <Form.Label>Topik/Tema/Judul Pekerjaan</Form.Label>
                  <Form.Control
                    type="text"
                    name="topikPekerjaan"
                    onChange={(e) => setTopikPekerjaan(e.target.value)}
                    placeholder="Topik Pekerjaan"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="peranDalamPekerjaan">
                  <Form.Label>Peran Dalam Pekerjaan</Form.Label>
                  <Form.Control
                    type="text"
                    name="peranDalamPekerjaan"
                    onChange={(e) => setPeranDalamPekerjaan(e.target.value)}
                    placeholder="Peran Dalam Pekerjaan"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="deskripsiTugas">
                  <Form.Label>Deskripsi Tugas</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="deskripsiTugas"
                    onChange={(e) => setDeskripsiTugas(e.target.value)}
                    placeholder="Deskripsi Tugas"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="row-space">
              <Table striped>
                <thead>
                  <h6>Deliverables</h6>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Deliverables (keluaran/artifak)</th>
                    <th scope="col">Due Date (Tenggat Waktu)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(noOfRowsDeliverables)].map((elementInArray, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="deliverables">
                            <Form.Control
                              type="text"
                              key={index}
                              name="deliverables"
                              placeholder="Deliverables"
                              onChange={(event) => {
                                handleDataDeliverables(index, event.target.value, 'keluaran')
                              }}
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group controlId="duedate">
                            <Form.Control
                              type="date"
                              name="deliverablesduedate"
                              placeholder="Due Date"
                              key={index}
                              onChange={(event) => {
                                handleDataDeliverables(index, event.target.value, 'date')
                              }}
                            />
                          </Form.Group>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <Col>
                <button
                  type="button"
                  className="btn btn-primary me-6 btn-sm"
                  onClick={() => setNoOfRowsDeliverables(noOfRowsDeliverables + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRowsDeliverables(noOfRowsDeliverables - 1)}
                >
                  Hapus Baris Terakhir
                </button>
              </Col>
            </Row>
            <Row className="row-space">
              <Table striped>
                <thead>
                  <h6>Milestones</h6>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Tanggal Mulai</th>
                    <th scope="col">Tanggal Selesai</th>
                    <th scope="col">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(noOfRowsMilestones)].map((elementInArray, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {' '}
                          <Form.Group controlId="tanggalMulaiMilestones">
                            <Form.Control
                              type="date"
                              name="tanggalMulaiMilestones"
                              placeholder="Tanggal Mulai"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group controlId="tanggalSelesaiMilestones">
                            <Form.Control
                              type="date"
                              name="tanggalSelesaiMilestones"
                              placeholder="Tanggal Selesai"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          <Form.Group className="mb-3" controlId="deskripsiMilestones">
                            <Form.Control as="textarea" placeholder="Deskripsi Milestones" />
                          </Form.Group>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <Col>
                <button
                  type="button"
                  className="btn btn-primary me-6 btn-sm"
                  onClick={() => setNoOfRowsMilestones(noOfRowsMilestones + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRowsMilestones(noOfRowsMilestones - 1)}
                >
                  Hapus Baris Terakhir
                </button>
              </Col>
            </Row>
            <Row className="row-space">
              <Table striped>
                <thead>
                  <h6>Rencana Capaian Perminggu</h6>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Minggu Ke</th>
                    <th scope="col">Rencana Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(noOfRowsCapaianPerminggu)].map((elementInArray, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="mingguRencanaCapaianPerMinggu">
                            <Form.Control
                              type="number"
                              name="mingguRencanaCapaianPerMinggu"
                              placeholder="Minggu Ke"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="rencanaCapaian">
                            <Form.Control as="textarea" placeholder="Rencana Capaian" />
                          </Form.Group>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <Col>
                <button
                  type="button"
                  className="btn btn-primary me-6 btn-sm"
                  onClick={() => setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu - 1)}
                >
                  Hapus Baris Terakhir
                </button>
              </Col>
            </Row>
            <Row className="row-space">
              <Table striped>
                <thead>
                  <h6>Jadwal Penyelesaian Pekerjaan Keseluruhan</h6>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Butir Pekerjaan</th>
                    <th scope="col">Jenis Pekerjaan</th>
                    <th scope="col">Minggu Ke (Mulai)</th>
                    <th scope="col">Minggu Ke (Selesai)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan)].map(
                    (elementInArray, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            {' '}
                            <Form.Group className="mb-3" controlId="butirpekerjaan">
                              <Form.Control
                                type="text"
                                name="butirpekerjaan"
                                placeholder="Butir Pekerjaan"
                              />
                            </Form.Group>
                          </td>
                          <td>
                            {' '}
                            <Form.Group className="mb-3" controlId="jenispekerjaan">
                              <Form.Control
                                type="text"
                                name="jenispekerjaan"
                                placeholder="Jenis Pekerjaan"
                              />
                            </Form.Group>
                          </td>
                          <td>
                            {' '}
                            <Form.Group className="mb-3" controlId="minggumulai">
                              <Form.Control
                                type="text"
                                name="minggumulai"
                                placeholder="Minggu Mulai"
                              />
                            </Form.Group>
                          </td>
                          <td>
                            {' '}
                            <Form.Group className="mb-3" controlId="mingguselesai">
                              <Form.Control
                                type="text"
                                name="mingguselesai"
                                placeholder="Minggu Selesai"
                              />
                            </Form.Group>
                          </td>{' '}
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </Table>
              <Col>
                <button
                  type="button"
                  className="btn btn-primary me-6 btn-sm"
                  onClick={() =>
                    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
                      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan + 1,
                    )
                  }
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
                      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan - 1,
                    )
                  }
                >
                  Hapus Baris Terakhir
                </button>
              </Col>
            </Row>

            <Button type="primary" block onClick={tesHandle}>
              SUBMIT LOOGBOOK
            </Button>
          </Form>
        </div>
      </React.Fragment>
    </>
  )
}

export default PengisianRpp
