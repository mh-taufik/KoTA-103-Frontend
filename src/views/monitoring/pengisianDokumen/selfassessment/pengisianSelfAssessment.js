import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import {
  Steps,
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker,
  Spin,
  Table,
  InputNumber,
  notification,
  Popover,
  Popconfirm,
  FloatButton,
  Alert,
  Modal,
} from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { PlusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import '../rpp/rpp.css'
import { Button, Dropdown, Space } from 'antd'
import Text from 'antd/lib/typography/Text'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Box } from '@mui/material'
import { center } from 'underscore.string'
// import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const PengisianSelfAssessment = () => {
  const { TextArea } = Input
  const { RangePicker } = DatePicker
  const dateFormat = 'YYYY/MM/DD'
  const weekFormat = 'YYYY-MM-DD'
  const monthFormat = 'YYYY/MM'

  /** Manually entering any of the following formats will perform date parsing */
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
  const customFormat = (value) => `custom format: ${value.format(dateFormat)}`
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
      .endOf('week')
      .format(weekFormat)}`
  dayjs.extend(customParseFormat)
  const [dayRangeDeadlineSelfAssessment, setDayRangeDeadlineSelfAssessment] = useState()
  const NIM_PESERTA = localStorage.username
  const [idPeserta, setIdPeserta] = useState()
  const params = useParams()
  const [loadings, setLoadings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  axios.defaults.withCredentials = true
  let history = useHistory()

  const [komponenPenilaianSelfAssessment, setKomponenPenilaianSelfAssessment] = useState([])

  const [dataPengisianSelfAssessmentPeserta, setDataPengisianSelfAssessmentPeserta] = useState([])
  const [indexUpdate, setIndexUpdate] = useState()
  const [tanggalMulaiSelfAssessment, setTanggalMulaiSelfAssessment] = useState()
  const [tanggalBerakhirSelfAssessment, setTanggalBerakhirSelfAssessment] = useState()
  const [isDateAvailable, setIsDateAvailable] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [modalRubrikSelfAssessment, setModalRubrikSelfAssessment] = useState(false)

  const showRubrikSelfAssessment = () => setModalRubrikSelfAssessment(!modalRubrikSelfAssessment)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(setPageAdded) {
    setPageNumber((prevPageNumber) => prevPageNumber + setPageAdded)
  }

  function changePageBack() {
    changePage(-1)
  }

  function changePageNext() {
    changePage(+1)
  }

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  useEffect(() => {
    const getPoinPenilaianSelfAssessment = async (record, index) => {
      enterLoading(index)
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/get?type=active`,
        )
        .then((result) => {
          console.log(result.data.data)

          setKomponenPenilaianSelfAssessment(result.data.data)
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
            history.push('/500')
          }
        })
    }

    getPoinPenilaianSelfAssessment()
  }, [history])

  /** HANDLE INPUT NILAI DAN KETERANGAN */
  const handlePengisianNilaiDanKeteranganSelfAssessment = (
    index,
    value,
    idSelfAssessment,
    keyData,
  ) => {
    if (dataPengisianSelfAssessmentPeserta[index]) {
      dataPengisianSelfAssessmentPeserta[index][keyData] = value
    } else {
      dataPengisianSelfAssessmentPeserta[index] = {
        [keyData]: value,
        aspect_id: parseInt(idSelfAssessment),
      }
    }
    setDataPengisianSelfAssessmentPeserta(dataPengisianSelfAssessmentPeserta)
  }

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

    ISOweekStart.setDate(ISOweekStart.getDate() + 4) //4
    return formatDate(ISOweekStart.toDateString())
  }

  /**PENGECEKAN DATA TANGGAL */
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }
  const handleDateIsAvailable = async (tanggalmulai, tanggalselesai) => {
    await axios
      .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/check`, {
        date: tanggalmulai,
      })
      .then((res) => {
        console.log('IS DATA AVAILABLE', res.data.data)
        if (res.data.data) {
          setIsDateAvailable(false)
          notification.warning({
            message: 'Silahkan pilih minggu lain, minggu yang anda pilih telah tersedia !!!',
          })
          return false
        } else {
          let end = new Date(tanggalselesai)
          end.setDate(end.getDate() + dayRangeDeadlineSelfAssessment) //jika hari lebih dari hari ini(tanggal selesai)
          console.log('end ====', end)
          end = formatDate(new Date(end))
          let today = formatDate(new Date())
          // let day_today = new Date.getDay()

          console.log('hasil', today < end, 'today', today, '==', 'end', end)
          if (today < end) {
            setIsDateAvailable(true)
            //console.log('ses', today, end, today < end)
          } else if (today > end) {
            //console.log('ses', today, end, today > end)
            notification.warning({
              message: 'Sudah melewati deadline!!!',
            })
            setIsDateAvailable(false)
          }
        }
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

  /**SUBMIT DATA */
  const submitData = async () => {
    console.log(dataPengisianSelfAssessmentPeserta)
    console.log(dataPengisianSelfAssessmentPeserta.length, ']]]]]lenght')
    let dataPengisian = []
    let handleArrayDataPengisian = function (data) {
      for (var i in data) {
        if (data[i]) {
          dataPengisian.push(data[i])
        }
      }
    }
    handleArrayDataPengisian(dataPengisianSelfAssessmentPeserta)
    console.log('-----', dataPengisian)
    if (isDateAvailable) {
      if (dataPengisianSelfAssessmentPeserta.length < 1) {
        notification.error({
          message: 'Penambahan self assessment ditolak, karena tidak ada satupun poin yang terisi',
        })
        return
      } else {
        const data = JSON.parse(JSON.stringify(dataPengisian))
        console.log('hmmm', data)
        await axios
          .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/create`, {
            start_date: tanggalMulaiSelfAssessment,
            finish_date: tanggalBerakhirSelfAssessment,
            grade: data,
          })
          .then((response) => {
            let id = response.data.data.id
            notification.success({ message: 'Self assessment berhasil ditambahkan' })
            history.push(`/selfAssessment/formSelfAssessment/detail/${id}`)
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
    } else {
      notification.error({
        message:
          'Silahkan ubah minggu self assessment terlebih dahulu, untuk bisa melakukan submit !!!',
      })
      return
    }
  }

  // useEffect(() => {
  //   console.log('tanggal berakhir', tanggalBerakhirSelfAssessment)
  // }, [tanggalBerakhirSelfAssessment])

  useEffect(() => {
    async function GetDayRange() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all?id_deadline=2`)
        .then((response) => {
          setDayRangeDeadlineSelfAssessment(response.data.data.day_range)
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
    GetDayRange()
  }, [history])

  const handleKembaliKeRekapSelfAssessment = () => {
    history.push(`/selfAssessment`)
  }
  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <Form>
        {' '}
        <Alert
          className="spacebottom2"
          message="Informasi Pengisian Self Assessment"
          description={
            <div>
              <ul>
                <li>
                  Self Assessment : adalah penilaian peserta terhadap dirinya sendiri, atas beberapa
                  aspek yang telah ditetapkan (baca <b>rubrik</b> dengan menekan float button dengan
                  icon <FileTextOutlined /> )
                </li>
                <li>
                  Sebelum mengisi, diharapkan peserta membaca rubrik pengisian terlebih dahulu,
                  sebagai petunjuk dalam melakukan penilaian
                </li>
                <li>Pastikan minggu yang dipilih belum pernah diisi sebelumnya</li>
                <li>Pengisian hanya satu kali, anda tidak dapat melakukan edit self assesment</li>
                <li>
                  Pastikan semua keterangan terisi dan terdeskripsi dengan baik, agar nilai yang
                  diberikan juga baik
                </li>
              </ul>
            </div>
          }
          type="info"
          showIcon
        />
        <div className="container2">
          <h3 className="title-s spacetop">PENGISIAN SELF ASSESSMENT</h3>
          <div className="spacetop"></div>
          <b>PILIH MINGGU SELF ASSESSMENT &nbsp;&nbsp;&nbsp; : &nbsp;</b>
          <Space direction="vertical" size={12}>
            {/* <DatePicker defaultValue={dayjs()} format={customWeekStartEndFormat} picker="week" onChange={(date,dateString)=>{
              console.log('TANGGAL', dateString)
            }}/> */}
            <DatePicker
              picker="week"
              disabledDate={(current) => {
                return moment().add(-1, 'days') <= current
              }}
              onChange={(date, datestring) => {
                let tanggalmulai = getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4))
                let tanggalselesai = getDateOfEndWeek(
                  datestring.slice(5, 7),
                  datestring.slice(0, 4),
                )
                console.log('tanggalmulai', tanggalmulai, tanggalselesai)
                let handling = handleDateIsAvailable(tanggalmulai, tanggalselesai)
                setTanggalMulaiSelfAssessment(tanggalmulai)
                setTanggalBerakhirSelfAssessment(tanggalselesai)
              }}
              renderExtraFooter={() => 'Pilih Minggu Self Assessment'}
            />
          </Space>

          <hr className="spacetop" />

          <Row>
            <Col span={8} style={{ padding: 2, textAlign: 'center' }}>
              <h6>ASPEK PENILAIAN</h6>
            </Col>
            <Col span={4} style={{ padding: 2, textAlign: 'center' }}>
              <h6>NILAI</h6>
            </Col>
            <Col span={12} style={{ padding: 2, textAlign: 'center' }}>
              <h6>KETERANGAN</h6>
            </Col>
          </Row>
          <hr />

          {komponenPenilaianSelfAssessment.map((poinSelfAssessment, index) => {
            return (
              <>
                <Row key={poinSelfAssessment.aspect_id}>
                  <Col span={8} style={{ padding: 8 }}>
                    <Text strong>{poinSelfAssessment.aspect_name}</Text>
                  </Col>
                  <Col span={4} style={{ padding: 8, textAlign: 'center' }}>
                    <InputNumber
                      key={poinSelfAssessment.aspect_id}
                      name={`nilai` + index}
                      placeholder="nilai"
                      max={100}
                      min={0}
                      keyboard={true}
                      required
                      onChange={(e) =>
                        handlePengisianNilaiDanKeteranganSelfAssessment(
                          index,
                          e,
                          poinSelfAssessment.aspect_id,
                          'grade',
                        )
                      }
                    />
                  </Col>
                  <Col span={12} style={{ padding: 8 }}>
                    <TextArea
                      placeholder="maksimal 1000 karakter"
                      name={`keterangan` + index}
                      minLength={10}
                      keyboard={true}
                      rows={6}
                      onChange={(e) =>
                        handlePengisianNilaiDanKeteranganSelfAssessment(
                          index,
                          e.target.value,
                          poinSelfAssessment.aspect_id,
                          'description',
                        )
                      }
                    />
                  </Col>
                </Row>
              </>
            )
          })}

          <Popconfirm
            placement="topLeft"
            title={
              'Anda yakin akan submit ? pastikan sudah terisi dengan baik, karena tidak dapat edit kembali '
            }
            description={''}
            onConfirm={submitData}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="primary">Submit</Button>
          </Popconfirm>
        </div>
      </Form>

      {/* CONTOH PDF */}
      <Modal
      style={{marginLeft:350}}
        title="Rubrik Pengisian Self Assessment - Acuan Pengisian Nilai Self Asssesssment"
        footer={[
          <>
            {pageNumber > 1 && (
              <Button key={1} className="btn-pdf" type="primary" onClick={changePageBack}>
                Halaman Sebelumnya
              </Button>
            )}

            {pageNumber < numPages && (
              <Button key={2} className="btn-pdf" onClick={changePageNext} type="primary">
                Halaman Selanjutnya
              </Button>
            )}
          </>,

          // <Space wrap key={1}>

          // {pageNumber < numPages && (
          // <Button key={2} className="btn-pdf" onClick={changePageNext} type="primary">
          //   Halaman Selanjutnya
          // </Button>
          //   )}
          // </Space>
        ]}
        open={modalRubrikSelfAssessment}
        width={1050}
        onCancel={showRubrikSelfAssessment}
      >
        <Document file="/rubrikSelfAssessment.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page height="800" width={1000} pageNumber={pageNumber} />
        </Document>

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
      </Modal>

      <FloatButton
        shape="circle"
        onClick={handleKembaliKeRekapSelfAssessment}
        type="primary"
        style={{
          right: 94,
        }}
        tooltip={<div>Kembali ke Rekap Self Assessment</div>}
        icon={<ArrowLeftOutlined />}
      />
      <FloatButton
        shape="square"
        type="primary"
        style={{
          right: 24,
        }}
        onClick={showRubrikSelfAssessment}
        tooltip={<div>Rubrik Pengisian Self Assessment</div>}
      />
    </>
  )
}

export default PengisianSelfAssessment
