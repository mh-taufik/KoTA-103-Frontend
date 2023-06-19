import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import moment from 'moment'
import {
  Button,
  Col,
  DatePicker,
  FloatButton,
  Input,
  Popover,
  Row,
  Select,
  Space,
  notification,
} from 'antd'
import './rpp.css'
import { Form, Modal, message } from 'antd'
import { SentimentVeryDissatisfiedOutlined, TextSnippetSharp } from '@mui/icons-material'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Box } from '@mui/material'
import axios from 'axios'

const { TextArea } = Input
const PengisianRpp = () => {
  dayjs.extend(customParseFormat)
  dayjs.extend(weekOfYear)
  const dateFormat = 'YYYY-MM-DD'
  const weekFormat = 'MM/DD'
  axios.defaults.withCredentials = true
  const monthFormat = 'YYYY/MM'
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
  const customFormat = (value) => `custom format: ${value.format(dateFormat)}`
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
      .endOf('week')
      .format(weekFormat)}`

  let history = useHistory()
  /**LIMIT PANGURANGAN HARI DALAM MINGGU */
  const [limitMinusDay, setLimitMinusDay] = useState()

  const { RangePicker } = DatePicker
  const NIM_PESERTA = localStorage.username
  const [form] = Form.useForm()
  const [loadings, setLoadings] = useState([])
  const [dataPeserta, setDataPeserta] = useState([])
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
  const [idNewRpp, setIdNewRpp] = useState()
  const [isSuccessInput, setIsSuccessInput] = useState(true)
  const [submitAccepted, setSubmitAccepted] = useState()

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

  /** USE EFFECT */
  useEffect(() => {
    console.log('NIM PESERTA ', NIM_PESERTA)
    // getInformasiDataPeserta()
  }, history)

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
    let newField = { deliverables: '', due_date: '' }
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
    let newField = {description: '', start_date: '', finish_date: '' }
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
    let newField = { start_date: '', finish_date: '', achievement_plan: '' }
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
    let newField = { start_date: '', finish_date: '', task_name: '', task_type: '' }
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
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    var ISOweekStart = simple
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }

    ISOweekStart = new Date(ISOweekStart)
    return formatDate(ISOweekStart.toDateString())
    // console.log(ISOweekStart)
  }

  function getDateOfEndWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    console.log('dow =>', dow)
    var ISOweekStart = simple
    console.log('dow =>', ISOweekStart)
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }

    ISOweekStart.setDate(ISOweekStart.getDate() + 4)
    return formatDate(ISOweekStart.toDateString())
  }

  /** HANDLE RANGE DATE SAAT MEMILIH  */
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day')
  }

  const createDataRPP = async () => {
    console.log(submitAccepted)
    if (submitAccepted) {
      const jsonDataDeliverables = JSON.parse(JSON.stringify(deliverables))
      const jsonDataMilestones = JSON.parse(JSON.stringify(milestones))
      const jsonDataRencanaPerminggu = JSON.parse(JSON.stringify(capaianPerminggu))
      const jsonDataJadwalPenyelesaianKeseluruhan = JSON.parse(
        JSON.stringify(jadwalPenyelesaianKeseluruhan),
      )

      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/create`, {
          start_date: tanggalMulaiPekerjaan,
          finish_date: tanggalBerakhirPekerjaan,
          work_title: topikPekerjaan,
          task_description: deskripsiTugas,
          group_role: peranDalamPekerjaan,
          completion_schedules: jsonDataJadwalPenyelesaianKeseluruhan,
          deliverables: jsonDataDeliverables,
          milestones: jsonDataMilestones,
          weekly_achievement_plans: jsonDataRencanaPerminggu,
        })
        .then((result) => {
          notification.success({
            message: 'Data RPP Berhasil Ditambahkan',
          })
        })
        .catch(function (error) {
          setIsSuccessInput(false)
          if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
            history.push({
              pathname: '/login',
              state: {
                session: true,
              },
            })
          } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
            history.push('/404')
          } else if (error.toJSON().status > 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    } else {
      notification.warning({ message: 'Pastikan Semua Data Terisi !!! ' })
    }
    
  }

  /** HANDLE TAMBAH RPP */
  const handleSubmitRPP = async () => {

    let accept_to_submit 


    if (deliverables.length < 1) {
      notification.warning({ message: 'Isi Deliverables Terlebih Dahulu' })
      setSubmitAccepted(false)
      accept_to_submit = false
    } else {
      setSubmitAccepted(true)
      accept_to_submit = true
    }

    if (milestones.length < 1) {
      notification.warning({ message: 'Isi Milestones Terlebih Dahulu' })
      setSubmitAccepted(false)
      accept_to_submit = false
    } else {
      setSubmitAccepted(true)
      accept_to_submit = true
    }

    if (capaianPerminggu.length < 1) {
      notification.warning({ message: 'Isi Rencana Capaian Perminggu Terlebih Dahulu' })
      setSubmitAccepted(false)
      accept_to_submit = false
    } else {
      setSubmitAccepted(true)
      accept_to_submit = true
    }

    if (jadwalPenyelesaianKeseluruhan.length < 1) {
      notification.warning({ message: 'Isi Jadwal Penyelesaian Keseluruhan Terlebih Dahulu' })
      setSubmitAccepted(false)
      accept_to_submit = false
    } else {
      setSubmitAccepted(true)
      accept_to_submit = true
    }

    if (accept_to_submit) {
      const jsonDataDeliverables = JSON.parse(JSON.stringify(deliverables))
      const jsonDataMilestones = JSON.parse(JSON.stringify(milestones))
      const jsonDataRencanaPerminggu = JSON.parse(JSON.stringify(capaianPerminggu))
      const jsonDataJadwalPenyelesaianKeseluruhan = JSON.parse(
        JSON.stringify(jadwalPenyelesaianKeseluruhan),
      )

      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/create`, {
          start_date: tanggalMulaiPekerjaan,
          finish_date: tanggalBerakhirPekerjaan,
          work_title: topikPekerjaan,
          task_description: deskripsiTugas,
          group_role: peranDalamPekerjaan,
          completion_schedules: jsonDataJadwalPenyelesaianKeseluruhan,
          deliverables: jsonDataDeliverables,
          milestones: jsonDataMilestones,
          weekly_achievement_plans: jsonDataRencanaPerminggu,
        })
        .then((response) => {
          console.log(response.data.data)
          console.log(response.data.data.id)
          let id_new = response.data.data.id
          notification.success({
            message: 'Data RPP Berhasil Ditambahkan',
          })
          setTimeout(1200)
          history.push(`/rencanaPenyelesaianProyek/detail/${id_new}`)
       
        })
        .catch(function (error) {
          setIsSuccessInput(false)
          if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
            history.push({
              pathname: '/login',
              state: {
                session: true,
              },
            })
          } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
            history.push('/404')
          } else if (error.toJSON().status > 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    } else {
      notification.warning({ message: 'Pastikan Semua Data Terisi !!! ' })
    }
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const aksiLihatLebihJelasRPP = () => {
    history.push(`/rencanaPenyelesaianProyek/peserta/formPengisianRPP/contohPengisianRPP`)
  }

 
  return (
    <>
      <div className="container">
        <Space>
          <Modal
            title="Format Pengisian Dokumen RPP"
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
            {/* <li>Pastikan semua RPP terisi</li> */}
            <li>Isi sesuai dengan perencanaan proyek yang diberikan</li>
            <li>Anda dapat melihat contoh pengisian RPP dengan menekan float button</li>
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
          onFinish={handleSubmitRPP}
          onFinishFailed={onFinishFailed}
        >
          <div>
            <Form.Item
              labelAlign="left"
              name="tanggalMulai1"
              key={51002}
              label="Tanggal Mulai Pengerjaan"
              rules={[
                {
                  required: true,
                  message: 'Masukkan tanggal pengerjaan terlebih dahulu !',
                },
                {
                  type: 'datepicker',
                  warningOnly: 'true',
                },
              ]}
            >
          
                <RangePicker
                  format="YYYY-MM-DD"
                 
                  disabledDate={(current) => {
                    if (new Date().getDay() === 0) {
                      setLimitMinusDay(7)
                    } else {
                      setLimitMinusDay(new Date().getDay())
                    }

                    return (
                      moment().add(-1, 'days') >= current ||
                      moment().add(7 - limitMinusDay, 'days') >= current
                    )
                  }}
                  onChange={(date, datestring) => handleInputTanggalPengerjaan(datestring)}
                />
           
            </Form.Item>

            <Form.Item
              labelAlign="left"
              name="topikPekerjaan"
              label="Tema/Topik/Judul Pekerjaan"
              rules={[{ required: true, message: 'Masukkan tema pekerjaan terlebih dahulu !' }]}
            >
              <Input
                placeholder="Masukkan tema/topik/judul pekerjaan"
                onChange={(e) => setTopikPekerjaan(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              name="peranDalamPekerjaan"
              label="Peran Dalam Pekerjaan"
              rules={[
                { required: true, message: 'Masukkan peran dalam pekerjaan terlebih dahulu !' },
              ]}
            >
              <Input
                placeholder="Masukkan peran dalam pekerjaan"
                onChange={(e) => setPeranDalamPekerjaan(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              labelAlign="left"
              name="deskripsiTugas"
              label="Deskripsi Tugas"
              rules={[{ required: true, message: 'Masukkan deskripsi tugas terlebih dahulu !' }]}
            >
              <TextArea
              rows={5}
                placeholder="Masukkan deskripsi tugas"
                onChange={(e) => setDeskripsiTugas(e.target.value)}
              />
            </Form.Item>
          </div>

          <div style={{ border: '1' }}>
            <br />
            <div className="spacebottom"></div>

            {/* DELIVERABLES   */}
            <hr />
            <h4>DELIVERABLES</h4>
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
                      <Form.Item
                        name={`tanggaldeliverables${index}`}
                        key={index}
                        label="Tanggal"
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan tanggal deliverables terlebih dahulu !',
                          },
                          {
                            type: 'date',
                            warningOnly: 'true',
                          },
                        ]}
                      >
                        <DatePicker
                             disabledDate={(current) => {
                              if (new Date().getDay() === 0) {
                                setLimitMinusDay(7)
                              } else {
                                setLimitMinusDay(new Date().getDay())
                              }
          
                              return (
                                moment().add(-1, 'days') >= current ||
                                moment().add(7 - limitMinusDay, 'days') >= current
                              )
                            }}
                          style={{ width: '70%' }}
                          value={deliverables.date}
                          onChange={(date, datestring) =>
                            handleDataDeliverables(index, datestring, 'due_date')
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <Button
                type="primary"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowDeliverables()}
              >
                Tambah Data
              </Button>
              {noOfRowsDeliverables !== 0 && (
                <Button type="primary" danger onClick={() => handleDropRowDeliverables()}>
                  Hapus Baris Terakhir
                </Button>
              )}
            </Col>
          </div>

          <hr />

          {/* MILESTONES */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <hr />
            <h4>MILESTONES</h4>
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
                            handleDataMilestones(index, event.target.value, 'description')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={`tanggalmilestones${index}`}
                        key={index}
                        label="Tanggal"
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan tanggal milestones terlebih dahulu !',
                          },
                          {
                            type: 'datepicker',
                            warningOnly: 'true',
                          },
                        ]}
                      >
                        <RangePicker
                          style={{ width: '100%' }}
                          disabledDate={(current) => {
                            if (new Date().getDay() === 0) {
                              setLimitMinusDay(7)
                            } else {
                              setLimitMinusDay(new Date().getDay())
                            }
        
                            return (
                              moment().add(-1, 'days') >= current ||
                              moment().add(7 - limitMinusDay, 'days') >= current
                            )
                          }}
                          format={dateFormat}
                          onChange={(date, datestring) => {
                            handleDataMilestones(index, datestring[0], 'start_date')
                            handleDataMilestones(index, datestring[1], 'finish_date')
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <Button
                type="primary"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowMilestones()}
              >
                Tambah Data
              </Button>
              {noOfRowsMilestones !== 0 && (
                <Button type="primary" danger onClick={() => handleDropRowMilestones()}>
                  Hapus Baris Terakhir
                </Button>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          {/* RENCANA CAPAIAN PERMINGGU */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <hr />
            <h4>RENCANA CAPAIAN PERMINGGU</h4>
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
                            message: 'Masukkan tanggal milestones terlebih dahulu !',
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          value={capaianPerminggu.deskripsi}
                          style={{ width: '100%' }}
                          placeholder="Masukkan rencana perminggu"
                          onChange={(event) => {
                            handleDataRencanaCapaianPerminggu(
                              index,
                              event.target.value,
                              'achievement_plan',
                            )
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={`tanggalcapaianmingguan${index}`}
                        key={index}
                        label="Tanggal"
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan tanggal rencana terlebih dahulu !',
                          },
                          {
                            type: 'date',
                            warningOnly: 'true',
                          },
                        ]}
                      >
                        <DatePicker
                          picker="week"
                          placeholder="Minggu Ke"
                          disabledDate={(current) => {
                            if (new Date().getDay() === 0) {
                              setLimitMinusDay(7)
                            } else {
                              setLimitMinusDay(new Date().getDay())
                            }
        
                            return (
                              moment().add(-1, 'days') >= current ||
                              moment().add(7 - limitMinusDay, 'days') >= current
                            )
                          }}
                          size="middle"
                          style={{ width: '100%' }}
                          onChange={(date, datestring) => [
                            handleDataRencanaCapaianPerminggu(
                              index,
                              getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                              'start_date',
                            ),
                            handleDataRencanaCapaianPerminggu(
                              index,
                              getDateOfEndWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                              'finish_date',
                            ),
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <Button
                type="primary"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowRencanaCapaianPerminggu()}
              >
                Tambah Data
              </Button>
              {noOfRowsCapaianPerminggu !== 0 && (
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDropRowRencanaCapaianPerminggu()}
                >
                  Hapus Baris Terakhir
                </Button>
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
            <h4>JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN</h4>
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
                            style={{ width: '100%', padding: 20 }}
                            placeholder="Butir Pekerjaan"
                            onChange={(event) => {
                              handleDataJadwalPenyelesaianKeseluruhan(
                                index,
                                event.target.value,
                                'task_name',
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
                            handleDataJadwalPenyelesaianKeseluruhan(index, value, 'task_type')
                          }
                          options={[
                            { value: 'Exploration', label: 'Exploration' },
                            { value: 'Analysis', label: 'Analysis' },
                            { value: 'Design', label: 'Design' },
                            { value: 'Implementation', label: 'Implementation' },
                            { value: 'Testing', label: 'Testing' },
                          ]}
                        />
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={`tanggaljadwal${index}`}
                          key={index}
                          label="Tanggal"
                          rules={[
                            {
                              required: true,
                              message: 'Masukkan tanggal jadwal penyelesaian terlebih dahulu !',
                            },
                            {
                              type: 'datepicker',
                              warningOnly: 'true',
                            },
                          ]}
                        >
                          <RangePicker
                            picker="week"
                            placeholder="Minggu Ke"
                            disabledDate={(current) => {
                              if (new Date().getDay() === 0) {
                                setLimitMinusDay(7)
                              } else {
                                setLimitMinusDay(new Date().getDay())
                              }
          
                              return (
                                moment().add(-1, 'days') >= current ||
                                moment().add(7 - limitMinusDay, 'days') >= current
                              )
                            }}
                            size="middle"
                            style={{ width: '100%', paddingLeft: 20 }}
                            onChange={(date, datestring) => {
                              handleDataJadwalPenyelesaianKeseluruhan(
                                index,
                                getDateOfISOWeek(
                                  datestring[0].slice(5, 7),
                                  datestring[0].slice(0, 4),
                                ),
                                'start_date',
                              )
                              handleDataJadwalPenyelesaianKeseluruhan(
                                index,
                                getDateOfEndWeek(
                                  datestring[1].slice(5, 7),
                                  datestring[1].slice(0, 4),
                                ),
                                'finish_date',
                              )
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
            )}
            <Col>
              <Button
                type="primary"
                className="btn btn-primary me-6 btn-sm"
                onClick={() => handleAddRowJadwalPenyelesaianKeseluruhan()}
              >
                Tambah Data
              </Button>
              {noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan !== 0 && (
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDropRowJadwalPenyelesaianKeseluruhan()}
                >
                  Hapus Baris Terakhir
                </Button>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          <Row>
            <Col span={24}>
              <Popover content={<div>Lakukan pengumpulan RPP</div>}>
                <Button type="primary" htmlType="submit">
                  SUBMIT RPP
                </Button>
              </Popover>
            </Col>
          </Row>
        </Form>
      </div>
      <>
        <FloatButton
          shape="circle"
          type="primary"
          style={{
            right: 94,
          }}
          onClick={() => {
            history.push(`/rencanaPenyelesaianProyek`)
          }}
          tooltip={<div>Kembali ke Rekap RPP</div>}
          icon={<ArrowLeftOutlined />}
        />
        <FloatButton
          shape="square"
          type="primary"
          style={{
            right: 24,
          }}
          onClick={showModal}
          tooltip={<div>Contoh Pengisian RPP</div>}
        />
      </>
    </>
  )
}

export default PengisianRpp
