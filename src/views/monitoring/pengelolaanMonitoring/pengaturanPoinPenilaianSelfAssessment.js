import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

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

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const PengelolaanPoinPenilaianSelfAssessment = () => {
  dayjs.extend(customParseFormat)
  const { RangePicker } = DatePicker
  const dateFormat = 'YYYY-MM-DD'
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  const [poinPenilaian, setPoinPenilaian] = useState([])
  const [poinName, setPoinName] = useState('')
  const [poinStatus, setPoinStatus] = useState('')
  const [poinTanggalDibuka, setPoinTanggalDibuka] = useState('')
  const [poinEdited, setPoinEdited] = useState([])
  const [ePoinPenilaian, setEPoinPenilaian] = useState('')
  const [eStatus, setEStatus] = useState('')
  const [eId, setEId] = useState()
  const [ePoinTanggal, setEPoinTanggal] = useState()
  const [coDate, setCoDate] = useState()

  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  const refreshData = async (index) => {
    await axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/get`)
      .then((result) => {
        setPoinPenilaian(result.data.data)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
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

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }
  useEffect(() => {
    async function getDataPoinPenilaianSelfAssessment() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/get`)
        .then((result) => {
          setPoinPenilaian(result.data.data)
         // console.log(result.data.data)
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
    getDataPoinPenilaianSelfAssessment()
  }, [history])

  const showModalCreate = () => {
    setIsModalCreateVisible(true)
  }

  const showModalEdit = (record) => {
    setIsModalEditVisible(true)
  }

  const handleOkCreate = async (index) => {
    await axios
      .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/create`, {
        description: poinName,
        name: poinName,
        start_assessment_date: formatDate(new Date()),
        status: 6,
      })
      .then((response) => {
        refreshData(index)
        notification.success({
          message: 'Poin Penilaian Self Assessment Berhasil Ditambahkan',
        })

        setIsModalCreateVisible(false)
        form.resetFields()
      })
      .catch((error) => {
        setIsModalCreateVisible(false)

        form.resetFields()
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
     
      })
    // } else {
    //   notification.warning({ message: 'Isi Status Terlebih Dahulu!!!' })
    // }

   
  }

  const handleCancelCreate = () => {
    setIsModalCreateVisible(false)
  }

  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }

  const editDataHandle = (
    idPoinPenilaian,
    namaPoinPenilaian,
    statusPoinPenilaian,
    tanggalAksesDibuka,
    index,
  ) => {
  
    axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/update`, {
        description: namaPoinPenilaian,
        id: idPoinPenilaian,
        name: namaPoinPenilaian,
        start_assessment_date: tanggalAksesDibuka,
        status: statusPoinPenilaian,
      })
      .then((response) => {
       // console.log(response)
        refreshData(index)
        notification.success({
          message: 'Poin penilaian berhasil diubah',
        })
        setIsModalEditVisible(false)
      })
      .catch((error) => {
      
        setIsModalEditVisible(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          return newLoadings
        })
        notification.error({
          message: 'Data Gagal ditambahkan!',
        })
      })
    refreshData()
  }

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node
          }}
          placeholder={`Cari berdasarkan ${name}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, `cari`)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, `cari`)}
            icon={<SearchOutlined />}
            size="small"
            loading={loadings[`cari`]}
            style={{ width: 90 }}
          >
            Cari
          </Button>
          <Button
            loading={loadings[99]}
            onClick={() => handleReset(clearFilters, '', confirm, dataIndex, 99)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100)
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const handleSearch = (selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    confirm()
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = false
      return newLoadings
    })
  }

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters()
    refreshData(index)
    setState({ searchText: '' })
    handleSearch(selectedKeys, confirm, dataIndex, index)
  }

  // function formatDate(date) {
  //   var d = new Date(date),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear()

  //   if (month.length < 2) month = '0' + month
  //   if (day.length < 2) day = '0' + day

  //   return [year, month, day].join('-')
  // }

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
      title: 'Poin Penilaian',
      dataIndex: 'aspect_name',
      ...getColumnSearchProps('aspect_name', 'Poin Penilaian'),
    },
    {
      title: 'Status Poin Penilaian',
      dataIndex: 'status',
      ...getColumnSearchProps('status', 'Status Poin Penilaian'),
    },
    // {
    //   title: 'Tanggal Mulai Dibuka Akses',
    //   dataIndex: 'start_assessment_date',
    //   ...getColumnSearchProps('status', 'Status Poin Penilaian'),
    // },
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
                
                  setEId(record.aspect_id)
                  setEPoinPenilaian(record.aspect_name)
                  setEStatus(record.status)
                  setEPoinTanggal(record.start_assessment_date)
                  setCoDate(record.start_assessment_date)
                //  console.log(record.start_assessment_date)
                  if(record.status === 'Active'){
                    setEStatus(6)
                  }else if(record.status === 'Inactive'){
                    setEStatus(7)
                  }else if(record.status === 'Disabled')(
                    setEStatus(8)
                  )


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
      <CCard className="mb-4">
        <CCardBody>
          <h4 className="justify spacebottom">PENGELOLAAN POIN PENILAIAN SELF ASSESSMENT</h4>
          <Typography component="div" variant="body1">
            <Box sx={{ color: 'warning.main' }}>
              <ul style={{ fontSize: 14 }}>
                <li>
                  Poin penilaian akan dipergunakan pada form pengisian self assessment peserta
                </li>
                <li>
                  Diberikan status active : apabila poin tersebut diizinkan untuk diisi oleh peserta
                </li>
                {/* <li>
                  Diberikan status inactive : apabila poin tersebut belum waktunya untuk diisi oleh
                  peserta
                </li> */}
                <li>
                  Diberikan status disabled : apabila poin tersebut tidak akan dilakukan pengisian
                  sama sekali oleh peserta
                </li>
              </ul>
            </Box>
          </Typography>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                id="create-kriteria"
                size="sm"
                shape="round"
                style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                onClick={showModalCreate}
              >
                Buat Poin Baru
              </Button>
            </Col>
          </Row>
          <CRow>
            <CCol sm={12}>
              <Table
                scroll={{ x: 'max-content' }}
                columns={columns}
                dataSource={poinPenilaian}
                rowKey="id"
                bordered
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <Modal
        title="Tambah Poin Penilaian Self Assessment"
        open={isModalcreateVisible}
        onOk={form.submit}
        onCancel={handleCancelCreate}
        width={600}
        destroyOnClose
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelCreate}>
            Batal
          </Button>,
          <Button loading={loadings[0]} key="submit" type="primary" onClick={form.submit}>
            Simpan
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="basic"
          initialValues={poinPenilaian}
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkCreate(0)}
          autoComplete="off"
        >
          <b>
            Nama Poin Penilaian<span style={{ color: 'red' }}> *</span>
          </b>
          <Form.Item
            name="namaPoinPenilaian"
            rules={[{ required: true, message: 'Nama Poin Penilaian Tidak Boleh Kosong' }]}
          >
            <Input onChange={(e) => setPoinName(e.target.value)} />
          </Form.Item>
{/* 
          <b>
            Tanggal Poin Dibuka <span style={{ color: 'red' }}> *</span>
          </b> */}
          {/* <Form.Item
            name="tanggal"
            rules={[
              { required: true, message: 'Nama Poin Penilaian Tidak Boleh Kosong' },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <DatePicker onChange={(date, datestring) => setPoinTanggalDibuka(datestring)} />
          </Form.Item> */}
        </Form>
      </Modal>

      <Modal
        title="Ubah Data Poin Penilaian Self Assessment"
        open={isModaleditVisible}
        onOk={form1.submit}
        onCancel={handleCancelEdit}
        width={600}
        zIndex={9999999}
        destroyOnClose
        footer={[
          <Button key="back" onClick={handleCancelEdit}>
            Batal
          </Button>,
          <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
            Simpan
          </Button>,
        ]}
      >
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => editDataHandle(eId, ePoinPenilaian, eStatus, ePoinTanggal)}
          autoComplete="off"
          initialValues={poinPenilaian}
          fields={[
            {
              name: ['poinpenilaian'],
              value: ePoinPenilaian,
            },
            {
              name: ['poinstatus'],
              value: eStatus,
            },
            {
              name: ['pointanggal'],
              value: ePoinTanggal,
            },
          ]}
        >
          <b>
            Nama Poin Penilaian<span style={{ color: 'red' }}> *</span>
          </b>
          <Form.Item
            name="poinpenilaian"
            rules={[{ required: true, message: 'Nama poin penilaian tidak boleh kosong!' }]}
          >
            <Input
              // disabled
              defaultValue={ePoinPenilaian}
              onChange={
                (e) => setEPoinPenilaian(e.target.value)
                //console.log(e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            label="Pilih Status"
            rules={[{ required: true, message: 'Nama Poin Penilaian Tidak Boleh Kosong' }]}
          >
            <Select
              name="statusedit"
              placeholder="Pilih Status Poin Penilaian"
              defaultValue={eStatus}
              onChange={(value) => {
                setEStatus(value)
                //console.log(value)
              }}
            >
              <Option value={6}>Active</Option>
              {/* <Option value={7}>Inctive</Option> */}
              <Option value={8}>Disabled</Option>
            </Select>
          </Form.Item>

          {/* <b>
            Tanggal Poin Penilaian<span style={{ color: 'red' }}> *</span>
          </b>
          <p>Tanggal Saat Ini : {coDate}</p>
         
         
            <DatePicker
              defaultValue={dayjs(ePoinTanggal, dateFormat)}
              onChange={
                (date, datestring) => setEPoinTanggal(datestring)
                // console.log(datestring)
              }
            />
        */}
       
        </Form>
      </Modal>
    </>
  )
}

export default PengelolaanPoinPenilaianSelfAssessment
