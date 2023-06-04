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
  const [top, setTop] = useState(10);
  const [bottom, setBottom] = useState(10);

 
  axios.defaults.withCredentials = true
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = (data) => {
    setIsModalOpen(true)
    setDataEdit(data)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }
  // const onFinish = (values) => {
  //   console.log(rentangHariEdit, tanggalPengumpulanDimulaiEdit)
  // }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // const putDataDeadlineEdited = async () => {
  //   await axios.put(`http://localhost:1337/api/deadlines`, {
  //     data: {
  //       rentanghari: rentangHariEdit,
  //       tanggalpengumpulandibuka: tanggalPengumpulanDimulaiEdit,
  //     },
  //   })
  // }

  const handleDeadlineEdit = (idDeadline, dataValue, keyData, dataIndex) => {
    if (dataDeadlineEdit[dataIndex]) {
      dataDeadlineEdit[dataIndex][keyData] = dataValue
    } else {
      dataDeadlineEdit[dataIndex] = {
        id_deadline: idDeadline,
        [keyData]: dataValue,
      }
    }
    setDataDeadlineEdit(dataDeadlineEdit)
  }


  async function putDataDeadlineUpdate(){
    for(var i in dataDeadlineEdit){
      let a = 0
      let new_rentang_hari = dataDeadlineEdit[i].rentang_hari
      let id = dataDeadlineEdit[i].id_deadline
      let new_tanggal = dataDeadlineEdit[i].tanggal
      await axios.put(`http://localhost:1337/api/deadlines/${id}`,{
        'data' : {
          'rentanghari' : new_rentang_hari,
          'tanggalpengumpulandibuka' : new_tanggal
        }
      }).then((res)=>{
        console.log(res)

      })

      a++
      if(parseInt(a) === parseInt(i)){
        notification.success({
          message:'Data Deadline Berhasil Diubah'
        })
      }
    }

    refreshData()
  }

  const refreshData = async(index) =>{
    await axios
    .get('http://localhost:1337/api/deadlines')
    .then((res) => {
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
        .get('http://localhost:1337/api/deadlines')
        .then((res) => {
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
    
     
          <div className='spacetop'></div>
          <Button type='primary' onClick={putDataDeadlineUpdate}>Simpan Data</Button>
          <div className='spacebottom'></div>
          <Row style={{paddingLeft:30, paddingRight:30}}>
            <Col span={8} >
              <b style={{fontSize:18}}>DEADLINE</b>
            </Col>
            <Col span={8} >
              <b style={{fontSize:18}}>RENTANG HARI</b>
            </Col>
            <Col span={8} >
              <b style={{fontSize:18}}>TANGGAL PENGUMPULAN DIBUKA</b>
            </Col>
          </Row>
          <hr/>
          <Row style={{padding:30}}>
            <Col span={8} ><b style={{fontSize:15}}>{dataDeadline.logbook_name}</b></Col>
            <Col span={8} >
              <Form.Item
                name='logbook_rentang_hari'
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
                  onChange={(e) =>
                     handleDeadlineEdit(dataDeadline.logbook_id, e.target.value, 'rentang_hari', 0)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{padding:5}}>
            <DatePicker onChange={(date,datestring)=>handleDeadlineEdit(dataDeadline.logbook_id,datestring,'tanggal', 0)
            
            } name='tanggal_pengumpulan_dimulai' defaultValue={dayjs(dataDeadline.logbook_tanggal, dateFormat)}/>
            </Col>
          </Row>
          <hr/>

          <Row style={{padding:30}}>
            <Col span={8} ><b style={{fontSize:15}}>{dataDeadline.rpp_name}</b></Col>
            <Col span={8} >
              <Form.Item
                name='rpp_rentang_hari'
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
                  onChange={(e) =>
                     handleDeadlineEdit(dataDeadline.rpp_id, e.target.value, 'rentang_hari', 1)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{padding:5}}>
            <DatePicker onChange={(date,datestring)=>handleDeadlineEdit(dataDeadline.rpp_id,datestring,'tanggal', 1)
            
            } name='tanggal_pengumpulan_dimulai' defaultValue={dayjs(dataDeadline.rpp_tanggal, dateFormat)}/>
            </Col>
          </Row>
          <hr/>

          <Row style={{padding:30}}>
            <Col span={8} ><b style={{fontSize:15}}>{dataDeadline.self_assessment_name}</b></Col>
            <Col span={8} >
              <Form.Item
                name='self_assessment_rentang_hari'
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
                  onChange={(e) =>
                     handleDeadlineEdit(dataDeadline.self_assessment_id, e.target.value, 'rentang_hari', 2)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{padding:5}}>
            <DatePicker onChange={(date,datestring)=>handleDeadlineEdit(dataDeadline.self_assessment_id,datestring,'tanggal', 2)
            
            } name='tanggal_pengumpulan_dimulai' defaultValue={dayjs(dataDeadline.self_assessment_tanggal, dateFormat)}/>
            </Col>
          </Row>
          <hr/>

          <Row style={{padding:30}}>
            <Col span={8} ><b style={{fontSize:15}}>{dataDeadline.laporan_name}</b></Col>
            <Col span={8} >
              <Form.Item
                name='laporan_rentang_hari'
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
                  onChange={(e) =>
                     handleDeadlineEdit(dataDeadline.laporan_id, e.target.value, 'rentang_hari', 3)
                    // console.log(e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{padding:5}}>
            <DatePicker onChange={(date,datestring)=>handleDeadlineEdit(dataDeadline.laporan_id,datestring,'tanggal', 3)
            
            } name='tanggal_pengumpulan_dimulai' defaultValue={dayjs(dataDeadline.laporan_tanggal, dateFormat)}/>
            </Col>
          </Row>
          <hr/>
          
        </Form>
      </div>
    </>
  )
}

export default PengelolaanDeadline
