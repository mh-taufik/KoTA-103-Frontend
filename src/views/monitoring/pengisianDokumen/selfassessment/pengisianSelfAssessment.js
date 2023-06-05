import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import {ArrowLeftOutlined } from '@ant-design/icons';
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
import _ from 'lodash'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Box } from '@mui/material'
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TextArea } = Input
const { Step } = Steps
const { RangePicker } = DatePicker

const FormPengisianSelfAssessment = () => {
  dayjs.extend(customParseFormat)
  const NIM_PESERTA = localStorage.username
  const [idPeserta, setIdPeserta] = useState()
  const params = useParams()
  const [loadings, setLoadings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  let history = useHistory()
  const [komponenPenilaianSelfAssessment, setKomponenPenilaianSelfAssessment] = useState([])
  const [dataPengisianSelfAssessmentPeserta, setDataPengisianSelfAssessmentPeserta] = useState([])
  const [indexUpdate, setIndexUpdate] = useState()
  const [tanggalMulaiSelfAssessment, setTanggalMulaiSelfAssessment] = useState()
  const [tanggalBerakhirSelfAssessment, setTanggalBerakhirSelfAssessment] = useState()
  const [newIdSelfAssessment, setNewIdSelfAssessment] = useState()
  const [isSuccessSubmit, setIsSuccessSubmit] = useState()
  const defaultType = '-'
  const defaultNum = 0
  /** JIKA TRUE BERARTI TANGGAL NYA GAADA DI DATA */
  const [isDateAvailable, setIsDateAvailable] = useState(false)

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  /** HANDLE RANGE DATE SAAT MEMILIH  */
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day')
  }

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
        id: idSelfAssessment,
      }
    }
    setDataPengisianSelfAssessmentPeserta(dataPengisianSelfAssessmentPeserta)
  }

  useEffect(() => {
    console.log('hasil pengisian SA', dataPengisianSelfAssessmentPeserta)
  }, [dataPengisianSelfAssessmentPeserta])

  /** API */

  const getInformasiDataPeserta = async () => {
    await axios
      .get(`http://localhost:1337/api/pesertas?filters[username][$eq]=${NIM_PESERTA}`)
      .then((response) => {
        // setIdPeserta(response.data.data)
        console.log('data peserta', response.data.data[0])
        setIdPeserta(response.data.data[0].id)
      })
  }

  const submitData = async () => {
  
   
    console.log(dataPengisianSelfAssessmentPeserta)
    if (isDateAvailable) {
      if(dataPengisianSelfAssessmentPeserta.length < 1){
        notification.error({message:'Penambahan self assessment ditolak, karena tidak ada satupun poin yang terisi'})
      }else{
        
      let dateToday = new Date()
      function formatDate(date) {
        var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-')
      }
      await axios
        .post(`http://localhost:1337/api/selfassessments`, {
          data: {
            tanggalmulai: tanggalMulaiSelfAssessment,
            tanggalselesai: tanggalBerakhirSelfAssessment,
            tanggal_pengumpulan: formatDate(dateToday),
            peserta: {
              connect: [idPeserta],
            },
          },
        })
        .then((response) => {
          console.log('response new self assessment', response.data.data)
          console.log('response new self assessment ID', response.data.data.id)
          setNewIdSelfAssessment(response.data.data.id)
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
    }
  }

const handleSuccessSubmit = (idSelfAssessment) =>{
  notification.success({
    message: 'Data self assessment berhasil ditambahkan',
  })
  history.push(`/selfAssessment/formSelfAssessment/detail/${idSelfAssessment}`)
}

  useEffect(() => {
    console.log('ID BARU', newIdSelfAssessment)

    const inputNilaiDanKeteranganSelfAssessment = async (data, idSelfAssessment) => {

      let a = 0
      let stop = data.length - 1

      for (var i in data) {
        let res = true
       
      
        await axios
          .post('http://localhost:1337/api/selfasspoins', {
            data: {
              nilai: data[i].nilai,
              keterangan: data[i].keterangan,
              selfassessment: {
                connect: [idSelfAssessment],
              },
              poinpenilaianselfassessment: {
                connect: [data[i].id],
              },
            },
          })
          .then((response) => {
            console.log('HASIL ISI SA POIN', response.data.data)
            res = true
         
           
          })
          .catch(function (error) {
            setIsSuccessSubmit(false)
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
          
          console.log('i ', i, ' dan ', 'a ', a,  ' ','type', typeof(a), typeof(i), a === parseInt(i), res,  '--', a === parseInt(i) && res)
          if(stop === parseInt(i) && res ){
            handleSuccessSubmit(idSelfAssessment)
          }

          a++
      }

     
     
    }

    inputNilaiDanKeteranganSelfAssessment(dataPengisianSelfAssessmentPeserta, newIdSelfAssessment)
  }, [newIdSelfAssessment])

  useEffect(() => {
    console.log('tanggal berakhir', tanggalBerakhirSelfAssessment)
  }, [tanggalBerakhirSelfAssessment])

  const onChange = (date, dateString) => {
    console.log(date, dateString)
    alert(date, dateString)
  }

  useEffect(() => {
    const getPoinPenilaianSelfAssessment = async (record, index) => {
      enterLoading(index)
      await axios
        .get(
          'http://localhost:1337/api/poinpenilaianselfassessments?filters[$or][0][status][$eq]=non active&filters[$or][1][status][$eq]=active',
        )
        .then((response) => {
          setIsLoading(false)
          let temp = []
          let temp1 = response.data.data
          let getTempPoinPenilaianSelfAssessment = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                poinpenilaian: obj[i].attributes.poinpenilaian,
                status: obj[i].attributes.status,
                tanggalmulaipengisian: obj[i].attributes.tanggalmulaipengisian,
              })
            }
          }
          getTempPoinPenilaianSelfAssessment(temp1)
          setKomponenPenilaianSelfAssessment(temp)
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
    getInformasiDataPeserta()
  }, [history])

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

    ISOweekStart.setDate(ISOweekStart.getDate() + 4)
    return formatDate(ISOweekStart.toDateString())
  }

  const handleDateIsAvailable = async (tanggalmulai,tanggalselesai) => {
    await axios
      .get(
        `http://localhost:1337/api/selfassessments?populate=*&filters[peserta][username]=${NIM_PESERTA}&filters[tanggalmulai]=${tanggalmulai}`,
      )
      .then((res) => {
        console.log('IS DATA AVAILABLE', res.data.data)

        let result = res.data.data
        if (result.length > 0) {
          setIsDateAvailable(false)
          notification.warning({
            message: 'Silahkan pilih minggu lain, minggu yang anda pilih telah tersedia !!!',
          })
          return false
        } else {
          // setIsDateAvailable(true)
          // return true
          let end= new Date(tanggalselesai)
          end.setDate(end.getDate()+1) //jika hari lebih dari hari ini
          end = new Date(end)
          let today = new Date()
          // console.log('are', today <= end, today,end)
          if(today < end){
            setIsDateAvailable(true)
            console.log('ses', today, end, today < end)
          }else if(today > end){
            console.log('ses', today, end, today > end)
            notification.warning({
              message:'Sudah melewati deadline!!!'
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


  const handleKembaliKeRekapSelfAssessment = () => {
    history.push(`/selfAssessment`)
  }
  return isLoading ? (
    <Spin indicator={antIcon} />
  ) : (
    <>
      {/* <Button onClick={tes}>tes</Button> */}
      <Form>
        {' '}
        <div className="container">
         
        
       
          <h3 className="title-s spacetop">PENGISIAN SELF ASSESSMENT</h3>
          <Box sx={{ color: 'warning.main' }}>
            <ul>
              <li>Pastikan minggu yang dipilih belum pernah diisi sebelumnya</li>
              <li>Pengisian hanya satu kali, anda tidak dapat melakukan edit self assesment</li>
              <li>
                Pastikan semua keterangan terisi dan terdeskripsi dengan baik, agar nilai yang
                diberikan juga baik
              </li>
            </ul>
          </Box>
          <div className="spacetop"></div>
          <b>PILIH MINGGU SELF ASSESSMENT &nbsp;&nbsp;&nbsp; : &nbsp;</b>
          <Space direction="vertical" size={12}>
            <DatePicker
              picker="week"
              disabledDate={(current)=>{
                return moment().add(-1, 'days')  >= current || current.isAfter(moment())
              }}
              onChange={(date, datestring) => {
                let tanggalmulai = getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4))
                let tanggalselesai = getDateOfEndWeek(datestring.slice(5, 7), datestring.slice(0, 4))
                let handling = handleDateIsAvailable(tanggalmulai,tanggalselesai)
                setTanggalMulaiSelfAssessment(
                  getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                )
                setTanggalBerakhirSelfAssessment(
                  getDateOfEndWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                )
              }}
              renderExtraFooter={() => 'Pilih Minggu Self Assessment'}
            />
          </Space>

          <hr className="spacetop" />

          <Row>
            {/* <Col span={2}><h6>NO</h6></Col> */}
            <Col span={8} style={{ padding: 2 }}>
              <h6>ASPEK PENILAIAN</h6>
            </Col>
            <Col span={4} style={{ padding: 2 }}>
              <h6>NILAI</h6>
            </Col>
            <Col span={12} style={{ padding: 2 }}>
              <h6>KETERANGAN</h6>
            </Col>
          </Row>
          <hr />

          {komponenPenilaianSelfAssessment.map((poinSelfAssessment, index) => {
            if (poinSelfAssessment.status === 'non active') {
              return (
                <>
                  <Row key={poinSelfAssessment.id}>
                    <Col span={8} style={{ padding: 8 }}>
                      <Text strong>{poinSelfAssessment.poinpenilaian}</Text>
                    </Col>

                    <Col span={4} style={{ padding: 8 }}>
                      <Input
                        type="number"
                        name={`nilai` + index}
                        placeholder="belum diizinkan untuk mengisi"
                        disabled
                      />
                    </Col>

                    <Col span={12} style={{ padding: 8 }}>
                      <TextArea
                        placeholder="belum diizinkan untuk mengisi"
                        disabled
                        maxLength={1000}
                        name={`keterangan` + index}
                      />
                    </Col>
                  </Row>
                </>
              )
            } else {
              return (
                <>
                  <Row key={poinSelfAssessment.id}>
                    <Col span={8} style={{ padding: 8 }}>
                      <Text strong>{poinSelfAssessment.poinpenilaian}</Text>
                    </Col>
                    <Col span={4} style={{ padding: 8 }}>
                      <InputNumber
                        name={`nilai` + index}
                        placeholder="nilai"
                        onChange={(e) =>
                          handlePengisianNilaiDanKeteranganSelfAssessment(
                            index,
                            e,
                            poinSelfAssessment.id,
                            'nilai',
                          )
                        }
                      />
                    </Col>
                    <Col span={12} style={{ padding: 8 }}>
                      <TextArea
                        placeholder="maksimal 1000 karakter"
                        name={`keterangan` + index}
                        maxLength={1000}
                        onChange={(e) =>
                          handlePengisianNilaiDanKeteranganSelfAssessment(
                            index,
                            e.target.value,
                            poinSelfAssessment.id,
                            'keterangan',
                          )
                        }
                      />
                    </Col>
                  </Row>
                </>
              )
            }
          })}

          {/* <Button type="primary" onClick={submitData} htmlType="submit">
            Submit
          </Button> */}
          <Popconfirm
            placement="topLeft"
            title={'Anda yakin akan submit ? pastikan sudah terisi dengan baik, karena tidak dapat edit kembali '}
            description={''}
            onConfirm={submitData}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Popconfirm>
        </div>
      </Form>
      <FloatButton type='primary' onClick={handleKembaliKeRekapSelfAssessment} icon={<ArrowLeftOutlined />} tooltip={<div>Kembali ke Rekap Self Assessment</div>} />




    </>
  )
}

export default FormPengisianSelfAssessment
