import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Spin,
  Popconfirm,
  Popover,
  Card,
  Tag,
  FloatButton,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapLogbook = () => {
  const PARAMS = useParams()
  const NIM_PESERTA_FROM_PARAMS = PARAMS.id //ngambil dari params, dimana params untuk menunjukkan detail logbook
  const NIM_PESERTA_AS_USER = localStorage.username
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [dataPeserta, setDataPeserta] = useState([])

  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const desc = '*edit logbook yang dipilih'
  axios.defaults.withCredentials = true

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

  const refreshData = (index) => {
    let PESERTA
    if (rolePengguna === '1') {
      PESERTA = NIM_PESERTA_AS_USER
    } else {
      PESERTA = NIM_PESERTA_FROM_PARAMS
    }

    axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/get-all/${PESERTA}`)
      .then((result) => {
        var temp = result.data.data
        var temp_res = []
        const convertDate = (date) => {
          let temp_date_split = date.split('-')
          const month = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
          ]
          let date_month = temp_date_split[1]
          let month_of_date = month[parseInt(date_month) - 1]
          return date ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}` : null
        }

        const convertStatusPengecekan = (nilai) => {
          return nilai ? 'Sudah Dinilai' : 'Belum Dinilai'
        }

        let getTempRes = function (obj) {
          for (var i in obj) {
            temp_res.push({
              id: obj[i].id,
              date: convertDate(obj[i].date),
              grade: obj[i].grade,
              status: obj[i].status,
              grade_status: convertStatusPengecekan(obj[i].grade),
            })
          }
        }

        getTempRes(temp)
        setLogbookPeserta(temp_res)
        setIsLoading(false)
        setIsLoading(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  useEffect(() => {
    async function getDataInformasiPeserta() {
      let PESERTA
      if (rolePengguna === '1') {
        PESERTA = parseInt(NIM_PESERTA_AS_USER)
      } else {
        PESERTA = parseInt(NIM_PESERTA_FROM_PARAMS)
      }

      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-by-id`, {
          id: [PESERTA],
        })
        .then((result) => {
           setDataPeserta(result.data.data[0])
          
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

    async function getLogbookPeserta(record, index) {
      let PESERTA
      if (rolePengguna === '1') {
        PESERTA = NIM_PESERTA_AS_USER
      } else {
        PESERTA = NIM_PESERTA_FROM_PARAMS
      }
      enterLoading(index)
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/get-all/${PESERTA}`)
        .then((result) => {
         if(result.data.data.length>0){
          var temp = result.data.data
          var temp_res = []
          const convertDate = (date) => {
            let temp_date_split = date.split('-')
            const month = [
              'Januari',
              'Februari',
              'Maret',
              'April',
              'Mei',
              'Juni',
              'Juli',
              'Agustus',
              'September',
              'Oktober',
              'November',
              'Desember',
            ]
            let date_month = temp_date_split[1]
            let month_of_date = month[parseInt(date_month) - 1]
            return date ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}` : null
          }



          let getTempRes = function (obj) {
            for (var i in obj) {
              temp_res.push({
                id: obj[i].id,
                date: convertDate(obj[i].date),
                grade: obj[i].grade,
                status: obj[i].status
              })
            }
          }

          getTempRes(temp)
          setLogbookPeserta(temp_res)
         }else{
          setLogbookPeserta(result.data.data)
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
            history.push('/500')
          }
        })
    }
    getLogbookPeserta()
    getDataInformasiPeserta()
  }, [history])

  const confirmToEdit = () => {
    history.push(`/logbook/formEditLogbook/${wannaEdit.id}`)
  }

  const handleCreateLogbook = () => {
    history.push(`/logbook/formlogbook/${NIM_PESERTA_AS_USER}`)
  }

  const actionLihatDetailPenilaianLogbook = (idLogbook) => {
    history.push(
      `/rekapDokumenPeserta/logbookPeserta/${NIM_PESERTA_FROM_PARAMS}/detail/${idLogbook}`,
    )
  }

  const actionPenilaianLogbook = (idLogbook) => {
    history.push(
      `/rekapDokumenPeserta/logbookPeserta/${NIM_PESERTA_FROM_PARAMS}/nilai/${idLogbook}`,
    )
  }

  const AksiKembaliPanitia = () => {
    history.push(`/rekapDokumenPeserta`)
  }

  const columnsPanitiaPembimbing = [
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
      title: 'TANGGAL LOGBOOK',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date', 'Tanggal Logbook'),
    },
    {
      title: 'STATUS PENGUMPULAN',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status', 'Status Pengumpulan'),
      render: (text, record) => {
        var color = ''
        if (record.status === 'Terlambat') {
          color = 'volcano'
        } else if (record.status === 'Tepat Waktu') {
          color = 'green'
        }

        return <Tag color={color}>{record.status}</Tag>
      },
    },
    {
      title: 'PENILAIAN',
      dataIndex: 'grade',
      ...getColumnSearchProps('grade', 'Status Penilaian'),
      render: (text, record) => {
        let color
        if (record.grade === 'SANGAT BAIK') {
          color = 'green'
        } else if (record.grade === 'BAIK') {
          color = 'cyan'
        } else if (record.grade === 'CUKUP') {
          color = 'warning'
        } else if (record.grade === 'KURANG') {
          color = 'magenta'
        } else if (record.grade === 'BELUM DINILAI') {
          color = 'default'
        }
        return <Tag color={color}>{record.grade}</Tag>
      },
    },
    {
      title: 'AKSI',
      width: '20%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {rolePengguna !== '1' && rolePengguna !== '4' && (
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail dokumen logbook</div>}>
                  <Button
                    size="small"
                    type="primary"
                   shape='round'
                    onClick={() => actionLihatDetailPenilaianLogbook(record.id)}
                  >
                    Lihat Detail
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}

          {rolePengguna === '4' && (
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail dokumen logbook</div>}>
                  <Button
                    size="small"
                    shape='round'
                    onClick={() => actionLihatDetailPenilaianLogbook(record.id)}
                    style={{ backgroundColor: '#91caff' }}
                  >
                    Lihat Detail
                  </Button>
                </Popover>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat penilaian logbook</div>}>
                  <Button
                    size="small"
                    onClick={() => actionPenilaianLogbook(record.id)}
                    style={{ backgroundColor: '#ffd666' }}
                  >
                    &nbsp;&nbsp; &nbsp;&nbsp; Nilai &nbsp;&nbsp;&nbsp;&nbsp;
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ]

  const handleSeeDetailLogbook = (record) => {
    history.push(`/logbook/detaillogbook/${record.id}`)
  }

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
      title: 'TANGGAL LOGBOOK',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date', 'Tanggal Logbook'),
    },
    {
      title: 'STATUS PENGUMPULAN',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status', 'Status Pengumpulan'),
      render: (text, record) => {
        var color = ''
        if (record.status === 'Terlambat') {
          color = 'volcano'
        } else if (record.status === 'Tepat Waktu') {
          color = 'green'
        }
        return <Tag color={color}>{record.status}</Tag>
      },
    },

    {
      title: 'AKSI',
      width: '15%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              {record.grade !== 'BELUM DINILAI' && (
                <Popover content={<div>Pengeditan logbook tidak diizinkan</div>}>
                  <Button
                    id="button-pencil"
                    htmlType="submit"
                    shape="circle"
                    disabled
                    style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                    onClick={() => {
                      setWannaEdit(record)
                    }}
                  >
                    <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
                  </Button>
                </Popover>
              )}

              {record.grade === 'BELUM DINILAI' && (
                <Popover content={<div>Lakukan pengeditan logbook</div>}>
                  <Popconfirm
                    placement="topRight"
                    title="Yakin akan melakukan edit logbook?"
                    description={desc}
                    onConfirm={confirmToEdit}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      id="button-pencil"
                      htmlType="submit"
                      shape="circle"
                      style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                      onClick={() => {
                        setWannaEdit(record)
                      }}
                    >
                      <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
                    </Button>
                  </Popconfirm>
                </Popover>
              )}
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Popover content={<div>Klik untuk melihat isi detail RPP</div>}>
                <Button
                  id="button-eye"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: '#4096ff', borderColor: '#4096ff' }}
                  onClick={() => {
                    handleSeeDetailLogbook(record)
                  }}
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

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
      {rolePengguna !== '1' && (
        <Space
          className="spacebottom"
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <Card title="Informasi Peserta" size="small" style={{ padding: 30 }}>
            <Row style={{padding:5}}>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.name}</Col>
            </Row>
            <Row style={{padding:5}}>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.nim}</Col>
            </Row>
            <Row style={{padding:5}}>
              <Col span={4}>Sistem Kerja</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.work_system}</Col>
            </Row>
            <Row style={{padding:5}}>
              <Col span={4}>Angkatan</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.year}</Col>
            </Row>
          </Card>
        </Space>
      )}

      <CCard className="mb-4">
        {title('REKAP LOGBOOK PESERTA')}
        <CCardBody>
          {rolePengguna === '1' && (
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button
                  id="create-logbook"
                  size="sm"
                  shape="round"
                  style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                  onClick={handleCreateLogbook}
                >
                  Tambahkan Logbook Baru
                </Button>
              </Col>
            </Row>
          )}

          {rolePengguna === '1' && (
            <CRow>
              <CCol sm={12}>
                <hr />
                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columns}
                  dataSource={logbookPeserta}
                  rowKey="id"
                  bordered
                />
              </CCol>
            </CRow>
          )}

          {rolePengguna !== '5' && rolePengguna !== '1' && (
            <CRow>
              <CCol sm={12}>
                <div className="spacebottom"></div>

                <hr />
                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columnsPanitiaPembimbing}
                  dataSource={logbookPeserta}
                  rowKey="id"
                  bordered
                />
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>
      {rolePengguna !== '1' && (
        <FloatButton
          type="primary"
          onClick={AksiKembaliPanitia}
          icon={<ArrowLeftOutlined />}
          tooltip={<div>Kembali ke Rekap Dokumen Peserta</div>}
        />
      )}
    </>
  )
}

export default RekapLogbook
