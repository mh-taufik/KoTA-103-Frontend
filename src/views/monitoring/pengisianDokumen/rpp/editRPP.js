import React, { useEffect, useState } from 'react'

import {
  AutoComplete,
  Button,
  Cascader,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import './rpp.css'
import { Form, Modal, message } from 'antd'
import { Refresh, SentimentVeryDissatisfiedOutlined, TextSnippetSharp } from '@mui/icons-material'
import { PoweroffOutlined } from '@ant-design/icons'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { SpaceContext } from 'antd/lib/space'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'
import moment from 'moment'

const { TextArea } = Input
const EditRPP = () => {
  let params = useParams()
  let PESERTA_ID_RPP_EDIT = params.id
  dayjs.extend(customParseFormat)
  let history = useHistory()
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [loadings, setLoadings] = useState([])
  const [noOfRows, setNoOfRows] = useState(1)
  const [noOfRowsDeliverables, setNoOfRowsDeliverables] = useState(0)
  const [noOfRowsMilestones, setNoOfRowsMilestones] = useState(0)
  const [noOfRowsCapaianPerminggu, setNoOfRowsCapaianPerminggu] = useState(0)
  const [
    noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan,
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan,
  ] = useState(0)
  const [topikPekerjaan, setTopikPekerjaan] = useState()
  const [peranDalamPekerjaan, setPeranDalamPekerjaan] = useState()
  const [deskripsiTugas, setDeskripsiTugas] = useState()
  const [tanggalMulaiPekerjaan, setTanggalMulaiPekerjaan] = useState()
  const [tanggalBerakhirPekerjaan, setTanggalBerakhirPekerjaan] = useState()
  const [deliverables, setDeliverables] = useState([])
  const [milestones, setMilestones] = useState([])
  const [capaianPerminggu, setCapaianPerminggu] = useState([])
  const [jadwalPenyelesaianKeseluruhan, SetJadwalPenyelesaianKeseluruhan] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [dataRPP, setDataRPP] = useState([])
  const [dataMilestones, setDataMilestones] = useState([])
  const [dataCapaianMingguan, setDataCapaianMingguan] = useState([])
  const [dataDeliverables, setDataDeliverables] = useState([])

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

  /** LOADING HANDLING */
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  /** API POST DATA*/

  /**HANDLE FAILED INPUT */
  const onFinishFailed = () => {
    message.error('Submit gagal pastikan semua data terisi !!!')
  }

  /**HANDLE INPUT TANGGAL PEKERJAAN (TANGGAL PERENCANAAN)  */
  const handleInputTanggalPengerjaan = (tanggal) => {
    var tglmulai = tanggal[0]
    var tglselesai = tanggal[1]
    setTanggalMulaiPekerjaan(tglmulai)
    setTanggalBerakhirPekerjaan(tglselesai)
  }

  /** SAVE DATA DELIVERABLES TO STATE OF DELIVERABLES */
  const handleDataDeliverables = (index, event, type) => {
    console.log(index, event, type)
    let data = [...deliverables]
    data[index][type] = event
    setDeliverables(data)
    console.log('data deliverables=> ', deliverables)
  }

  const handleAddRowDeliverables = () => {
    setNoOfRowsDeliverables(noOfRowsDeliverables + 1)
    let newField = { deliverables: '', date: '' }
    setDeliverables([...deliverables, newField])
  }

  const handleDropRowDeliverables = () => {
    console.log('sebelum apus', deliverables)
    console.log(deliverables.length)
    console.log(deliverables)
    var will_delete = deliverables.length - 1
    var temp = []
    var tempDeliverables = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempDeliverables(deliverables)
    setDeliverables(temp)
    console.log('del', deliverables)
    setNoOfRowsDeliverables(noOfRowsDeliverables - 1)
  }

  /** SAVE DATA MILESTONES TO STATE OF MILESTONES */
  const handleDataMilestones = (index, event, type) => {
    console.log(index, event, type)
    let data = [...milestones]
    data[index][type] = event
    setMilestones(data)
    console.log('data milestones=> ', milestones)
  }

  const handleAddRowMilestones = () => {
    let newField = { deskripsi: ' ', tanggalmulai: ' ', tanggalselesai: ' ' }
    setMilestones([...milestones, newField])
    setNoOfRowsMilestones(noOfRowsMilestones + 1)
  }

  const handleDropRowMilestones = () => {
    console.log('sebelum apus milestones', milestones)
    console.log(milestones.length)
    console.log(milestones)
    var will_delete = milestones.length - 1
    var temp = []
    var tempMilestones = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempMilestones(milestones)
    setMilestones(temp)
    console.log('del milestones', milestones)
    setNoOfRowsMilestones(noOfRowsMilestones - 1)
  }

  /** SAVE DATA RENCANA CAPAIAN PERMINGGU TO STATE OF RENCANA CAPAIAN PERMINGGU */
  const handleDataRencanaCapaianPerminggu = (index, event, type) => {
    console.log(index, event, type)
    let data = [...capaianPerminggu]
    data[index][type] = event
    setCapaianPerminggu(data)
    console.log('data capaianperminggu=> ', capaianPerminggu)
  }

  const handleAddRowRencanaCapaianPerminggu = () => {
    let newField = { tanggal: '', rencana: '' }
    setCapaianPerminggu([...capaianPerminggu, newField])
    setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu + 1)
  }

  const handleDropRowRencanaCapaianPerminggu = () => {
    console.log('sebelum apus rcm', capaianPerminggu)
    console.log(capaianPerminggu.length)
    var will_delete = capaianPerminggu.length - 1
    var temp = []
    var tempCapaianPerminggu = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempCapaianPerminggu(capaianPerminggu)
    setCapaianPerminggu(temp)
    console.log('del capaian', capaianPerminggu)
    setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu - 1)
  }

  /** SAVE DATA JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN TO SET STATE OF JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN */
  const handleDataJadwalPenyelesaianKeseluruhan = (index, event, type) => {
    console.log(index, event, type)
    let data = [...jadwalPenyelesaianKeseluruhan]
    data[index][type] = event
    SetJadwalPenyelesaianKeseluruhan(data)
    console.log('data jadwal penyelesaian=> ', jadwalPenyelesaianKeseluruhan)
  }

  const handleAddRowJadwalPenyelesaianKeseluruhan = () => {
    let newField = { minggumulai: '', mingguselesai: '', butirpekerjaan: '', jenispekerjaan: '' }
    SetJadwalPenyelesaianKeseluruhan([...jadwalPenyelesaianKeseluruhan, newField])
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan + 1,
    )
  }

  const handleDropRowJadwalPenyelesaianKeseluruhan = () => {
    console.log('sebelum apus perencanaan', jadwalPenyelesaianKeseluruhan)
    console.log(jadwalPenyelesaianKeseluruhan.length)
    var will_delete = jadwalPenyelesaianKeseluruhan.length - 1
    var temp = []
    var tempJadwalKeseluruhan = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempJadwalKeseluruhan(jadwalPenyelesaianKeseluruhan)
    SetJadwalPenyelesaianKeseluruhan(temp)
    console.log('del peyelesaian', jadwalPenyelesaianKeseluruhan)
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan - 1,
    )
  }

  /** FUNCTIONAL */
  /**get data date berdasarkan minggu dalam tahun */
  function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    var ISOweekStart = simple
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    return ISOweekStart

    // console.log(ISOweekStart)
  }

  /** HANDLE RANGE DATE SAAT MEMILIH  */
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day')
  }

  /** TEST */
  const tesHandle = () => {
    console.log('tes isi jadwal', jadwalPenyelesaianKeseluruhan)
    // console.log('data copy==> ', deliverablesCopy)
  }

  /** */
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
    history.push(`/rencanaPenyelesaianProyek/peserta/formPengisianRPP/contohPengisianRPP`)
  }

  useEffect(() => {
    const getRPP = async () => {
      await axios
        .get(`http://localhost:1337/api/rpps?populate=*&filters[id][$eq]=${PESERTA_ID_RPP_EDIT}`)
        .then((response) => {
          console.log(response.data.data)
          setDataRPP({
            tanggal_mulai: response.data.data[0].attributes.tanggal_mulai,
            tanggal_selesai: response.data.data[0].attributes.tanggal_selesai,
            perankelompok: response.data.data[0].attributes.perankelompok,
            waktupengisian: response.data.data[0].attributes.waktupengisian,
            judulpekerjaan: response.data.data[0].attributes.judulpekerjaan,
            deskripsi_tugas: response.data.data[0].attributes.deskripsi_tugas,
            status: response.data.data[0].status,
          })

          /** SET DATA MILESTONES */
          var temp_mil = []
          var temp_mil1 = []
          temp_mil = response.data.data[0].attributes.milestones.data
          var temp_milestone = function (obj) {
            for (var i in obj) {
              temp_mil1.push({
                id: obj[i].id,
                deskripsi: obj[i].attributes.deskripsi,
                tanggal: obj[i].attributes.tanggal,
              })
            }
          }

          temp_milestone(temp_mil)
          setDataMilestones(temp_mil1)
          console.log('milestones', temp_mil1)

          /**SET DATA DELIVERABLES */
          var temp_del = []
          var temp_del1 = []
          temp_del = response.data.data[0].attributes.deliverables.data
          var temp_deliverables = function (obj) {
            for (var i in obj) {
              temp_del1.push({
                id: obj[i].id,
                duedate: obj[i].attributes.duedate,
                deliverables: obj[i].attributes.deliverables,
              })
            }
          }

          temp_deliverables(temp_del)
          setDataDeliverables(temp_del1)
          console.log('deliverables', temp_del1)

          /**SET DATA RENCANA CAPAIAN MINGGUAN */
          var temp_rcm = []
          var temp_rcm1 = []
          temp_rcm = response.data.data[0].attributes.rencanacapaianmingguans.data
          var temp_rencanaCapaianMingguan = function (obj) {
            for (var i in obj) {
              temp_rcm1.push({
                id: obj[i].id,
                rencanacapaian: obj[i].attributes.rencanacapaian,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalberakhir: obj[i].attributes.tanggalberakhir,
              })
            }
          }

          temp_rencanaCapaianMingguan(temp_rcm)
          setDataCapaianMingguan(temp_rcm1)
          console.log('capaian mingguan', temp_rcm1)
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

    getRPP()
  }, [history])

  const columnDeliverables = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL',
      dataIndex: 'duedate',
      key: 'duedate',
      width: '20%',
    },
    {
      title: 'DELIVERABLES',
      dataIndex: 'deliverables',
      key: 'deliverables',
      width: '30%',
    },
  ]

  const columnMiletones = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL',
      dataIndex: 'tanggal',
      key: 'tanggal',
      width: '20%',
    },
    {
      title: 'DESKRIPSI',
      dataIndex: 'deskripsi',
      key: 'deskripsi',
      width: '30%',
    },
  ]

  const columnRencanaCapaianMingguan = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL MULAI',
      dataIndex: 'tanggalmulai',
      key: 'tanggalmulai',
      width: '20%',
    },
    {
        title: 'TANGGAL BERAKHIR',
        dataIndex: 'tanggalberakhir',
        key: 'tanggalberakhir',
        width: '20%',
      },
    {
      title: 'RENCANA CAPAIAN',
      dataIndex: 'rencanacapaian',
      key: 'rencanacapaian',
      width: '30%',
    },
  ]
  

  
  const column= [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL MULAI',
      dataIndex: 'tanggalmulai',
      key: 'tanggalmulai',
      width: '20%',
    },
    {
        title: 'TANGGAL BERAKHIR',
        dataIndex: 'tanggalberakhir',
        key: 'tanggalberakhir',
        width: '20%',
      },
    {
      title: 'RENCANA CAPAIAN',
      dataIndex: 'rencanacapaian',
      key: 'rencanacapaian',
      width: '30%',
    },
  ]
  

  return (
    <>
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
              <Button className="btn-pdf" type="primary" onClick={() => aksiLihatLebihJelasRPP()}>
                Lihat Lebih Jelas
              </Button>
            </Space>
          </Modal>
        </Space>

        <div className="spacing"></div>
        <h3 align="center" className="title-s">
          FORM PENGISIAN RPP
        </h3>
        <Box sx={{ color: 'warning.main' }}>
          <ul>
            <li>Pastikan semua RPP terisi</li>
            <li>Isi sesuai dengan perencanaan proyek yang diberikan</li>
          </ul>
        </Box>
        <div className="spacebottom"></div>
        <Form
          name="basic"
          className="left"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 1200,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          onFinishFailed={onFinishFailed}
        >
          <div>
         
              <Row>
                <Col style={{ paddingBottom: 20 }} span={8}>Tanggal Mulai</Col>
                <Col span={8}>{dataRPP.tanggal_mulai}</Col>
              </Row>
              <Row>
                <Col style={{ paddingBottom: 20 }} span={8}>Tanggal Selesai</Col>
                <Col span={8}>{dataRPP.tanggal_selesai}</Col>
              </Row>
          

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Topik Pekerjaan
              </Col>
              <Col span={8}>{dataRPP.judulpekerjaan}</Col>
              <Col></Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Peran Kelompok
              </Col>
              <Col span={8}>{dataRPP.perankelompok}</Col>
              <Col></Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Deskripsi Tugas
              </Col>
              <Col span={8}>{dataRPP.deskripsi_tugas}</Col>
              <Col></Col>
            </Row>
          </div>

          <div style={{ border: '1' }}>
            <br />
            <div className="spacebottom"></div>

            {/* DELIVERABLES   */}
            <h4>DELIVERABLES</h4>
            <hr />
            <Table columns={columnDeliverables} dataSource={dataDeliverables} />
            <div className="spacebottom" />

            {[...Array(noOfRowsDeliverables)].map((elementInArray, index) => {
              return (
                <div className="site-space-compact-wrapper" key={index}>
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name={`deliverables${index}`}
                        key={index}
                        label={index + 1}
                        rules={[
                          { required: true, message: 'Masukkan deliverables terlebih dahulu !' },
                        ]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          placeholder="Masukkan deliverables"
                          value={deliverables.deliverables}
                          onChange={(event) => {
                            handleDataDeliverables(index, event.target.value, 'deliverables')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <DatePicker
                        disabledDate={disabledDate}
                        style={{ width: '70%' }}
                        value={deliverables.date}
                        onChange={(date, datestring) =>
                          handleDataDeliverables(index, datestring, 'date')
                        }
                      />
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <button
                type="button"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowDeliverables()}
              >
                Tambah Data
              </button>
              {noOfRowsDeliverables !== 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDropRowDeliverables()}
                >
                  Hapus Baris Terakhir
                </button>
              )}
            </Col>
          </div>

          <hr />

          {/* MILESTONES */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <h4>MILESTONES</h4>
            <hr />

            <Table columns={columnMiletones} dataSource={dataMilestones} />
            <Row>
              <Col span={16}>
                {' '}
                <b>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  MILESTONES
                </b>
              </Col>
              <Col span={8}>
                {' '}
                <b>TANGGAL MULAI DAN SELESAI</b>
              </Col>
            </Row>
            {[...Array(noOfRowsMilestones)].map((elementInArray, index) => {
              return (
                <div className="site-space-compact-wrapper" key={index}>
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name={`milestones${index}`}
                        key={index}
                        style={{ width: '100%' }}
                        label={index + 1}
                        rules={[
                          { required: true, message: 'Masukkan milestones terlebih dahulu !' },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          value={milestones.deskripsi}
                          style={{ width: '100%' }}
                          placeholder="Masukkan milestones"
                          onChange={(event) => {
                            handleDataMilestones(index, event.target.value, 'deskripsi')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <RangePicker
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                        onChange={(date, datestring) => {
                          handleDataMilestones(index, datestring[0], 'tanggalmulai')
                          handleDataMilestones(index, datestring[1], 'tanggalselesai')
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <button
                type="button"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowMilestones()}
              >
                Tambah Data
              </button>
              {noOfRowsMilestones !== 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDropRowMilestones()}
                >
                  Hapus Baris Terakhir
                </button>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          {/* RENCANA CAPAIAN PERMINGGU */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <h4>RENCANA CAPAIAN PERMINGGU</h4>
            <hr />
        
            <Table columns={columnRencanaCapaianMingguan} dataSource={dataCapaianMingguan} />
            {[...Array(noOfRowsCapaianPerminggu)].map((elementInArray, index) => {
              return (
                <div className="site-space-compact-wrapper" key={index}>
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name={`capaian${index}`}
                        key={index}
                        style={{ width: '100%' }}
                        label={index + 1}
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan rencana perminggu terlebih dahulu !',
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          value={capaianPerminggu.deskripsi}
                          style={{ width: '100%' }}
                          placeholder="Masukkan rencana perminggu"
                          onChange={(event) => {
                            handleDataRencanaCapaianPerminggu(index, event.target.value, 'rencana')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <DatePicker
                        picker="week"
                        placeholder="Minggu Ke"
                        disabledDate={disabledDate}
                        size="middle"
                        style={{ width: '100%' }}
                        onChange={(date, datestring) =>
                          handleDataRencanaCapaianPerminggu(
                            index,
                            getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                            'tanggal',
                          )
                        }
                      />
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <button
                type="button"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowRencanaCapaianPerminggu()}
              >
                Tambah Data
              </button>
              {noOfRowsCapaianPerminggu !== 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDropRowRencanaCapaianPerminggu()}
                >
                  Hapus Baris Terakhir
                </button>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          {/* JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <hr />
            <h4>JADWAL PENEYELESAIAN PEKERJAAN KESELURUHAN</h4>
            {[...Array(noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan)].map(
              (elementInArray, index) => {
                return (
                  <div className="site-space-compact-wrapper" key={index}>
                    <Row>
                      {index + 1} &nbsp;&nbsp;
                      <Col span={8}>
                        <Form.Item
                          name={`penyelesaian${index}`}
                          key={index}
                          style={{ width: '100%' }}
                          rules={[
                            {
                              required: true,
                              message: 'Masukkan jadwal penyelesaian terlebih dahulu !',
                            },
                          ]}
                        >
                          <Input
                            rows={4}
                            value={jadwalPenyelesaianKeseluruhan.butirpekerjaan}
                            style={{ width: '100%' }}
                            placeholder="Butir Pekerjaan"
                            onChange={(event) => {
                              handleDataJadwalPenyelesaianKeseluruhan(
                                index,
                                event.target.value,
                                'butirpekerjaan',
                              )
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Select
                          defaultValue="Jenis Pekerjaan"
                          style={{ width: '100%' }}
                          onChange={(value) =>
                            handleDataJadwalPenyelesaianKeseluruhan(index, value, 'jenispekerjaan')
                          }
                          options={[
                            { value: 'exploration', label: 'Exploration' },
                            { value: 'design', label: 'Design' },
                            { value: 'implementasi', label: 'Implementation' },
                            { value: 'testing', label: 'Testing' },
                          ]}
                        />
                      </Col>
                      <Col span={8}>
                        <RangePicker
                          picker="week"
                          placeholder="Minggu Ke"
                          disabledDate={disabledDate}
                          size="middle"
                          style={{ width: '100%' }}
                          onChange={(date, datestring) => {
                            handleDataJadwalPenyelesaianKeseluruhan(
                              index,
                              getDateOfISOWeek(
                                datestring[0].slice(5, 7),
                                datestring[0].slice(0, 4),
                              ),
                              'minggumulai',
                            )
                            handleDataJadwalPenyelesaianKeseluruhan(
                              index,
                              getDateOfISOWeek(
                                datestring[1].slice(5, 7),
                                datestring[1].slice(0, 4),
                              ),
                              'mingguselesai',
                            )
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                )
              },
            )}
            <Col>
              <button
                type="button"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowJadwalPenyelesaianKeseluruhan()}
              >
                Tambah Data
              </button>
              {noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan !== 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDropRowJadwalPenyelesaianKeseluruhan()}
                >
                  Hapus Baris Terakhir
                </button>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          <Button type="primary" htmlType="submit" block onClick={tesHandle}>
            SUBMIT LOOGBOOK
          </Button>
        </Form>
      </div>
    </>
  )
}

export default EditRPP
