import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import {
  Steps,
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker,
  Select,
  notification,
  Modal,
  Typography,
  Divider,
  Spin,
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
import { Table } from 'react-bootstrap'
import Text from 'antd/lib/typography/Text'
import { array } from 'prop-types'
import { ConnectingAirportsOutlined } from '@mui/icons-material'
import _ from 'lodash';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TextArea } = Input

const { Step } = Steps
const { RangePicker } = DatePicker

const FormPengisianSelfAssessment = () => {
  const [form1] = Form.useForm()
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(0)
  const [loadings, setLoadings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selfAssessment, setSelfAssessment] = useState([])
  let history = useHistory()
  const [formTitleContent, setFormTitleContent] = useState([])
  const [selfAssessmentPerPoin, setSelfAssessmentPerPoin] = useState([])
  const [selfAssessmentPerPoinNilai, setSelfAssessmentPerPoinNilai] = useState([])
  const [selfAssessmentPerPoinCopy, setSelfAssessmentPerPoinCopy] = useState()
  const temp = selfAssessmentPerPoin
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }


  const handleInputSelfAssessmentNilai = (indeks, ids, valuew, field) => {
    console.log('field nya : ;', field)
    var exist = selfAssessmentPerPoin.length
    console.log('data saat ini = ', exist)
    console.log(
      'index => ',
      indeks,
      '|   id=> ',
      ids,
      '|    value=>  ',
      valuew,
      '|     field=>   ',
      field,
    )
    var datakosong = false
    var idn = [ids]

    var tempt = selfAssessmentPerPoinNilai
    console.log('tempt', tempt)
    console.log('sa', selfAssessmentPerPoinNilai)

    if (selfAssessmentPerPoinNilai.length === 0) {
      setSelfAssessmentPerPoinNilai([
        ...selfAssessmentPerPoinNilai,
        {
          id: ids,
          nilai: valuew,
          keterangan:''
        },
      ])
    }

    var tempVar = selfAssessmentPerPoinNilai
    console.log('tempVar', tempVar)

    if (selfAssessmentPerPoinNilai.length > 0) {
      selfAssessmentPerPoinNilai.forEach((c, index) => {
        // let indexn = c.indexOf({id:ids});
        // console.log('index', indexn)
        console.log('data', c)
        if (idn.includes(c.id)) {
          console.log('yes')
          selfAssessmentPerPoinNilai[index].nilai = valuew
          setSelfAssessmentPerPoinNilai(selfAssessmentPerPoinNilai)
        } else {
          console.log('no')

          setSelfAssessmentPerPoinNilai([
            ...selfAssessmentPerPoinNilai,
            {
              id: ids,
              nilai: valuew,
              keterangan : ''
            },
          ])
          return
        }
      })
    }
    console.log('self assessment nilai', selfAssessmentPerPoinNilai)
  }

  const handleInputSelfAssessmentKeterangan = (indeks, ids, valuew, field) => {
    console.log('field nya : ;', field)
    var exist = selfAssessmentPerPoin.length
    console.log('data saat ini = ', exist)
    var statusData = false
    console.log(
      'index => ',
      indeks,
      '|   id=> ',
      ids,
      '|    value=>  ',
      valuew,
      '|     field=>   ',
      field,
    )
    var datakosong = false
    var idn = [ids]

    var tempt = selfAssessmentPerPoin
    console.log('tempt', tempt)
    console.log('sa', selfAssessmentPerPoin)

    if (selfAssessmentPerPoin.length === 0) {
      setSelfAssessmentPerPoin([
        ...selfAssessmentPerPoin,
        {
          id: ids,
          keterangan: valuew,
          nilai: ' '
        },
      ])
    }

    var tempVar = selfAssessmentPerPoin
    console.log('tempVar', tempVar)

    if (selfAssessmentPerPoin.length > 0) {
      selfAssessmentPerPoin.forEach((c, index) => {
        // let indexn = c.indexOf({id:ids});
        // console.log('index', indexn)
        console.log('data', c)
        if (idn.includes(c.id)) {
          console.log('yes')
          selfAssessmentPerPoin[index].keterangan = valuew
          setSelfAssessmentPerPoin(selfAssessmentPerPoin)
        } else {
          console.log('no')

          setSelfAssessmentPerPoin([
            ...selfAssessmentPerPoin,
            {
              id: ids,
              keterangan: valuew,
               nilai:''
            },
          ])
          return
        }
      })
    }
  }

  const submit = () => {
    var SetDataSA = function (temp) {
      for (var i in temp) {
        console.log('[', i, '] : ', temp[i])
      }
    }

    SetDataSA(selfAssessmentPerPoin)

    const unique = () => [...new Map(selfAssessmentPerPoin.map((m) => [m.id, m])).values()]
    var a = unique()

    
    const uniques = () => [...new Map(selfAssessmentPerPoinNilai.map((m) => [m.id, m])).values()]
    var b = uniques()

    var mergedList = _.map(selfAssessmentPerPoin, function(item){
      return _.extend(item, _.find(selfAssessmentPerPoinNilai, { id: item.id }));
  });

      //console.log('merged', mergedList)

    //pakai nilai a yak
   console.log('hasil submit Keterangan ', a)
   //console.log('hasil submit Nilai', b)
  }

  const tes = (d) => {
    console.log('this tes', d)
  }
  const getPoinPenilaianSelfAssessment = async (record, index) => {
    enterLoading(index)
    await axios
      .get(
        'http://localhost:1337/api/poinpenilaianselfassessments?filters[$or][0][status][$eq]=non active&filters[$or][1][status][$eq]=active',
      )
      .then((response) => {
        setIsLoading(false)
        setFormTitleContent(response.data.data)
        console.log('getPoinPenilaianSelfAssessment', response.data.data)
        console.log(response.data.data)
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

  const readNWriteSelfAssessment = (event) => {
    setSelfAssessment(...selfAssessment, event.target[0].value)
    event.target[0].value = ''
    console.log(selfAssessment)
    event.preventDefault()
  }

  const handleTes = (e) => {
    console.log(e)
  }

  const columnsSelfAssessment = [
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
      title: 'POIN PENILAIAN',
      dataIndex: ['attributes', 'name'],
    },
  ]

  const onChange = (date, dateString) => {
    console.log(date, dateString)
    alert(date, dateString)
  }

  const tesAjah = () => {
    console.log()
  }

  useEffect(() => {
    getPoinPenilaianSelfAssessment()
  }, [history])

  return isLoading ? (
    <Spin indicator={antIcon} />
  ) : (
    <>
      <Form>
        {' '}
        <div className="container">
          <h1 className="title-s">Form Self Assessment</h1>

          <b>Tanggal Self Assessment</b>
          <Space direction="vertical" size={12}>
            <RangePicker onChange={onChange} renderExtraFooter={() => 'extra footer'} />
          </Space>
          {/* <Space direction="vertical">
            <DatePicker onChange={onChange} picker="week" />
          </Space> */}
          <hr />
          <Table striped bordered hover>
            <Row color="blue" gutter={16}>
              <Col className="gutter-row" span={8}>
                <h6>Aspek Penilaian</h6>
              </Col>
              <Col className="gutter-row" span={8}>
                <h6>Nilai</h6>
              </Col>
              <Col className="gutter-row" span={8}>
                <h6>Keterangan</h6>
              </Col>
            </Row>
            {/* 
            {[...formTitleContent].map((element, index) => {
              return (
                <div key={index}>
                  <form>
                    <input name=''></input>
                  </form>
                </div>
              )
            })} */}
            {formTitleContent.map((formTitle, index) => {
              if (formTitle.attributes.status === 'non active') {
                return (
                  <>
                    <Row gutter={16} className="row-self-assessment">
                      <Col className="gutter-row" span={8}>
                        <Text strong>{formTitle.attributes.poinpenilaian}</Text>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Input
                          type="number"
                          name="nilai"
                          placeholder="belum diizinkan untuk mengisi"
                          disabled
                          onChange={(e) => handleTes(e.target.value)}
                        />
                      </Col>
                      <Col className="gutter-row" span={11}>
                        <TextArea
                          placeholder="belum diizinkan untuk mengisi"
                          disabled
                          maxLength={1000}
                          name="keterangan"
                        />
                      </Col>
                    </Row>
                  </>
                )
              } else {
                return (
                  <>
                    <Row gutter={16} className="row-self-assessment">
                      <Col className="gutter-row" span={8}>
                        <Text strong>{formTitle.attributes.poinpenilaian}</Text>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <Input
                          type="number"
                       
                          name={`${formTitle.id}-nilai`}
                          placeholder="angka"
                          onChange={(e) =>
                             handleInputSelfAssessmentNilai(index, formTitle.id, e.target.value, 'nilai')
                       
                          }
                        />
                      </Col>
                      <Col className="gutter-row" span={11}>
                        <TextArea
                          placeholder="maksimal 1000 karakter"
                          name={`${formTitle.id}-keterangan`}
                     
                          onChange={(e) =>
                            handleInputSelfAssessmentKeterangan(
                              index,
                              formTitle.id,
                              e.target.value,
                              'keterangan',
                            )
                          }
                          maxLength={1000}
                        />
                      </Col>
                    </Row>
                  </>
                )
              }
            })}

            <Button type="primary" onClick={submit}>
              Submit
            </Button>
          </Table>
        </div>
      </Form>
    </>
  )
}

export default FormPengisianSelfAssessment
