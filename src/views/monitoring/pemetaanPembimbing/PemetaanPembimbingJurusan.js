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
} from 'antd'
import axios from 'axios'
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
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [form1] = Form.useForm()
  const [pembimbing, setPembimbing] = useState([])
  const [pembimbingChoosen, setPembimbingChoosen] = useState([])
  const [idChoosen, setIdChoosen] = useState()
  const [idPerusahaanChoosen, setIdPerusahaanChoosen] = useState()
  axios.defaults.withCredentials = true
  const [perusahaan, setPerusahaan] = useState([])
  const [perusahaanEdit, setPerusahaanEdit] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [optPembimbing, setOptPembimbing] = useState([])
  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node
          }}
          placeholder={`Search ${name}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
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
    onFilter: (value, record) => {
      return get(record, dataIndex).toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select())
      }
    },
    render: (text) => {
      return isequal(state.searchedColumn, dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
    },
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
    setIsModalEditVisible(true)
    setChoose(record)
  }


  const refreshData = (index) => {
    axios.get('http://localhost:1337/api/perusahaans?populate=*').then((result) => {
      setPembimbingChoosen(' ')
      setPerusahaan(result.data.data)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
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
        setIsModalEditVisible(false)
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
    async function getDataPemetaanPerusahaan() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all`)
        .then((result) => {
          console.log('datas', result)
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

    const getAllPembimbingJurusan = async () => {
      await axios
        .get('http://localhost:1337/api/pembimbing-jurusans')
        .then((res) => {
          console.log('data pembimbing', res.data.data)
          let temp = res.data.data
          let temp1 = []
          let funcGetTempRes = function (data) {
            for (var i in data) {
              temp1.push({
                value: data[i].id,
                label: data[i].attributes.nama,
              })
            }
          }

          funcGetTempRes(temp)
          console.log('RES', temp1)
          setOptPembimbing(temp1)
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

    // getAllPembimbingJurusan()
    getDataPemetaanPerusahaan()
  }, [history])


  const columns = [
    {
      title: 'Nama Perusahaan',
      dataIndex: ['attributes', 'namaperusahaan'],
      ...getColumnSearchProps(['attributes', 'namaperusahaan'], 'Nama Perusahaan'),
      width: '40%',
    },
    {
      title: 'Nama Pembimbing Jurusan',
      dataIndex: ['attributes', 'pembimbingjurusan', 'data', 'attributes', 'nama'],
      // ...getColumnSearchProps( ['attributes', 'pembimbingjurusan', 'data', 'attributes', 'nama'], 'Nama Pembimbing Jurusan'),
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
                  setIdPerusahaanChoosen(record.id)

                  showModalEdit(record)
                  console.log('data edit', record)
                  // console.log("pembimbing choosen", pembimbingChoosen)
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

  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }


  const title = (judul) => {
    return (
      <>
        <div>
          <Row style={{ backgroundColor: '#00474f', padding: 5, borderRadius: 2 }}>
            <Col span={24}>
              <b>
                <h4 style={{ color: '#f6ffed', marginLeft: 30, marginTop: 6 }}>{judul}</h4>
              </b>
            </Col>
          </Row>
        </div>
        <div className="spacebottom"></div>
      </>
    )
  }

  // isLoading ? (<Spin indicator={antIcon} />) : (
  return (
    <>
      {title('PEMETAAN PEMBIMBING JURUSAN')}
      <CCard className="mb-4">
        <CCardBody>
          {localStorage.getItem('id_role') === '3' && key === '1' && <></>}
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {perusahaan.length > 0 && (
                  <>
                    <TabPane tab="PEMETAAN" key="1">
                      <h6>Tabel Pemetaan Perusahaan Prodi D3 </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        expandable={{
                          expandedRowRender: (rec) => (
                            <ul>
                              {rec.attributes.pesertas.data.map((data, idx) => {
                                return <li style={{fontSize:14, padding:5}} key={data.id}>{data.attributes.nama}</li>
                              })}
                            </ul>
                          ),
                        }}
                        columns={columns}
                        dataSource={perusahaan}
                        rowKey="id"
                        bordered
                      />
                    </TabPane>
                  </>
                )}

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
          onFinish={() => {HandleEditPembimbingJurusan(idPerusahaanChoosen, idChoosen);form1.resetFields()}}
          autoComplete="off"
          fields={[
            {
              name: 'namapembimbing',
              value: pembimbingChoosen,
            },
          ]}
        >
          <Form.Item
            label="Pilih Pembimbing"
            rules={[{ required: true, message: 'Nama Pembimbing Tidak Boleh Kosong' }]}
          >
            <Select
              showSearch
              
              style={{
                width: 200,
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={(value) => {
                setIdChoosen(value)
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
