import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import './rpp.css'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'

const PengisianRpp = () => {
  const [rowDeliverables, setRowDeliverables] = useState([])
  const [noOfRows, setNoOfRows] = useState(1)

  useEffect(() => {})

  return (
    <>
      <React.Fragment>
        <div className="App container">
          <h3 align="center">FORM PENGISIAN RPP</h3>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="topikPekerjaan">
                  <Form.Label>Topik/Tema/Judul Pekerjaan</Form.Label>
                  <Form.Control type="text" placeholder="Topik Pekerjaan" required/>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="peranPekerjaan">
                  <Form.Label>Peran Dalam Pekerjaan</Form.Label>
                  <Form.Control type="text" placeholder="Peran Dalam Pekerjaan" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="deskripsiTugas">
                  <Form.Label>Deskripsi Tugas</Form.Label>
                  <Form.Control as="textarea" placeholder="Deskripsi Tugas" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="row-space">
              <Col>
                <Form.Group controlId="tanggalMulai">
                  <Form.Label>Tanggal Mulai Pengerjaan</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggalMulai"
                    placeholder="Tanggal Mulai Pengerjaan"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="tanggalSelesai">
                  <Form.Label>Tanggal Selesai Pengerjaan</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggalSelesai"
                    placeholder="Tanggal Selesai Pengerjaan"
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
                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="deliverables">
                            <Form.Control
                              type="text"
                              name="deliverables"
                              placeholder="Deliverables"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group controlId="duedate">
                            <Form.Control type="date" name="duedate" placeholder="Due Date" />
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
                  onClick={() => setNoOfRows(noOfRows + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRows(noOfRows - 1)}
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
                  {[...Array(noOfRows)].map((elementInArray, index) => {
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
                  onClick={() => setNoOfRows(noOfRows + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRows(noOfRows - 1)}
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
                  {[...Array(noOfRows)].map((elementInArray, index) => {
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
                  onClick={() => setNoOfRows(noOfRows + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRows(noOfRows - 1)}
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
                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="deliverables">
                            <Form.Control
                              type="text"
                              name="deliverables"
                              placeholder="Butir Pekerjaan"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="deliverables">
                            <Form.Control
                              type="text"
                              name="deliverables"
                              placeholder="Jenis Pekerjaan"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="deliverables">
                            <Form.Control
                              type="text"
                              name="deliverables"
                              placeholder="Minggu Mulai"
                            />
                          </Form.Group>
                        </td>
                        <td>
                          {' '}
                          <Form.Group className="mb-3" controlId="deliverables">
                            <Form.Control
                              type="text"
                              name="deliverables"
                              placeholder="Minggu Selesai"
                            />
                          </Form.Group>
                        </td>{' '}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              <Col>
                <button
                  type="button"
                  className="btn btn-primary me-6 btn-sm"
                  onClick={() => setNoOfRows(noOfRows + 1)}
                >
                  Tambah Baris
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setNoOfRows(noOfRows - 1)}
                >
                  Hapus Baris Terakhir
                </button>
              </Col>
            </Row>

            <Button className='btn btn-md btn-success'>Submit RPP</Button>
          </Form>
        </div>
      </React.Fragment>
    </>
  )
}

export default PengisianRpp
