import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faPencil } from '@fortawesome/free-solid-svg-icons'
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,

  notification,
  Spin,

  DatePicker,
} from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import '../pengisianDokumen/rpp/rpp.css'

import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)


const PengelolaanDeadline = () => {
  axios.defaults.withCredentials = true
  const dateFormat = 'YYYY-MM-DD'
  const [dataDeadline, setDataDeadline] = useState([])
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [form1] = Form.useForm()
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([])
  let history = useHistory()
  const [isModalCreateNewVisible, setIsModalCreateNewVisible] = useState(false)
  const [idDeadlineEdit, setIdDeadlineEdit] = useState()
  const [nameDeadlineEdit, setNameDeadlineEdit] = useState()
  const [dayRangeDeadlineEdit, setDayRangeDeadlineEdit] = useState()
  const [startAssignmentDateDeadlineEdit, setStartAssignmentDateDeadlineEdit] = useState()
  const [finishAssignmentDateDeadlineEdit, setFinishAssignmentDateDeadlineEdit] = useState()
  const [nameDeadlineNew, setNameDeadlineNew] = useState()
  const [dayRangeDeadlineNew, setDayRangeDeadlineNew] = useState()
  const [startAssignmentDateDeadlineNew, setStartAssignmentDateDeadlineNew] = useState()
  const [finishAssignmentDateDeadlineNew, setFinishAssignmentDateDeadlineNew] = useState()
  const [isLaporanEdit, setIsLaporanEdit] = useState()




  const convertDate = (date) => {
    let temp_date_split = date.split('-')
    const month = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]
    let date_month = temp_date_split[1]
    let month_of_date = month[parseInt(date_month) - 1]

    return `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
  }

  useEffect(() => {
    async function getDataDeadline() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all`)
        .then((result) => {
          const getDayRangeStatus = (range) =>{
            return range===0?'-': range
          }

        
          const isLaporan = (name) =>{
            let res = name.includes('laporan')
            if(res){
              return 1
            }else{
              return 0
            }
          }
       
  
          let data_deadline_res_convert_date = []
          let get_data_deadline_with_convert_date = function(data){
            for(var i in data){
              data_deadline_res_convert_date.push({
                day_range : data[i].day_range,
                day_range_in_list : getDayRangeStatus(data[i].day_range), 
                finish_assignment_date : data[i].finish_assignment_date,
                finish_assignment_date_convert : convertDate(data[i].finish_assignment_date),
                id : data[i].id,
                name : data[i].name,
                is_laporan : isLaporan((data[i].name).toLowerCase()),
                start_assignment_date : data[i].start_assignment_date,
                start_assignment_date_convert : convertDate(data[i].start_assignment_date)
              })
            }
          }
          get_data_deadline_with_convert_date(result.data.data)
          setDataDeadline(data_deadline_res_convert_date)
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

  const refreshData = async (index) => {
    await axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all`)
      .then((result) => {
        const getDayRangeStatus = (range) =>{
          return range===0?'-': range
        }

        const isLaporan = (name) =>{
          let res = name.includes('laporan')
          if(res){
            return 1
          }else{
            return 0
          }
        }
     
        let data_deadline_res_convert_date = []
        let data_deadline_with_convert_date = function(data){
          for(var i in data){
            data_deadline_res_convert_date.push({
              day_range : data[i].day_range,
              day_range_in_list : getDayRangeStatus(data[i].day_range), 
              finish_assignment_date : data[i].finish_assignment_date,
              finish_assignment_date_convert : convertDate(data[i].finish_assignment_date),
              id : data[i].id,
              is_laporan : isLaporan((data[i].name).toLowerCase()),
              name : data[i].name,
              start_assignment_date : data[i].start_assignment_date,
              start_assignment_date_convert : convertDate(data[i].start_assignment_date)
            })
          }
        }
        data_deadline_with_convert_date(result.data.data)
        setDataDeadline(data_deadline_res_convert_date)
        setIsLoading(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  async function editDataDeadlineHandle(
    idDeadline,
    nameDeadline,
    dayRange,
    startDateAssignment,
    finishDateAssignment,
  ) {
    // console.log( idDeadline,
    //   nameDeadline,
    //   dayRange,
    //   startDateAssignment,
    //   finishDateAssignment,)
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/update`, {
        day_range: dayRange,
        finish_assignment_date: finishDateAssignment,
        id: idDeadline,
        name: nameDeadline,
        start_assignment_date: startDateAssignment,
      })
      .then((result) => {
        setIsModalEditVisible(false)
        notification.success({ message: 'Data Deadline Berhasil Diubah' })
      })

    setNameDeadlineEdit(undefined)
    setDayRangeDeadlineEdit(undefined)
    setStartAssignmentDateDeadlineEdit(undefined)
    setIdDeadlineEdit(undefined)
    setFinishAssignmentDateDeadlineEdit(undefined)
   

    refreshData()
  }

  const showModalEdit = (record) => {
    setIsModalEditVisible(true)
  }

  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }

  const showModalCreateNew = (record) => {
    setIsModalCreateNewVisible(true)
  }

  const handleCancelCreateNew = () => {
    setIsModalCreateNewVisible(false)
  }


  const handleCreateNewDeadline = async (data_name, dayrange,finishDate,startDate) => {
    let name = data_name.toLowerCase()
    //dayRangeDeadlineNew
    let isLaporan = name.includes('laporan')
    if(isLaporan){
      await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/create`,
      {
        "day_range": 0,
        "finish_assignment_date": startAssignmentDateDeadlineNew,
        "name": nameDeadlineNew,
        "start_assignment_date": finishAssignmentDateDeadlineNew
      }
      ).then((res)=>{
        handleCancelCreateNew()
        notification.success({message:'Data Deadline berhasil ditambahkan'})
        form.resetFields()
        refreshData()
      }).catch(function (error) {
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
    }else{
      notification.warning({message:'Hanya data dengan nama yang mengandung kata "laporan" yang dapat dilakukan penambahan deadline'})
    }

  }

  const columns = [
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
      title: 'Dokumen Deadline',
      dataIndex: 'name',
    },
    {
      title: 'Rentang Hari Batas Pengumpulan',
      dataIndex: 'day_range_in_list',
    },
    {
      title: 'Tanggal Dibuka Pengumpulan',
      dataIndex: 'start_assignment_date_convert',
    },
    {
      title: 'Tanggal Pengumpulan Ditutup',
      dataIndex: 'finish_assignment_date_convert',
    },
    {
      title: 'Aksi',
      width: '5%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Button
                id="button-pencil"
                htmlType="submit"
                shape="circle"
                style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                onClick={() => {
                  setIdDeadlineEdit(record.id)
                  setNameDeadlineEdit(record.name)
                  setDayRangeDeadlineEdit(record.day_range)
                  setStartAssignmentDateDeadlineEdit(record.start_assignment_date)
                  setFinishAssignmentDateDeadlineEdit(record.finish_assignment_date)
                  setIsLaporanEdit(record.is_laporan)
                  showModalEdit(record)
                  
                }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <div className="container2">
        <h4 className="justify spacebottom">
          PENGATURAN DEADLINE DOKUMEN PESERTA
        </h4>
        <Typography component="div" variant="body1" className="spacebottom">
          <Box sx={{ color: 'info.main' }}>
            <ul style={{ fontSize: 14 }}>
            <li style={{padding:10}}><b>RENTANG BATAS PENGUMPULAN LOGBOOK</b> : Batas toleransi pengumpulan logbook, jika melewati batas hari, maka status pengumpulan akan berubah menjadi terlambat</li>
            <li style={{padding:10}}><b>RENTANG BATAS PENGUMPULAN SELF ASSESSEMENT</b> : Batas toleransi pengumpulan self assessment, jika melewati batas hari, maka pengumpulan dokumen tidak diterima</li>
            <li style={{padding:10}}><b>TANGGAL PENGUMPULAN DITUTUP</b> : batas akses pengumpulan dokumen ( kecuali logbook, akan tetap menerima pengumpulan ) </li>
            </ul>
          </Box>
        </Typography>

        <div className="spacetop spacebottom">
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                id="create-logbook"
                size="sm"
                shape="round"
                style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                onClick={showModalCreateNew}
              >
                Tambahkan Data
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          className="spacetop"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={dataDeadline}
          rowKey="id"
          bordered
        />

        <Modal
          title="Tambah Data Deadline"
          open={isModalCreateNewVisible}
          onOk={form.submit}
          onCancel={handleCancelCreateNew}
          width={600}
          zIndex={9999999}
          footer={[
            <Button key="back" onClick={handleCancelCreateNew}>
              Batal
            </Button>,
            <Button loading={loadings[2]} key="submit" type="primary" onClick={form.submit}>
              Simpan
            </Button>,
          ]}
          destroyOnClose
        >
          <Form
            form={form}
            name="basic"
            wrapperCol={{ span: 24 }}
            onFinish={() =>
             handleCreateNewDeadline(nameDeadlineNew, dayRangeDeadlineNew,startAssignmentDateDeadlineNew,finishAssignmentDateDeadlineNew)
             
            }
            autoComplete="off"
           
          >
            <hr />
            <Form.Item
              label="Nama Deadline"
              name="namaDeadline"
              rules={[{ required: true, message: 'Nama Deadline tidak boleh kosong!' }]}
            >
              <Input
                type="text"
                onChange={(e) => setNameDeadlineNew(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Rentang Hari"
              name="rentangHari"
              rules={[{ required: true, message: 'Rentang Hari tidak boleh kosong!' }]}
            >
              <Input
                type="number"
                onChange={(e) => setDayRangeDeadlineNew(e.target.value)}
              />
            </Form.Item>

            <Form.Item
                name="tanggal_pengumpulan_dibuka"
                label="Tanggal Pengumpulan Dibuka"
                rules={[
                  {
                    required: true,
                    message : 'Masukkan tanggal pengumpulan dibuka !'
                  },
                  {
                    type: 'date',
                    warningOnly: true,
                  },
                ]}
              >
              <DatePicker
                onChange={(date, datestring) => setStartAssignmentDateDeadlineNew(datestring)}
              />
            </Form.Item>

            <Form.Item
                name="tanggal_pengumpulan_ditutup"
                label="Tanggal Pengumpulan Ditutup"
                rules={[
                  {
                    required: true,
                    message : 'Masukkan tanggal pengumpulan ditutup !'
                  },
                  {
                    type: 'date',
                    warningOnly: true,
                  },
                ]}
              >
              <DatePicker
                onChange={(date, datestring) => setFinishAssignmentDateDeadlineNew(datestring)}
              />
            </Form.Item>
          </Form>
        </Modal>


        <Modal
          title="Ubah Data Deadline"
          open={isModaleditVisible}
          onOk={form1.submit}
          onCancel={handleCancelEdit}
          width={600}
          zIndex={9999999}
          footer={[
            <Button key="back" onClick={handleCancelEdit}>
              Batal
            </Button>,
            <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
              Simpan
            </Button>,
          ]}
          destroyOnClose
        >
          <Form
            form={form1}
            name="basic"
            wrapperCol={{ span: 24 }}
            onFinish={() =>
              editDataDeadlineHandle(
                idDeadlineEdit,
                nameDeadlineEdit,
                dayRangeDeadlineEdit,
                startAssignmentDateDeadlineEdit,
                finishAssignmentDateDeadlineEdit,
              )
            }
            autoComplete="off"
            fields={[
              {
                name: ['namaDeadline'],
                value: nameDeadlineEdit,
              },
              {
                name: ['rentangHari'],
                value: dayRangeDeadlineEdit,
              },
              {
                name: ['tanggalPengumpulanDibuka'],
                value: startAssignmentDateDeadlineEdit,
              },
              {
                name: ['tanggalPengumpulanDitutup'],
                value: finishAssignmentDateDeadlineEdit,
              },
            ]}
          >
            <hr />
            <b>{nameDeadlineEdit}</b>
            <hr />

            <Form.Item
              label="Rentang Hari"
              name="rentangHari"
              rules={[{ required: true, message: 'Rentang Hari tidak boleh kosong!' }]}
            >
              <Input
                type="number"
                defaultValue={dayRangeDeadlineEdit}
                onChange={(e) => setDayRangeDeadlineEdit(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Tanggal Pengumpulan Dibuka">
              <DatePicker
                defaultValue={dayjs(startAssignmentDateDeadlineEdit, dateFormat)}
                onChange={(date, datestring) => setStartAssignmentDateDeadlineEdit(datestring)}
              />
            </Form.Item>

       
            {isLaporanEdit === 1 && (
                <Form.Item label="Tanggal Pengumpulan Ditutup">
                <DatePicker
                  defaultValue={dayjs(finishAssignmentDateDeadlineEdit, dateFormat)}
                  onChange={(date, datestring) => setFinishAssignmentDateDeadlineEdit(datestring)}
                />
              </Form.Item>
            )}
          
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default PengelolaanDeadline
