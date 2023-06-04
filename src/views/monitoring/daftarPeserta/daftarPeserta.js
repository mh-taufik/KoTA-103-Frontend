import React, { useEffect, useState } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import {
  Tabs,
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Spin,
  Popover,
} from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'


const DaftarPeserta = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [peserta, setPeserta] = useState([])
  var rolePengguna = localStorage.id_role
  axios.defaults.withCredentials = true;

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

  const refreshData = async (index) => {
    await axios
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-all`)
    .then((res) => {
      console.log('response', res.data.data)
      let temp = res.data.data
      let temp1 = []
      let setProdi = (prodi)=>{return (prodi===0)?'D3':'D4'}
      let getTemp = function (obj) {
        for (var i in obj) {
          temp1.push({
            id_participant: obj[i].id_participant,
            name: obj[i].name,
            work_system: obj[i].work_system,
            nim : obj[i].nim,
            prodi : setProdi(obj[i].id_prodi),
            id_prodi : obj[i].id_prodi
          })
        }
      }

      getTemp(temp)
      setPeserta(temp1)
      setIsLoading(false)

      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }

  useEffect(() => {
    const getAllPeserta = async () => {
      //var APIGETPESERTA
      axios.defaults.withCredentials = true;

      //GET DATA PESERTA BASED ON ROLE, PANITIA OR PEMBIMBING
      //(rolePengguna ==='1')?  APIGETPESERTA = `${process.env.REACT_APP_API_GATEWAY_URL}participant/get-all` :  APIGETPESERTA = 'localhost:8080/participant/get-all'
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-all`)
        .then((res) => {
          console.log('response', res.data.data)
          let temp = res.data.data
          let temp1 = []
          let setProdi = (prodi)=>{return (prodi===0)?'D3':'D4'}
          let getTemp = function (obj) {
            for (var i in obj) {
              temp1.push({
                id_participant: obj[i].id_participant,
                name: obj[i].name,
                work_system: obj[i].work_system,
                nim : obj[i].nim,
                prodi : setProdi(obj[i].id_prodi),
                id_prodi : obj[i].id_prodi
              })
            }
          }

          getTemp(temp)
          setPeserta(temp1)
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

    getAllPeserta()

  }, [history])

  

  const columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'NIM',
      dataIndex: 'nim',
      width: '10%',
      ...getColumnSearchProps('nim', 'NIM'),
    },
    {
      title: 'PRODI',
      dataIndex: 'prodi',
      width: '5%',
      ...getColumnSearchProps('prodi', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '40%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'WORK SYSTEM',
      dataIndex: 'work_system',
      width: '15%',
      ...getColumnSearchProps('work_system', 'Nama'),
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover content={ <div>Klik tombol, untuk melihat detail dashboard peserta</div>}>
                <Button type="primary" size="small" onClick={()=>history.push(`/daftarPeserta/dashboardPeserta/${record.id_participant}`)}>
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

  const title = (judul) => {
    return (
      <>
        <div>
          <Row style={{ backgroundColor: '#00474f', padding: 3, borderRadius: 2 }}>
            <Col span={24}>
              <b>
                <h5 style={{ color: '#f6ffed', marginLeft: 30, marginTop: 6 }}>{judul}</h5>
              </b>
            </Col>
          </Row>
        </div>
      </>
    )
  }

  const items = [{
    key :'1',
    label :'PESERTA',
    children :  
    <Table
    scroll={{ x: 'max-content' }}
    columns={columns}
    dataSource={peserta}
    rowKey={peserta.id} 
    bordered
    pagination={true}
  />
  }]
  
  return (isLoading)? <Spin tip="Loading" size="large">
  <div className="content" />
</Spin>:(
    <>
      <CCard className="mb-4" key={1}>
        {title('DAFTAR PESERTA - DASHBOARD PESERTA KP (D3) DAN PKL (D4)')}
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" defaultActiveKey='1' items={items} onChange={onChange}></Tabs>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DaftarPeserta
