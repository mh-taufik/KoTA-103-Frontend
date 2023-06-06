import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Space,
  notification,
  Spin,
  Select,
  Popover,
  DatePicker,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import '../pengisianDokumen/rpp/rpp.css'
import { Option } from 'antd/lib/mentions'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const PengelolaanDeadline = () => {
  const [dataDeadline, setDataDeadline] = useState([])
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([])
  let history = useHistory()
  const [dataEdit, setDataEdit] = useState([])
  const [dataDeadlineEdit, setDataDeadlineEdit] = useState([])
  const [top, setTop] = useState(10)
  const [bottom, setBottom] = useState(10)

  axios.defaults.withCredentials = true
  const [isModalOpen, setIsModalOpen] = useState(false)



  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleDeadlineEdit = (idDeadline,deadlineName, dataValue, keyData, dataIndex) => {
    if (dataDeadlineEdit[dataIndex]) {
      dataDeadlineEdit[dataIndex][keyData] = dataValue
    } else {
      dataDeadlineEdit[dataIndex] = {
        id_deadline: idDeadline,
        nama_deadline : deadlineName,
        [keyData]: dataValue,
      }
    }
    setDataDeadlineEdit(dataDeadlineEdit)
  }

  async function putDataDeadlineUpdate() {
    console.log('DATA UPDATE', dataDeadlineEdit)
    for(var i in dataDeadlineEdit){
      await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/update`,{
        'day_range' : dataDeadlineEdit[i].rentang_hari,
        'id':dataDeadlineEdit[i].id_deadline,
        'finish_assignment_date' :dataDeadlineEdit[i].tanggal_selesai,
        'start_assignment_date' : dataDeadlineEdit[i].tanggal_dimulai,
        'name' : dataDeadlineEdit[i].nama_deadline

       
      }).then((result)=>{
        console.log(result)
      })
    }
   

    // refreshData()
  }

  const refreshData = async (index) => {
    await axios.get('http://localhost:1337/api/deadlines').then((res) => {
      console.log('reas', res.data.data)
      let temp = res.data.data
      let temp1 = []

      temp1 = {
        logbook_id: temp[0].id,
        rpp_id: temp[1].id,
        self_assessment_id: temp[2].id,
        laporan_id: temp[3].id,
        logbook_name: temp[0].attributes.name,
        rpp_name: temp[1].attributes.name,
        self_assessment_name: temp[2].attributes.name,
        laporan_name: temp[3].attributes.name,
        logbook_rentang_hari: temp[0].attributes.rentanghari,
        rpp_rentang_hari: temp[1].attributes.rentanghari,
        self_assessment_rentang_hari: temp[2].attributes.rentanghari,
        laporan_rentang_hari: temp[3].attributes.rentanghari,
        logbook_tanggal: temp[0].attributes.tanggalpengumpulandibuka,
        rpp_tanggal: temp[1].attributes.tanggalpengumpulandibuka,
        self_assessment_tanggal: temp[2].attributes.tanggalpengumpulandibuka,
        laporan_tanggal: temp[3].attributes.tanggalpengumpulandibuka,
      }

      console.log(temp1)
      setDataDeadline(temp1)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }

  useEffect(() => {
    async function getDataDeadline() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all`)
        .then((res) => {
          console.log('res', res.data.data)
          let temp = res.data.data
          let temp1 = []

          temp1 = {
            logbook_id: temp[0].id,
            rpp_id: temp[1].id,
            self_assessment_id: temp[2].id,
            laporan_id: temp[3].id,

            logbook_name: temp[0].name,
            rpp_name: temp[1].name,
            self_assessment_name: temp[2].name,
            laporan_name: temp[3].name,

            logbook_rentang_hari: temp[0].day_range,
            rpp_rentang_hari: temp[1].day_range,
            self_assessment_rentang_hari: temp[2].day_range,
            laporan_rentang_hari: temp[3].day_range,

            logbook_tanggal_mulai: temp[0].start_assignment_date,
            rpp_tanggal_mulai: temp[1].start_assignment_date,
            self_assessment_tanggal_mulai: temp[2].start_assignment_date,
            laporan_tanggal_mulai: temp[3].start_assignment_date,

            logbook_tanggal_selesai: temp[0].finish_assignment_date,
            rpp_tanggal_selesai: temp[1].finish_assignment_date,
            self_assessment_tanggal_selesai: temp[2].finish_assignment_date,
            laporan_tanggal_selesai: temp[3].finish_assignment_date,
          }
          console.log(temp1)
          setDataDeadline(temp1)
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
    getDataDeadline()
  }, [history])

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <div className="container2">
        <h4 className="justify spacebottom">
          PENGELOLAAN BATAS DEADLINE (LOCK PENGUMPULAN DOKUMEN)
        </h4>
        <Typography component="div" variant="body1" className="spacebottom">
          <Box sx={{ color: 'warning.main' }}>
            <ul style={{ fontSize: 14 }}>
              <li>Pengaturan deadline untuk 3 dokumen : logbook, self assesment, laporan</li>
              <li>Deadline diatur dalam hitungan hari</li>
              <li>
                Deadline adalah batas akhir pengumpulan, dimana kemudian akan dilakukan lock
                pengumpulan
              </li>
            </ul>
          </Box>
        </Typography>

        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          // onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          fields={[
            {
              name: ['logbook_name'],
              value: dataDeadline.logbook_name,
            },
            {
              name: ['rpp_name'],
              value: dataDeadline.rpp_name,
            },
            {
              name: ['self_assessment_name'],
              value: dataDeadline.self_assessment_name,
            },
            {
              name: ['laporan_name'],
              value: dataDeadline.laporan_name,
            },
            {
              name: ['logbook_rentang_hari'],
              value: dataDeadline.logbook_rentang_hari,
            },
            {
              name: ['rpp_rentang_hari'],
              value: dataDeadline.rpp_rentang_hari,
            },
            {
              name: ['self_assessment_rentang_hari'],
              value: dataDeadline.self_assessment_rentang_hari,
            },
            {
              name: ['laporan_rentang_hari'],
              value: dataDeadline.laporan_rentang_hari,
            },
            {
              name: ['logbook_tanggal'],
              value: dataDeadline.logbook_tanggal,
            },
            {
              name: ['rpp_tanggal'],
              value: dataDeadline.rpp_tanggal,
            },
            {
              name: ['self_assessment_tanggal'],
              value: dataDeadline.self_assessment_tanggal,
            },
            {
              name: ['laporan_tanggal'],
              value: dataDeadline.laporan_tanggal,
            },
          ]}
        >
          <div className="spacetop"></div>
          <Button type="primary" onClick={putDataDeadlineUpdate} htmlType="submit">
            Simpan Data
          </Button>
          <div className="spacebottom"></div>
          <Row style={{ paddingLeft: 30, paddingRight: 30 }}>
            <Col span={6}>
              <b style={{ fontSize: 18 }}>DEADLINE</b>
            </Col>
            <Col span={6}>
              <b style={{ fontSize: 18 }}>RENTANG HARI</b>
            </Col>
            <Col span={6}>
              <b style={{ fontSize: 18 }}>TANGGAL PENGUMPULAN DIBUKA</b>
            </Col>
            <Col span={6}>
              <b style={{ fontSize: 18 }}>TANGGAL PENGUMPULAN DITUTUP</b>
            </Col>
          </Row>
          <hr />
          <Row style={{ padding: 30 }}>
            <Col span={6}>
              <b style={{ fontSize: 15 }}>{dataDeadline.logbook_name}</b>
            </Col>
            <Col span={6}>
              <Form.Item
                name="logbook_rentang_hari"
                layout="inline"
                rules={[
                  {
                    required: true,
                    message: 'Rentang Hari Tidak Boleh Kosong!!!',
                  },
                ]}
              >
                <Input
                  type="number"
                  maxLength={2}
                  onChange={
                    (e) =>
                      handleDeadlineEdit(dataDeadline.logbook_id, dataDeadline.logbook_name,e.target.value, 'rentang_hari', 0)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(dataDeadline.logbook_id,dataDeadline.logbook_name, datestring, 'tanggal_dimulai', 0)
                }
                name='logbook_tanggal_mulai'
                defaultValue={dayjs(dataDeadline.logbook_tanggal_mulai, dateFormat)}
              />
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(dataDeadline.logbook_id,dataDeadline.logbook_name, datestring, 'tanggal_selesai', 0)
                }
                name='logbook_tanggal_selesai'
                defaultValue={dayjs(dataDeadline.logbook_tanggal_selesai, dateFormat)}
              />
            </Col>
          </Row>
          <hr />

          <Row style={{ padding: 30 }}>
            <Col span={6}>
              <b style={{ fontSize: 15 }}>{dataDeadline.rpp_name}</b>
            </Col>
            <Col span={6}>
              <Form.Item
                name="rpp_rentang_hari"
                layout="inline"
                rules={[
                  {
                    required: true,
                    message: 'Rentang Hari Tidak Boleh Kosong!!!',
                  },
                ]}
              >
                <Input
                  type="number"
                  maxLength={2}
                  onChange={
                    (e) =>
                      handleDeadlineEdit(dataDeadline.rpp_id,dataDeadline.rpp_name, e.target.value, 'rentang_hari', 1)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(dataDeadline.rpp_id,dataDeadline.rpp_name, datestring, 'tanggal_mulai', 1)
                }
                name='rpp_tanggal_mulai'
                defaultValue={dayjs(dataDeadline.rpp_tanggal_mulai, dateFormat)}
              />
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(dataDeadline.rpp_id,dataDeadline.rpp_name, datestring, 'tanggal_selesai', 1)
                }
                name='rpp_tanggal_selesai'
                defaultValue={dayjs(dataDeadline.rpp_tanggal_selesai, dateFormat)}
              />
            </Col>
          </Row>
          <hr />

          <Row style={{ padding: 30 }}>
            <Col span={6}>
              <b style={{ fontSize: 15 }}>{dataDeadline.self_assessment_name}</b>
            </Col>
            <Col span={6}>
              <Form.Item
                name="self_assessment_rentang_hari"
                layout="inline"
                rules={[
                  {
                    required: true,
                    message: 'Rentang Hari Tidak Boleh Kosong!!!',
                  },
                ]}
              >
                <Input
                  type="number"
                  maxLength={2}
                  onChange={
                    (e) =>
                      handleDeadlineEdit(
                        dataDeadline.self_assessment_id,
                        dataDeadline.self_assessment_name,
                        e.target.value,
                        'rentang_hari',
                        2,
                      )
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(
                    dataDeadline.self_assessment_id,dataDeadline.self_assessment_name,
                    datestring,
                    'tanggal_dimulai',
                    2,
                  )
                }
              
                defaultValue={dayjs(dataDeadline.self_assessment_tanggal_mulai, dateFormat)}
              />
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(
                    dataDeadline.self_assessment_id,dataDeadline.self_assessment_name,
                    datestring,
                    'tanggal_selesai',
                    2,
                  )
                }
              
                defaultValue={dayjs(dataDeadline.self_assessment_tanggal_selesai, dateFormat)}
              />
            </Col>
          </Row>
          <hr />

          <Row style={{ padding: 30 }}>
            <Col span={6}>
              <b style={{ fontSize: 15 }}>{dataDeadline.laporan_name}</b>
            </Col>
            <Col span={6}>
              <Form.Item
                name="laporan_rentang_hari"
                layout="inline"
                rules={[
                  {
                    required: true,
                    message: 'Rentang Hari Tidak Boleh Kosong!!!',
                  },
                ]}
              >
                <Input
                  type="number"
                  maxLength={2}
                  onChange={
                    (e) =>
                      handleDeadlineEdit(dataDeadline.laporan_id,dataDeadline.laporan_name, e.target.value, 'rentang_hari', 3)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(dataDeadline.laporan_id,dataDeadline.laporan_name, datestring, 'tanggal_dimulai', 3)
                }
              
                defaultValue={dayjs(dataDeadline.laporan_tanggal_mulai, dateFormat)}
              />
            </Col>
            <Col span={6} style={{ padding: 5 }}>
              <DatePicker
                onChange={(date, datestring) =>
                  handleDeadlineEdit(dataDeadline.laporan_id,dataDeadline.laporan_name, datestring, 'tanggal_selesai', 3)
                }
              
                defaultValue={dayjs(dataDeadline.laporan_tanggal_selesai, dateFormat)}
              />
            </Col>
          </Row>
          <hr />
        </Form>
      </div>
    </>
  )
}

export default PengelolaanDeadline
