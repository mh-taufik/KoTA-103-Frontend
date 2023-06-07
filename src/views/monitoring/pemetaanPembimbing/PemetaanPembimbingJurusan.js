import React, { useEffect, useState } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faLock, faTrashCan, faEdit, faPen } from '@fortawesome/free-solid-svg-icons'
import get from 'lodash.get'
import isequal from 'lodash.isequal'

import {
  Tabs,
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Select,
  Dropdown,
  Spin,
} from 'antd'
import axios from 'axios'
import '../pengisianDokumen/rpp/rpp.css'
import { useHistory } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TabPane } = Tabs

const PemetaanPembimbingJurusan = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  const [isModaleditOpen, setIsModalEditOpen] = useState(false)
  const [dataToEdit, setDataToEdit] = useState([])
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [form1] = Form.useForm()
  const [dataHasilPemetaan, setDataHasilPemetaan] = useState([])
  const [pembimbingChoosen, setPembimbingChoosen] = useState([])
  const [idChoosen, setIdChoosen] = useState()
  const [idPerusahaanChoosen, setIdPerusahaanChoosen] = useState()
  axios.defaults.withCredentials = true
  const USER_ID_PRODI = localStorage.id_prodi
  const [optPembimbing, setOptPembimbing] = useState([])
  const [prodi,setProdi] = useState()


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
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  const showModalEdit = (record) => {
    setIsModalEditOpen(true)
    setDataToEdit(record)
  }

  
  const handleCancelEdit = () => {
    setIsModalEditOpen(false)
  }

  const refreshData = async(index) => {
    await axios
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all`)
    .then((result) => {
     setDataHasilPemetaan(result.data.data)
      setIsLoading(false)
    })
  }

  const HandleEditPembimbingJurusan = async (id, idPembimbing, index) => {
    await axios
      .put(`http://localhost:1337/api/perusahaans/${id}`, {
        data: {
          pembimbingjurusan: {
            connect: [idPembimbing],
          },
        },
      })
      .then((res) => {
        refreshData(index)
        notification.success({
          message: 'Data Pembimbing Jurusan Berhasil Diubah',
        })
        setIsModalEditOpen(false)
        form1.resetFields()
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

  useEffect(() => {
    if(USER_ID_PRODI===0){
      setProdi('D3')
    }else{
      setProdi('D4')
    }

    async function getDataPemetaanPerusahaan() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all`)
        .then((result) => {
         setDataHasilPemetaan(result.data.data)
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

    const getAllPembimbingJurusan = async() => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}account/get-supervisor`)
        .then((result) => {
          let temp_data = result.data.data
          let data_res = []
          let funcDataRes = function(data){
            for(var i in data){
              data_res.push({
                value : data[i].id_lecturer,
                label : data[i].name
              })
            }
          }
          funcDataRes(temp_data)
          setOptPembimbing(data_res)
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

    getAllPembimbingJurusan()
    getDataPemetaanPerusahaan()
  }, [history])

  const columns = [
    {
      title: 'Nama Perusahaan',
      dataIndex: 'company_name',
      ...getColumnSearchProps('company_name', 'Nama Perusahaan'),
      width: '40%',
    },
    {
      title: 'Nama Pembimbing Jurusan',
      dataIndex: 'lecturer_name',
      ...getColumnSearchProps('lecturer_name', 'Nama Pembimbing Jurusan'),
      width: '30%',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button
                id="button-pencil"
                htmlType="submit"
                shape="circle"
                style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                onClick={() => {
                  setIdPerusahaanChoosen(record.company_id)
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

  const onChange = (activeKey) => {
    setKey(activeKey)
  }


  const title = (judul) => {
    return (
      <>
        <div>
          <Row style={{ backgroundColor: '#00474f', padding: 5, borderRadius: 2 }}>
            <Col span={24}>
              <b>
                <h5 style={{ color: '#f6ffed', marginLeft: 30, marginTop: 6 }}>{judul}</h5>
              </b>
            </Col>
          </Row>
        </div>
        <div className="spacebottom"></div>
      </>
    )
  }

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
     
      <CCard className="mb-4">
      {title('PEMETAAN PEMBIMBING JURUSAN')}
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                <TabPane tab='PEMETAAN' key="1">
                  <h5 className='spacebottom spacetop' style={{textAlign:'center'}}>TABEL PEMETAAN PEMBIMBING JURUSAN PROGRAM STUDI {prodi} </h5>
                  <Table
                    scroll={{ x: 'max-content' }}
                    expandable={{
                      expandedRowRender: (rec) => (
                        <ul>
                          {rec.participant.map((data, idx) => {
                            return (
                              <Row style={{padding:7}} key={data.id}>
                                <Col span={2}>{idx+1}</Col>
                                <Col span={4}>{data.id}</Col>
                                <Col span={8}>{data.name}</Col>
                              </Row>
                            )
                          })}
                        </ul>
                      ),
                    }}
                    columns={columns}
                    dataSource={dataHasilPemetaan}
                    rowKey='id'
                    bordered
                  />
                </TabPane>

                {/* {perusahaan.length > 0 && (
                  <>
                    <TabPane tab="Prodi D4" key="2">
                      <h6>Tabel Pemetaan Perusahaan Prodi D4 </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={perusahaan}
                        rowKey="perusahaan."
                        bordered
                      />
                    </TabPane>
                  </>
                )} */}
              </Tabs>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <Modal
        title="Ubah Pembimbing Jurusan"
        open={isModaleditOpen}
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
          <div style={{marginTop:10}}></div>
          <hr/>
        <b >{dataToEdit.company_name}</b>
        <hr/>
        <div className='spacebottom'></div>
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => {
            HandleEditPembimbingJurusan(idPerusahaanChoosen, idChoosen)
            form1.resetFields()
          }}
          autoComplete="off"
          fields={[
            {
              name: 'nama_pembimbing',
              value: dataToEdit.lecturer_name,
            },
          ]}
        >
          <Form.Item
            label="Pilih Pembimbing"
            rules={[{ required: true, message: 'Nama Pembimbing Tidak Boleh Kosong' }]}
          >
            <Select
            name='nama_pembimbing'
              showSearch
              style={{
                width: 400,
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              defaultValue={dataToEdit.lecturer_name}
              onChange={(value) => {
                setIdChoosen(value)
                console.log(value)
              }}
              options={optPembimbing}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PemetaanPembimbingJurusan
