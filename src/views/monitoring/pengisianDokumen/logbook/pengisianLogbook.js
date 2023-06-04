import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { ArrowLeftOutlined } from '@ant-design/icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'
import {
  Button,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
  TreeSelect,
  Upload,
} from 'antd'
import { Space } from 'antd'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import { FloatButton, Popover, message, notification } from 'antd'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import TextArea from 'antd/es/input/TextArea'
import moment from 'moment'

const FormPengisianLogbook = (props) => {
  const params = useParams()
  const [form] = Form.useForm()

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
  const [modal, setModal] = useState(false)
  const [nestedModal, setNestedModal] = useState(false)
  const [closeAll, setCloseAll] = useState(false)
  const [modalExL, setModalExL] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onFinish = () => {
    message.success('Submit success!')
  }
  const onFinishFailed = () => {
    message.error('Submit Gagal, Pastikan Semua Data Sudah Terisi !!!')
  }
  const onFill = () => {
    form.setFieldsValue({
      url: 'https://taobao.com/',
    })
  }

  const toggleExL = () => setModalExL(!modalExL)

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


  const toggle = () => {
    setModal(!modal)
  }
  const toggleNested = () => {
    setNestedModal(!nestedModal)
    setIsSesuaiRpp(false)
    setCloseAll(false)
  }
  const toggleYes = () => {
    setIsSesuaiRpp(true)
    submitLogbook(true, '')
    console.log('daa', isSesuaiRpp)
  }
  const toggleAll = () => {
    setNestedModal(!nestedModal)
    console.log('ISI SESUAI RPP', isSesuaiRpp, ' dan ', kendala)
    submitLogbook(false, kendala)
    setCloseAll(true)
  }
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

  const handleInputLogbookDate = async (date) => {
    await axios
      .get(`http://localhost:1337/api/logbooks?filters[tanggallogbook][$eq]=${date}`)
      .then((result) => {
        const ress = result.data.data.length
        if (ress > 0) {
          notification.warning({
            message: 'Pilih tanggal lain, logbook sudah tersedia',
          })
          setSubmitAccepted(false)
          console.log('tidak bisa')
        } else {
          console.log('bisa')
          setSubmitAccepted(true)
          setTanggalLogbook(date)
        }
      })
  }

  useEffect(() => {
    setUsernamePeserta(params.id)
    getIdPeserta()
  }, [history])

  const submitLogbook = (sesuai, kendala) => {
    if (!submitAccepted) {
      console.log('tidak bisa')
      notification.info({ message: 'Silahkan ganti tanggal logbook' })
    } else {
      console.log('bisa')
      var idParticipant = idPeserta
      saveDataLogbook(idParticipant, sesuai, kendala)
    }
  }

  const getIdPeserta = async (data, index) => {
    enterLoading(index)
    await axios
      .get(`http://localhost:1337/api/pesertas?filters[username][$eq]=${NIM_PESERTA}`)
      .then((response) => {
        console.log(response)
        console.log('id Peserta', response.data.data[0].id)
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
    const cekStatusPengumpulan = (date) => {
      return new Date(date) > new Date() ? 'tepat waktu' : 'terlambat'
    }
    await axios
      .post('http://localhost:1337/api/logbooks', {
        data: {
          tanggallogbook: tanggalLogbook,
          namaproyek: namaProyek,
          tools: tools,
          hasilkerja: hasilKerja,
          projectmanager: projectManager,
          keterangan: keterangan,
          technicalleader: technicalLeader,
          tugas: tugasPeserta,
          waktudankegiatan: waktuDanKegiatanPeserta,
          statuspengecekan: statusPengecekanPembimbing,
          statuspengumpulan: cekStatusPengumpulan(),
          sesuaiperencanaan: kesesuaian,
          kendala: kendala,
          peserta: {
            connect: [data],
          },
        },
      })
      .then((response) => {
        notification.success({
          message: 'Logbook berhasil ditambahkan',
        })
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

  const handleKembaliKeListPeserta = () => {
    history.push(`/logbook`)
  }
  return (
    <>
      <div className="container">
        <h3 align="center" className="title-s">
          FORM PENGISIAN LOGBOOK
        </h3>
        <Box sx={{ color: 'warning.main', fontSize: 12 }} className="spacebottom">
          <ul>
            <li>Setiap logbook akan dinilai</li>
            <li>Isi sesuai dengan kegiatan yang anda lakukan saat KP / PKL</li>
            <li>Anda dapat melihat contoh pengisian Logbook dengan menekan float button</li>
          </ul>
        </Box>
        <Form
          form={form}
          layout="vertical"
          onFinish={toggle}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={24} style={{ padding: 5 }}>
              <Form.Item
                name="tanggallogbook"
                label="TANGGAL LOGBOOK"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'date',
                    warningOnly: true,
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(current) => {
                    return current.isAfter(moment())
                    }}
                  max={moment().format('YYYY-MM-DD')}
                  onChange={(date, dateString) => {
                    handleInputLogbookDate(dateString)
                    console.log('a', dateString)
                    // console.log(new Date(dateString)>new Date())
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{ padding: 4 }}>
              <Form.Item
                name="Nama Proyek"
                label="NAMA PROYEK"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                    min: 6,
                  },
                ]}
                onChange={(e) => setNamaProyek(e.target.value)}
              >
                <Input placeholder="Nama Proyek" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: 4 }}>
              <Form.Item
                name="projectmanager"
                label="PROJECT MANAGER"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                  },
                ]}
                onChange={(e) => setProjectManager(e.target.value)}
              >
                <Input placeholder="Project manager" />
              </Form.Item>
            </Col>
            <Col span={8} style={{ padding: 4 }}>
              <Form.Item
                name="technicalleader"
                label="TECHNICAL LEADER"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                  },
                ]}
                onChange={(e) => setTechnicalLeader(e.target.value)}
              >
                <Input placeholder="Technical Leader" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ padding: 4 }}>
              <Form.Item
                name="tugas"
                label="TUGAS"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                    min: 10,
                  },
                ]}
                onChange={(e) => setTugasPeserta(e.target.value)}
              >
                <Input placeholder="Tugas" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ padding: 4 }}>
              <Form.Item
                name="waktudankegiatan"
                label="WAKTU DAN KEGIATAN"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                    min: 10,
                  },
                ]}
                onChange={(e) => setWaktuDanKegiatanPeserta(e.target.value)}
              >
                <Input placeholder="Waktu dan Kegiatan" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ padding: 4 }}>
              <Form.Item
                name="tools"
                label="TOOLS YANG DIGUNAKAN"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                    min: 2,
                  },
                ]}
                onChange={(e) => setTools(e.target.value)}
              >
                <Input placeholder="Tugas" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ padding: 4 }}>
              <Form.Item
                name="hasilkerja"
                label="HASIL KERJA"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'text',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                    min: 10,
                  },
                ]}
                onChange={(e) => setHasilKerja(e.target.value)}
              >
                <Input placeholder="Hasil Kerja" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ padding: 4 }}>
              <Form.Item
                name="keterangan"
                label="KETERANGAN"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'textarea',
                    warningOnly: true,
                  },
                  {
                    type: 'string',
                    min: 6,
                  },
                ]}
                onChange={(e) => setKeterangan(e.target.value)}
              >
                <TextArea rows={4} placeholder="Keterangan" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Logbook
              </Button>
              {/* <Button
                htmlType="button"
                onClick={() => {
                  console.log(keterangan)
                }}
              >
                Fill
              </Button> */}
            </Space>
          </Form.Item>

          {/* DOD */}
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Modal title</ModalHeader>
            <ModalBody>
              <b>PASTIKAN TANGGAL LOGBOOK SESUAI !!!</b>
              <br />
              Apakah isi logbook Anda sesuai dengan perencanaan yang tertulis di RPP?, klik ya jika
              benar
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
                        <Form.Item
                          name="kendala"
                          label="KENDALA YANG DIHADAPI"
                          rules={[
                            {
                              required: true,
                            },
                            {
                              type: 'textarea',
                              warningOnly: true,
                            },
                            {
                              type: 'string',
                              min: 10,
                            },
                          ]}
                          onChange={(e) => setKendala(e.target.value)}
                        >
                          <TextArea rows={4} placeholder="Keterangan" />
                        </Form.Item>
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
              <Button color="secondary" htmlType="submit" onClick={toggleNested}>
                Tidak
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
      </div>

      {/* CONTOH PDF */}
      <Modal isOpen={modalExL} style={{ width: 800, height: 500 }} toggle={toggleExL}>
        <ModalHeader toggle={toggleExL}>Contoh Pengisian Logbook</ModalHeader>
        <ModalBody>
          <header className="App-header">
            <Document file="/contohlogbook.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page height="600" pageNumber={pageNumber} />
            </Document>
            <p style={{ fontSize: 12 }}>
              Halaman {pageNumber} Dari {numPages}
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
            </Space>
          </header>
        </ModalBody>

      </Modal>

      {/* FLOAT BUTTON */}
      <FloatButton
        shape="circle"
        type="primary"
        style={{
          right: 94,
        }}
        onClick={handleKembaliKeListPeserta}
        tooltip={<div>Kembali ke Rekap Logbook</div>}
        icon={<ArrowLeftOutlined />}
      />
      <FloatButton
        shape="square"
        type="primary"
        style={{
          right: 24,
        }}
        onClick={toggleExL}
        tooltip={<div>Contoh Pengisian Logbook</div>}
      />
    </>
  )
}

export default FormPengisianLogbook
