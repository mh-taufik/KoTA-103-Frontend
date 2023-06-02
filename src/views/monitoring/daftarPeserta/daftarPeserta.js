import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faLock, faTrashCan, faEdit, faPen } from '@fortawesome/free-solid-svg-icons'
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
  Radio,
  Space,
  Spin,
  Popover,
} from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TabPane } = Tabs

const DaftarPeserta = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [pesertaD3, setPesertaD3] = useState([])
  const [pesertaD4, setPesertaD4] = useState([])
  var rolePengguna = localStorage.id_role
  var usernamePengguna = localStorage.username

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

  const refreshData = async (index) => {
    await axios.get(`http://localhost:1337/api/pesertas?filters[prodi]=D3`).then((res) => {
      let temp = res.data.data
      let temp1 = []
      let getTemp = function (obj) {
        for (var i in obj) {
          temp1.push({
            id: obj[i].id,
            nama: obj[i].attributes.nama,
            prodi: obj[i].attributes.prodi,
          })
        }
      }

      getTemp(temp)
      setPesertaD3(temp1)

      axios.get(`http://localhost:1337/api/pesertas?filters[prodi]=D4`).then((res) => {
        let temp = res.data.data
        let temp1 = []
        let getTemp = function (obj) {
          for (var i in obj) {
            temp1.push({
              id: obj[i].id,
              nama: obj[i].attributes.nama,
              prodi: obj[i].attributes.prodi,
            })
          }
        }

        getTemp(temp)
        setPesertaD4(temp1)
        setIsLoading(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
    })
  }

  useEffect(() => {
    const getAllListPesertaD3 = async (record, index) => {
      var APIGETPESERTA

      //GET DATA PESERTA BASED ON ROLE, PANITIA OR PEMBIMBING
      if (rolePengguna === '0') {
        APIGETPESERTA = 'http://localhost:1337/api/pesertas?filters[prodi]=D3'
      } else if (rolePengguna === '1') {
        APIGETPESERTA = 'http://localhost:1337/api/pesertas?filters[prodi]=D4'
      }

      await axios
        .get(`${APIGETPESERTA}`)
        .then((res) => {
          let temp = res.data.data
          let temp1 = []
          let getTemp = function (obj) {
            for (var i in obj) {
              temp1.push({
                id: obj[i].id,
                nama: obj[i].attributes.nama,
                prodi: obj[i].attributes.prodi,
              })
            }
          }

          getTemp(temp)
          setPesertaD3(temp1)
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    }

    const getAllListPesertaD4 = async (record, index) => {
      var APIGETPESERTAD4

      if (rolePengguna === '0') {
        APIGETPESERTAD4 = 'http://localhost:1337/api/pesertas?filters[prodi]=D4'
      } else if (rolePengguna === '1') {
        APIGETPESERTAD4 = 'http://localhost:1337/api/pesertas?filters[prodi]=D3'
      }

      await axios
        .get(`${APIGETPESERTAD4}`)
        .then((res) => {
          console.log('d3 all == ', res.data.data)
          setIsLoading(false)
          // setPesertaD4(res.data.data)
          let temp = res.data.data
          let temp1 = []
          let getTemp = function (obj) {
            for (var i in obj) {
              temp1.push({
                id: obj[i].id,
                nama: obj[i].attributes.nama,
                prodi: obj[i].attributes.prodi,
              })
            }
          }

          getTemp(temp)
          setPesertaD4(temp1)
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    }

    getAllListPesertaD3()
    getAllListPesertaD4()
  }, [history])

  const hoverButton = <div>Klik tombol, untuk melihat detail dashboard peserta</div>

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
      title: 'Nama Peserta',
      dataIndex: 'nama',
      width: '40%',
      ...getColumnSearchProps('nama', 'Nama'),
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Popover content={hoverButton}>
                <Button type="primary" size="middle">
                  Monitoring Peserta
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const onChange = (activeKey) => {
    setKey(activeKey)
  }
  // isLoading ? (<Spin indicator={antIcon} />) : (
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          {/* {localStorage.getItem("id_role") === "0" && key === "1" && (
              <>
              
              </>)} */}
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {pesertaD3.length > 0 && (
                  <>
                    <TabPane tab="Prodi D3" key="1">
                      <h6>Daftar Peserta Kerja Praktik (KP) </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={pesertaD3}
                        rowKey="id"
                        bordered
                      />
                    </TabPane>
                  </>
                )}

                {pesertaD4.length > 0 && (
                  <>
                    <TabPane tab="Prodi D4" key="2">
                      <h6>Daftar Peserta Praktik Kerja Lapangan (PKL) </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={pesertaD4}
                        rowKey="id"
                        bordered
                      />
                    </TabPane>
                  </>
                )}
              </Tabs>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DaftarPeserta
