import React, { useEffect, useState } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Tabs, Table, Button, Row, Col, Input, Space, Spin, Popover } from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import './rpp/rpp.css'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'
import Text from 'antd/lib/typography/Text'
import { useRef } from 'react'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TabPane } = Tabs

const ListDokumenPeserta = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [pesertaD3, setPesertaD3] = useState([])
  const [dataPeserta, setDataPeserta] = useState([])
  var rolePengguna = localStorage.id_role
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isNotNullSupervisorParticipant, setIsNotNullSupervisorParticipant] = useState()
  const searchInput = useRef(null)
  const contoller_abort = new AbortController()
  const [totalCountingDocument, setTotalCountingDocument] = useState()
  const [rekapRpp, setRekapRpp] = useState([])
  const [rekapLogbook,setRekapLogbook] = useState([])
  const [rekapSelfAssessment, setRekapSelfAssessment] = useState([])
  const [rekapLaporan, setRekapLaporan] = useState([])
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  const actionSeeListLogbookParticipant = (idPeserta) => {
    history.push(`/rekapDokumenPeserta/logbookPeserta/${idPeserta}`)
  }

  const actionSeeListRPPParticipant = (idPeserta) => {
    history.push(`/rekapDokumenPeserta/rppPeserta/${idPeserta}`)
  }

  const actionSeeListSelfAssessmentPeserta = (idPeserta) => {
    history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${idPeserta}`)
  }

  const actionSeeListLaporan = (idPeserta) => {
    history.push(`/rekapDokumenPeserta/laporan/${idPeserta}`)
  }

  useEffect(() => {
    const getAllRekap = async (record, index) => {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/rekap`)
      .then((result)=>{
        setRekapRpp(result.data.data)
        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/rekap`)
        .then((result)=>{
          setRekapLogbook(result.data.data)
          axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/rekap`)
          .then((result)=>{
            setRekapSelfAssessment(result.data.data)
            axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/rekap`)
            .then((result)=>{
              setRekapLaporan(result.data.data)
              setIsLoading(false)
            })
          })
        })
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
    }

    getAllRekap()
  }, [history])

  const columnsRpp = [
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
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'STATUS PROGRES RPP',
      dataIndex: 'status',
      width: '10%',
      ...getColumnSearchProps('status', 'Status Progres'),
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      width: '25%',
      ...getColumnSearchProps('company', 'Perusahaan'),
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover content={<div>Lihat list dokumen dan detail RPP</div>}>
                <Button
                  type="primary"
                  style={{ borderColor: 'white' }}
                  onClick={() => actionSeeListRPPParticipant(record.nim)}
                  size="small"
                >
                  <Text style={{ fontSize: '3', color: 'white' }}>Lihat Detail</Text>
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const columnsLogbook = [
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
      title: 'NIM',
      dataIndex: 'nim',
      width: '10%',
      ...getColumnSearchProps('nim', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'PROGRESS DALAM 2 MINGGU',
      dataIndex: 'status',
      width: '24%',
      ...getColumnSearchProps('status', 'Progress'),
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      width: '25%',
      ...getColumnSearchProps('company', 'Perusahaan'),
    },

    {
      title: 'Aksi',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover content={<div>Lihat list dokumen, detail, dan penilaian logbook</div>}>
                <Button
                  type="primary"
                  style={{ borderColor: 'white' }}
                  onClick={() => {
                   
                    actionSeeListLogbookParticipant(record.nim)
                  }}
                  size="small"
                >
                  <Text style={{ fontSize: '2', color: 'white' }}>Lihat Detail</Text>
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const columnsSelfAssessment = [
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
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'PROGRESS MINGGU SEKARANG',
      dataIndex: 'status',
      width: '23%',
      ...getColumnSearchProps('status', 'Progress'),
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      width: '25%',
      ...getColumnSearchProps('company', 'Perusahaan'),
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover
                content={<div>Lihat list dokumen, detail, dan penilaian self assessment</div>}
              >
                {' '}
                <Button
                  type="primary"
                  style={{ borderColor: 'white' }}
                  size="small"
                  onClick={() => actionSeeListSelfAssessmentPeserta(record.nim)}
                >
                  <Text style={{ fontSize: '3', color: 'white' }}>Lihat Detail</Text>
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const columnsLaporan = [
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
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'PROGRESS FASE SEKARANG',
      dataIndex: 'status',
      width: '20%',
      ...getColumnSearchProps('status', 'Progress'),
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      width: '25%',
      ...getColumnSearchProps('company', 'Perusahaan'),
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover
                content={
                  <>
                    <div>Lihat list dokumen dan detail laporan</div>{' '}
                    <div>(form penilaian pembimbing)</div>
                  </>
                }
                onClick={() => actionSeeListLaporan(record.nim)}
              >
                <Button type="primary" style={{ borderColor: 'white' }} size="small">
                  <Text style={{ fontSize: '3', color: 'white' }}>Lihat Detail</Text>
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

  /**HANDLE FILTERING */
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

  return  isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <CCard className="mb-4">
        {title('REKAP DOKUMEN PESERTA')}
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                <TabPane tab="RPP" key="2.1">
                  <Table
                    scroll={{ x: 'max-content' }}
                    columns={columnsRpp}
                    dataSource={rekapRpp}
                    rowKey="id"
                    bordered
                  />
                </TabPane>
                <TabPane tab="Logbook" key="2.2">
                  <Table
                    scroll={{ x: 'max-content' }}
                    columns={columnsLogbook}
                    dataSource={rekapLogbook}
                    rowKey="id"
                    bordered
                  />
                </TabPane>
                <TabPane tab="Self Assessment" key="2.3">
                  <Table
                    scroll={{ x: 'max-content' }}
                    columns={columnsSelfAssessment}
                    dataSource={rekapSelfAssessment}
                    rowKey="id"
                    bordered
                  />
                </TabPane>
                <TabPane tab="Laporan" key="2.4">
                  <Table
                    scroll={{ x: 'max-content' }}
                    columns={columnsLaporan}
                    dataSource={rekapLaporan}
                    rowKey="id"
                    bordered
                  />
                </TabPane>
              </Tabs>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ListDokumenPeserta
