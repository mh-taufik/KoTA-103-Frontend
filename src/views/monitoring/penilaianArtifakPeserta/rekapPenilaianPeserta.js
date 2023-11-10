import React, { useEffect, useState } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
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
import '../pengisianDokumen/rpp/rpp.css'
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
  const [dataPeserta, setDataPeserta] = useState([])
  var rolePengguna = localStorage.id_role
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [isNotNullSupervisorParticipant, setIsNotNullSupervisorParticipant] = useState()
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
    history.push(`/rekapPenilaianPeserta/logbook/${idPeserta}`)
  }

  const actionSeeListRPPParticipant = (nimPeserta) => {
    history.push(`/rekapDokumenPeserta/rppPeserta/${nimPeserta}`)
  }

  const actionSeeListSelfAssessmentPeserta = (nimPeserta) => {
    history.push(`/rekapPenilaianPeserta/selfassessment/${nimPeserta}`)
  }

  const actionSeeListLaporan = (nimPeserta) => {
    history.push(`/rekapPenilaianPeserta/laporan/${nimPeserta}`)
  }

  useEffect(() => {
    const getAllListPeserta = async (record, index) => {
      axios.defaults.withCredentials = true
      if (rolePengguna !== '4') {
        await axios
          .get(
            `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all?type=comitte`,
          )
          .then((res) => {
            if (res.data.data !== null) {
              setIsNotNullSupervisorParticipant(true)
              let participant_supervisor = []

              let getParticipantSupervisor = function (data) {
                for (var iterate_data in data) {
                  let data_company = data[iterate_data].company_name
                  let data_supervisor = data[iterate_data].lecturer_name
                  let participant = data[iterate_data].participant
                  //console.log()
                  for (var iterate_participant in participant) {
                    participant_supervisor.push({
                      id: participant[iterate_participant].id,
                      name: participant[iterate_participant].name,
                      supervisor: data_supervisor,
                      company: data_company,
                    })
                  }
                }
              }

              getParticipantSupervisor(res.data.data)
              setDataPeserta(participant_supervisor)
            }else{
              setIsNotNullSupervisorParticipant(false)
            }
        
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
      } else if (rolePengguna === '4') {
        await axios
          .get(
            `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all?type=supervisor`,
          )
          .then((res) => {
            if (res.data.data !== null) {
              let participant_supervisor = []

              let getParticipantSupervisor = function (data) {
                for (var iterate_data in data) {
                  let data_company = data[iterate_data].company_name
                  let data_supervisor = data[iterate_data].lecturer_name
                  let participant = data[iterate_data].participant
                  //console.log()
                  for (var iterate_participant in participant) {
                    participant_supervisor.push({
                      id: participant[iterate_participant].id,
                      name: participant[iterate_participant].name,
                      supervisor: data_supervisor,
                      company: data_company,
                    })
                  }
                }
              }

              getParticipantSupervisor(res.data.data)
              setDataPeserta(participant_supervisor)
            }else{

            }
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
    }

    getAllListPeserta()
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
      dataIndex: 'id',
      width: '10%',
      ...getColumnSearchProps('id', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
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
                  onClick={() => actionSeeListRPPParticipant(record.id)}
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
      dataIndex: 'id',
      width: '10%',
      ...getColumnSearchProps('id', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
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
             
          
              <Popover content={<div>Lihat Rekap Nilai Logbook</div>}>
                <Button
                  type="primary"
                  style={{ borderColor: 'white' }}
                  onClick={() => {
                    console.log('logbook dari peserta : ', record)
                    actionSeeListLogbookParticipant(record.id)
               
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
      dataIndex: 'id',
      width: '10%',
      ...getColumnSearchProps('id', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
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
                content={<div>Lihat rekap nilai self assessment</div>}
              >
                {' '}
                <Button
                  type="primary"
                  style={{ borderColor: 'white' }}
                  size="small"
                  onClick={() => actionSeeListSelfAssessmentPeserta(record.id)}
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
      dataIndex: 'id',
      width: '10%',
      ...getColumnSearchProps('id', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
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
                    <div>Lihat rekap nilai laporan</div>{' '}
                    <div>(form penilaian pembimbing)</div>
                  </>
                }
                onClick={() => actionSeeListLaporan(record.id)}
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

  return isLoading ? (
    <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
  ) : (
    <>
      <CCard className="mb-4">
        {title('REKAP PENILAIAN PESERTA')}
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {dataPeserta.length > 0 && (
                  <>
                    <TabPane tab="PESERTA" key="1">
                    <CCard className="mb-4" style={{ padding: '20px' }}>
                        <Tabs type="card">
                          
                          <TabPane tab="Logbook" key="1.1">
                            <CCard className="mb-4" style={{ padding: '20px' }}>
                              {/* <CRow>
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
                                          <h6>Mahasiswa semua logbook sudah dinilai</h6>
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
                                          <h6>Mahasiswa belum dinilai semua logbook</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow> */}
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsLogbook}
                                        dataSource={dataPeserta}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Self Assessment" key="1.2">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              {/* <CRow>
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
                                          <h6>Self assessment peserta sudah dicek</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow> */}
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsSelfAssessment}
                                        dataSource={dataPeserta}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Form Penilaian Pembimbing Jurusan" key="1.3">
                          <CCard className="mb-4" style={{ padding: '20px' }}>
                              {/* <CRow>
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
                                          <h6>Seluruh penilaian sudah dilakukan</h6>
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
                                          <h6>Masih ada yang belum dilakukan penilaian</h6>
                                          <h5 style={{ color: '#CC0033' }}>56 Mahasiswa</h5>
                                        </Col>
                                      </Row>
                                    </CCardBody>
                                  </CCard>
                                </CCol>
                              </CRow> */}
                              <CCard className="mb-4">
                                <CCardBody>
                                  <CRow>
                                    <CCol sm={12}>
                                      <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={columnsLaporan}
                                        dataSource={dataPeserta}
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

                {/* {dataPeserta.length > 0 && (
                  <> */}
                    {/* <TabPane tab="Prodi D4" key="2">
                    <h4 className="justify">DOKUMEN PESERTA D4 - PRAKTIK KERJA LAPANGAN (PKL)</h4>
                      <div className="spacebottom"></div>
                      <hr />
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={dataPeserta}
                        rowKey="id"
                        bordered
                      />
                    </TabPane> */}
                    {/* <TabPane tab="Prodi D4" key="2">
                      <CCard className="mb-4" style={{ padding: '20px' }}>
                        <Tabs type="card">
                          
                          <TabPane tab="Logbook" key="2.1">
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
                                          <h6>Mahasiswa semua logbook sudah dinilai</h6>
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
                                          <h6>Mahasiswa belum dinilai semua logbook</h6>
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
                                        dataSource={dataPeserta}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Self Assessment" key="2.2">
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
                                          <h6>Self assessment peserta sudah dicek</h6>
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
                                        dataSource={dataPeserta}
                                        rowKey="id"
                                        bordered
                                      />
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCard>
                            </CCard>
                          </TabPane>
                          <TabPane tab="Form Penilaian Pembimbing Jurusan" key="2.3">
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
                                          <h6>Seluruh penilaian sudah dilakukan</h6>
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
                                          <h6>Masih ada yang belum dilakukan penilaian</h6>
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
                                        dataSource={dataPeserta}
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
                    </TabPane> */}
                  {/* </>
                )} */}
              </Tabs>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default RekapPenilaianPeserta
