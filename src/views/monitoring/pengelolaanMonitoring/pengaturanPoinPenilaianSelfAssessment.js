import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
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
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isModalcreateVisible, setIsModalCreateVisible] = useState(false)
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  const [poinPenilaian, setPoinPenilaian] = useState([])
  const [poinName, setPoinName] = useState('')
  const [poinStatus, setPoinStatus] = useState('')
  const [poinEdited, setPoinEdited] = useState([])
  const [ePoinPenilaian, setEPoinPenilaian] = useState('')
  const [eStatus, setEStatus] = useState('')
  const [eId, setEId] = useState()

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

  const refreshData = (index) => {
    axios.get('http://localhost:1337/api/poinpenilaianselfassessments').then((result) => {
      setPoinPenilaian(result.data.data)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }

  useEffect(() => {
    async function getDataPoinPenilaianSelfAssessment() {
      await axios
        .get('http://localhost:1337/api/poinpenilaianselfassessments')
        .then((result) => {
          setPoinPenilaian(result.data.data)
          console.log(result.data.data)
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
    setChoose(record)
  }

  const showModalDelete = (record, index) => {
    Modal.confirm({
      title: 'Konfirmasi hapus poin penilaian?',
      okText: 'Ya',
      onOk: () => {
        handleOkDelete(record, index)
      },
    })
  }

  const handleOkCreate = async (index) => {
    enterLoading(index)
    await axios
      .post('http://localhost:1337/api/poinpenilaianselfassessments', {
        data: {
          poinpenilaian: poinName,
          status: poinStatus,
        },
      })
      .then((response) => {
        refreshData(index)
        notification.success({
          message: 'Poin Penilaian Self Assessment Berhasil Ditambahkan',
        })

        setIsModalCreateVisible(false)
        form.resetFields()
        // console.log(response)
      })
      .catch((error) => {
        setIsModalCreateVisible(false)

        form.resetFields()
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
        notification.error({
          message: 'Poin penilaian telah ada!',
        })
      })
  }
  const getPoinById = async (record) => {
    await axios
      .get(`http://localhost:1337/api/poinpenilaianselfassessments/${record.id}`)
      .then((result) => {
        // setPoinPenilaian(result.data.data)
        console.log('data : ', result.data.data)
        // form1.setFieldsValue({
        //   poinpenilaian:result.data.data.attributes.poinpenilaian,
        //   status : result.data.data.attributes.status
        // })
        setPoinEdited(result.data.data.attributes)
        setEPoinPenilaian(result.data.data.attributes.poinpenilaian)
        setEStatus(result.data.data.attributes.status)
        setEId(result.data.data.id)
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

  const handleOkEdit = async (record, index) => {
    enterLoading(index)
    await axios
      .put(`http://localhost:1337/api/poinpenilaianselfassessments/${record.id}`, {
        poinpenilaian: poinName,
        status: poinStatus,
      })
      .then((response) => {
        refreshData(index)
        notification.success({
          message: 'Poin penilaian berhasil diubah',
        })
        setIsModalEditVisible(false)
        refreshData(index)
      })
      .catch((error) => {
        setIsModalEditVisible(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
        notification.error({
          message: 'Poin penilaian telah dipakai!',
        })
      })
  }

  const handleOkDelete = async (record, index) => {
    enterLoading(index)
    await axios
      .delete(`http://localhost:1337/api/poinpenilaianselfassessments/${record.id}`)
      .then((response) => {
        refreshData(index)
        notification.success({
          message: 'Poin Self Assessment berhasil dihapus',
        })
      })
      .catch((error) => {
        notification.error({
          message: 'Poin Penilaian gagal dihapus!',
        })
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  const handleCancelCreate = () => {
    setIsModalCreateVisible(false)
  }

  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }

  const editDataHandle = (id,index) => {
    axios
      .put(`http://localhost:1337/api/poinpenilaianselfassessments/${id}`, {
        'data' : {
          'poinpenilaian' : ePoinPenilaian,
          'status' : eStatus
        }
      })
      .then((response) => {
        console.log(response)
        refreshData(index)
        notification.success({
          message: 'Poin penilaian berhasil diubah',
        })
        setIsModalEditVisible(false)
      })
      .catch((error) => {
        console.log(error)
        setIsModalEditVisible(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          return newLoadings
        })
        notification.error({
          message: 'Poin penilaian telah dipakai!',
        })
      })
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
    onFilterDropdownVisibleChange: (visible) => {
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

  //PENCARIAN
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

  //RESET PENCARIAN
  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters()
    refreshData(index)
    setState({ searchText: '' })
    handleSearch(selectedKeys, confirm, dataIndex, index)
  }
  //KOLOM
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
      dataIndex: ['attributes', 'poinpenilaian'],
      ...getColumnSearchProps('poinpenilaian', 'Poin Penilaian'),
    },
    {
      title: 'Status Poin Penilaian',
      dataIndex: ['attributes', 'status'],
      ...getColumnSearchProps('status', 'Status Poin Penilaian'),
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
                  // showModalEdit(record)
                  getPoinById(record)
                  console.log(record.id)
                  showModalEdit(record)
                }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Col>
            {/* <Col span={12} style={{ textAlign: 'center' }}>
              <Button
                id="button-trash"
                htmlType="submit"
                shape="circle"
                loading={loadings[`delete-${record.id}`]}
                style={{ backgroundColor: '#e9033d', borderColor: '#e9033d' }}
                onClick={() => {
                  showModalDelete(record, `delete-${record.id}`)
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'black' }} />
              </Button>
            </Col> */}
          </Row>
        </>
      ),
    },
  ]

  const options = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Non Active',
      value: 'non active',
    },
    {
      label: 'Disabled',
      value: 'disabled',
    },
  ]

  return isLoading ? (
    <Spin indicator={antIcon} />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardBody>
        <h4 className='justify spacebottom'>PENGELOLAAN POIN PENILAIAN SELF ASSESSMENT</h4>
        <Typography component="div" variant="body1">
        <Box sx={{ color: 'warning.main' }}>
          <ul style={{fontSize:14}}>
            <li>Poin penilaian akan dipergunakan pada form pengisian self assessment peserta</li>
            <li>Diberikan status active : apabila poin tersebut diizinkan untuk diisi oleh peserta</li>
            <li>Diberikan status non active : apabila poin tersebut belum waktunya untuk diisi oleh peserta</li>
            <li>Diberikan status disabled : apabila poin tersebut tidak akan dilakukan pengisian sama sekali oleh peserta</li>
          </ul>
        </Box>
        </Typography>
          <Row>
            <Col span={24} style={{ textAlign: 'right'}}>
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
        visible={isModalcreateVisible}
        onOk={form.submit}
        onCancel={handleCancelCreate}
        width={600}
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

          <b>
            Status Poin Penilaian<span style={{ color: 'red' }}> *</span>
          </b>
          <Form.Item
            label="Pilih Status"
            rules={[{ required: true, message: 'Nama Poin Penilaian Tidak Boleh Kosong' }]}
          >
            <Select
              onChange={(value) => {
                setPoinStatus(value)
              }}
              name="poinStatus"
              placeholder="Pilih Status Poin Penilaian"
            >
              <Option value="active">Active</Option>
              <Option value="non active">Non Active</Option>
              <Option value="disabled">Disabled</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ubah Data Poin Penilaian Self Assessment"
        visible={isModaleditVisible}
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
      >
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => editDataHandle(eId)}
          autoComplete="off"
          fields={[
            {
              name: ['poinpenilaian'],
              value: ePoinPenilaian,
            },
            {
              name: ['poinstatus'],
              value: eStatus,
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
            <Input value={ePoinPenilaian} onChange={(e) => setEPoinPenilaian(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Pilih Status"
            rules={[{ required: true, message: 'Nama Poin Penilaian Tidak Boleh Kosong' }]}
          >
            <Select
              name="poinstatus"
              placeholder="Pilih Status Poin Penilaian"
              value={eStatus}
              onChange={(value) => {
                setEStatus(value)
              }}
            >
              <Option value="active">Active</Option>
              <Option value="non active">Non Active</Option>
              <Option value="disabled">Disabled</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* <Modal title="Ubah Data Poin Penilaian Self Assessment"
        visible={isModaleditVisible}
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
          </Button>]}>
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => handleOkEdit(1)}
          autoComplete="off"
          fields={[
            {
              name: ["poinPenilaian"],
              value: 
            },
            {
              name : ["poinStatus"],
              value : choose.id
            }
          ]}
        >
          <b>Nama Poin Penilaian<span style={{ color: "red" }}> *</span></b>
          <Form.Item
            name="poinPenilaian"
            rules={[{ required: true, message: 'Nama poin penilaian tidak boleh kosong!' }]}
          >
            <Input onChange={e => {
              setChoose(pre => {
                return { ...pre, 'attributes':{'poinPenilaian': e.target.value} }
              })
            }} value={choose.id} />
          </Form.Item>
        </Form>
      </Modal> */}
    </>
  )
}

export default PengelolaanPoinPenilaianSelfAssessment
