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
  var columns = []

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
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
        columns = [
          {
            key: response.data.data.id,
            title: response.data.data.id,
          },
        ]
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

  const onChange = (date, dateString) => {
    console.log(date, dateString)
    alert(date, dateString)
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
          <Table striped bordered hover >
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

            {formTitleContent.map((formTitle) => {
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
                        <Input type="number" name="nilai" placeholder="angka" />
                      </Col>
                      <Col className="gutter-row" span={11}>
                        <TextArea
                          placeholder="maksimal 1000 karakter"
                          name="keterangan"
                          maxLength={1000}
                        />
                      </Col>
                    </Row>
                  </>
                )
              }
            })}

            <Button type="primary">Submit</Button>
          </Table>
        </div>
      </Form>
    </>
  )
}

export default FormPengisianSelfAssessment
