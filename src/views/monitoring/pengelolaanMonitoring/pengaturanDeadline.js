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


const PengelolaanDeadline = () => {
  const dateFormat = 'YYYY-MM-DD'
  const [dataDeadline, setDataDeadline] = useState([])
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [form1] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([])
  let history = useHistory()
  const [dataEdit, setDataEdit] = useState([])
  const [dataDeadlineEdit, setDataDeadlineEdit] = useState([])
  const [top, setTop] = useState(10)
  const [bottom, setBottom] = useState(10)
  axios.defaults.withCredentials = true
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idDeadlineEdit, setIdDeadlineEdit] = useState()
  const [nameDeadlineEdit, setNameDeadlineEdit] = useState()
  const [dayRangeDeadlineEdit, setDayRangeDeadlineEdit] = useState()
  const [startAssignmentDateDeadlineEdit, setStartAssignmentDateDeadlineEdit] = useState()
  const [finishAssignmentDateDeadlineEdit, setFinishAssignmentDateDeadlineEdit] = useState()

  useEffect(() => {
    async function getDataDeadline() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all`)
        .then((result) => {
          console.log('res', result.data.data)
          setDataDeadline(result.data.data)
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
        setDataDeadline(result.data.data)
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
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/update`, {
        day_range: dayRange,
        finish_assignment_date: finishDateAssignment,
        id: idDeadline,
        name: nameDeadline,
        start_assignment_date: startDateAssignment,
      })
      .then((result) => {
        console.log(result)
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
      dataIndex: 'day_range',
    },
    {
      title: 'Tanggal Dibuka Pengumpulan',
      dataIndex: 'start_assignment_date',
    },
    {
      title: 'Tanggal Batas Pengumpulan',
      dataIndex: 'finish_assignment_date',
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

        <div className="spacetop"></div>
        <Table
          className="spacetop"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={dataDeadline}
          rowKey="id"
          bordered
        />

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

            <Form.Item  label="Tanggal Pengumpulan Dibuka">
              <DatePicker
                defaultValue={dayjs(startAssignmentDateDeadlineEdit, dateFormat)}
                onChange={(date, datestring) => setStartAssignmentDateDeadlineEdit(datestring)}
              />
            </Form.Item>

            <Form.Item label="Tanggal Pengumpulan Ditutup">
              <DatePicker
                defaultValue={dayjs(finishAssignmentDateDeadlineEdit, dateFormat)}
                onChange={(date, datestring) => setFinishAssignmentDateDeadlineEdit(datestring)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default PengelolaanDeadline
