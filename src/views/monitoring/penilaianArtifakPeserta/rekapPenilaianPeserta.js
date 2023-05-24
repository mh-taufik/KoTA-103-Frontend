import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencil,
  faLock,
  faTrashCan,
  faEdit,
  faPen,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
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
import './rpp/rpp.css'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'
import Text from 'antd/lib/typography/Text'
import { useRef } from 'react'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TabPane } = Tabs

const RekapPenilaianPeserta = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [pesertaD3, setPesertaD3] = useState([])
  const [pesertaD4, setPesertaD4] = useState([])
  var rolePengguna = localStorage.id_role
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
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
    const getAllListPesertaD3 = async (record, index) => {
      var APIGETPESERTA

      //GET DATA PESERTA BASED ON ROLE, PANITIA OR PEMBIMBING (tes aja)
      if (rolePengguna === '0') {
        APIGETPESERTA = 'http://localhost:1337/api/pesertas?filters[prodi]=D3'
      } else if (rolePengguna === '1') {
        APIGETPESERTA = 'http://localhost:1337/api/pesertas?filters[prodi]=D4'
      }

      await axios
        .get(`${APIGETPESERTA}`)
        .then((res) => {
          // console.log("d3 all == ", res.data.data)
          // setPesertaD3(res.data.data)
          setIsLoading(false)
          console.log('d3', res.data.data)
          var temp = []
          var tempdata = res.data.data
          var getDataD3 = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                nama: obj[i].attributes.nama,
                prodi: obj[i].attributes.prodi,
                username: obj[i].attributes.username,
              })
            }
          }

          getDataD3(tempdata)
          console.log('temp', temp)
          setPesertaD3(temp)
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
        //API NYA PERLU DISESUAIKAN
        APIGETPESERTAD4 = 'http://localhost:1337/api/pesertas?filters[prodi]=D4'
      } else if (rolePengguna === '1') {
        APIGETPESERTAD4 = 'http://localhost:1337/api/pesertas?filters[prodi]=D3'
      }

      await axios
        .get(`${APIGETPESERTAD4}`)
        .then((res) => {
          console.log('d4 all == ', res.data.data)
          setIsLoading(false)
          // setPesertaD4(res.data.data)
          var temp = []
          var tempdata = res.data.data
          var getDataD4 = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                nama: obj[i].attributes.nama,
                prodi: obj[i].attributes.prodi,
                username: obj[i].attributes.username,
              })
            }
          }

          getDataD4(tempdata)
          console.log('temp', temp)
          setPesertaD4(temp)
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

  const columnsRpp = [
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
      dataIndex: 'username',
      width: '5%',
      key: 'username',
    },
    {
      title: 'Nama Peserta',
      dataIndex: 'nama',
      width: '40%',
      key: 'nama',
      ...getColumnSearchProps('nama'),
    },
    {
      title: 'Aksi',
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
                  onClick={() => actionSeeListRPPParticipant(record.username)}
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
      dataIndex: 'username',
      width: '5%',
      key: 'username',
    },
    {
      title: 'Nama Peserta',
      dataIndex: 'nama',
      width: '40%',
      key: 'nama',
      ...getColumnSearchProps('nama'),
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
                    console.log('logbook dari peserta : ', record)
                    actionSeeListLogbookParticipant(record.username)
               
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
      dataIndex: 'username',
      width: '5%',
      key: 'username',
    },
    {
      title: 'Nama Peserta',
      dataIndex: 'nama',
      width: '40%',
      key: 'nama',
      ...getColumnSearchProps('nama'),
    },
    {
      title: 'Aksi',
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
                  onClick={() => actionSeeListSelfAssessmentPeserta(record.username)}
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

  const columnsLaporan= [
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
      dataIndex: 'username',
      width: '5%',
      key: 'username',
    },
    {
      title: 'Nama Peserta',
      dataIndex: 'nama',
      width: '40%',
      key: 'nama',
      ...getColumnSearchProps('nama'),
    },
    {
      title: 'Aksi',
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
                onClick={() => actionSeeListLaporan(record.username)}
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

  return isLoading ? (
    <Spin indicator={antIcon} />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {pesertaD3.length > 0 && (
                  <>
                    <TabPane tab="Prodi D3" key="1">
                    <CCard className="mb-4" style={{ padding: '20px' }}>
                        <Tabs type="card">
                          <TabPane tab="RPP" key="2.1">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Sudah Mengumpulkan RPP</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Belum memiliki RPP</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsRpp}
                                        dataSource={pesertaD3}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Logbook" key="2.2">
                            <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Sudah Mengumpulkan Semua Logbook</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Logbook Masih Belum Lengkap</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsLogbook}
                                        dataSource={pesertaD3}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Self Assessment" key="2.3">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Self Assesment Lengkap</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Self Assessment Tidak Lengkap</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsSelfAssessment}
                                        dataSource={pesertaD3}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Laporan" key="2.4">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Laporan Lengkap</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Laporan Tidak Lengkap</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsLaporan}
                                        dataSource={pesertaD3}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                        </Tabs>
                      </CCard>
                    </TabPane>
                  </>
                )}

                {pesertaD4.length > 0 && (
                  <>
                    {/* <TabPane tab="Prodi D4" key="2">
                    <h4 className="justify">DOKUMEN PESERTA D4 - PRAKTIK KERJA LAPANGAN (PKL)</h4>
                      <div className="spacebottom"></div>
                      <hr />
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={pesertaD4}
                        rowKey="id"
                        bordered
                      />
                    </TabPane> */}
                    <TabPane tab="Prodi D4" key="2">
                      <CCard className="mb-4" style={{ padding: '20px' }}>
                        <Tabs type="card">
                          <TabPane tab="RPP" key="2.1">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Sudah Mengumpulkan RPP</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Belum memiliki RPP</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsRpp}
                                        dataSource={pesertaD4}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Logbook" key="2.2">
                            <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Sudah Mengumpulkan Semua Logbook</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Logbook Masih Belum Lengkap</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsLogbook}
                                        dataSource={pesertaD4}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Self Assessment" key="2.3">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Self Assesment Lengkap</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Self Assessment Tidak Lengkap</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsSelfAssessment}
                                        dataSource={pesertaD4}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Laporan" key="2.4">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              <CRow>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#339900',
                                              borderColor: '#339900',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              style={{ paddingTop: '10px' }}
                                              icon={faCheck}
                                            />
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Laporan Lengkap</h6>
                                          <h5 style={{ color: '#339900' }}>45 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                                <CCol sm={6}>
                                  <CCard className="mb-4" id="card-filter">
                                    <CCardBody>
                                      <Row justify="space-around" align="middle">
                                        <Col span={6}>
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                              backgroundColor: '#CC0033',
                                              borderColor: '#CC0033',
                                              color: 'white',
                                              width: '60px',
                                              height: '60px',
                                              fontSize: '30px',
                                            }}
                                          >
                                            !
                                          </Button>
                                        </Col>
                                        <Col span={18} style={{ paddingTop: '10px' }}>
                                          <h6>Laporan Tidak Lengkap</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow>
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsLaporan}
                                        dataSource={pesertaD4}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                        </Tabs>
                      </CCard>
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

export default RekapPenilaianPeserta
