import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../rpp/rpp.css'
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
  Popconfirm,
  Popover,
  Card,
  Tag,
  Alert,
  FloatButton,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Box } from '@mui/material'
import moment from 'moment'
import get from 'lodash.get'
import isequal from 'lodash.isequal'
import { message } from 'antd'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapLaporanPeserta = () => {
  var idPeserta = useParams() //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaCreate, setWannaCreate] = useState(false)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
  const [dataLaporanPeserta, setDataLaporanPeserta] = useState([])
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [statusTerlambat, isStatusTerlambat] = useState(false)
  const [statusBelumDiNilai, isStatusBelumDinilai] = useState(false)
  const desc = '*edit logbook yang dipilih'
  axios.defaults.withCredentials = true
  const [messageApi, contextHolder] = message.useMessage()
  const info = (link) => {
    navigator.clipboard.writeText(link)
    messageApi.info('Link disalin')
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
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  const refreshData = async (index) => {
    let NIM_PESERTA
    if (rolePengguna !== '1') {
      NIM_PESERTA = parseInt(idPeserta.id)
    } else {
      NIM_PESERTA = parseInt(idPengguna)
    }

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
      // console.log(month_of_date,'isi date monts', month_of_date)
      return date ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}` : null
    }
    
    await axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get-all/${NIM_PESERTA}`)
      .then((res) => {
        let temp = res.data.data
        let temp_after = []
        let funcGetTempAfter = function(obj){
          for(var i in obj){
            temp_after.push({
              id : obj[i].id,
              uri : obj[i].uri,
              phase : obj[i].phase,
              upload_date : convertDate(obj[i].upload_date)
            })
          }
        }
        funcGetTempAfter(temp)
        setDataLaporanPeserta(temp_after)
        setIsLoading(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  useEffect(() => {
    async function getInformasiDataPeserta() {}

    async function getLaporanPeserta(record, index) {
      let NIM_PESERTA
      if (rolePengguna !== '1') {
        NIM_PESERTA = parseInt(idPeserta.id)
      } else {
        NIM_PESERTA = parseInt(idPengguna)
      }

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
        // console.log(month_of_date,'isi date monts', month_of_date)
        return date ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}` : null
      }


      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get-all/${NIM_PESERTA}`)
        .then((res) => {
          let temp = res.data.data
          let temp_after = []
          let funcGetTempAfter = function(obj){
            for(var i in obj){
              temp_after.push({
                id : obj[i].id,
                uri : obj[i].uri,
                phase : obj[i].phase,
                upload_date : convertDate(obj[i].upload_date)
              })
            }
          }
          funcGetTempAfter(temp)
          setDataLaporanPeserta(temp_after)
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

    getLaporanPeserta()
  }, [history])

  const actionPenilaianFormPembimbingJurusan = (idLogbook) => {
    history.push(`/rekapDokumenPeserta/laporan/${idPeserta.id}/nilai/${idLogbook}`)
  }

  const AksiKembaliPanitia = () => {
    history.push(`/rekapDokumenPeserta`)
  }

  const columnsPanitiaPembimbing = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '2%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'Tanggal Pengumpulan',
      dataIndex: 'upload_date',
      width: '10%',
      ...getColumnSearchProps('upload_date', 'Tanggal Pengumpulan'),
    },
    // {
    //   title: 'Deadline Pengumpulan',
    //   dataIndex: ['attributes', 'deadlinen'],
    //   width: '7%',
    //   ...getColumnSearchProps(['attributes', 'deadlinen'], 'Deadline'),
    // },
    // {
    //   title: 'Status',
    //   dataIndex: ['attributes', 'status'],
    //   width: '7%',
    //   ...getColumnSearchProps(['attributes', 'status'], 'Status'),
    //   render: (text, record) => {
    //     var color = ''
    //     if (record.attributes.status === 'terlambat') {
    //       color = 'volcano'
    //     } else if (record.attributes.status === 'tepat waktu') {
    //       color = 'green'
    //     }

    //     return <Tag color={color}>{record.attributes.status}</Tag>
    //   },
    // },
    {
      title: 'Link Drive',
      dataIndex: 'uri',
      width: '10%',
      ...getColumnSearchProps('uri', 'Link Drive'),
    },
    {
      title: 'Aksi',
      width: '15%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {rolePengguna !== '1' && (
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover
                  content={
                    <>
                      <div>Lihat penilaian laporan</div>
                      <div>(Form Penilaian Pembimbing)</div>
                    </>
                  }
                >
                  <Button
                    size="medium"
                    onClick={() => actionPenilaianFormPembimbingJurusan(record.id)}
                    style={{ backgroundColor: '#fa8c16', color: 'white' }}
                  >
                    &nbsp;&nbsp;Penilaian&nbsp;&nbsp;
                  </Button>
                </Popover>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Salin Link Gdrive</div>}>
                  <Button type="primary" onClick={() => info(record.uri)}>
                    Copy
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ]

  const pengumpulanLaporan = (id) => {
    history.push(`/laporan/submissionLaporan/${id}`)
  }

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
      title: 'Tanggal Pengumpulan',
      dataIndex: 'upload_date',
      width: '10%',
      ...getColumnSearchProps('upload_date', 'Tanggal Pengumpulan'),
    },
    // {
    //   title: 'Deadline Pengumpulan',
    //   dataIndex: ['attributes', 'deadlinen'],
    //   width: '10%',
    //   ...getColumnSearchProps(['attributes', 'deadlinen'], 'Deadline'),
    // },
    // {
    //   title: 'Status',
    //   width: '10%',
    //   dataIndex: ['attributes', 'status'],
    //   ...getColumnSearchProps(['attributes', 'status'], 'Status'),
    //   render: (text, record) => {
    //     var color = ''
    //     if (record.attributes.status === 'terlambat') {
    //       color = 'volcano'
    //     } else if (record.attributes.status === 'tepat waktu') {
    //       color = 'green'
    //     }

    //     return <Tag color={color}>{record.attributes.status}</Tag>
    //   },
    // },
    {
      title: 'Link Drive',
      dataIndex: 'uri',
      width: '10%',
      ...getColumnSearchProps('uri', 'Link Drive'),
    },

    {
      title: 'Aksi',
      width: '15%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Popover content={<div>Lakukan pengumpulan Laporan KP / PKL</div>}>
                <Button type="primary" onClick={() => pengumpulanLaporan(record.id)}>
                  Pengumpulan
                </Button>
              </Popover>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Popover content={<div>Salin Link Gdrive</div>}>
                <Button type="primary" onClick={() => info(record.uri)}>
                  Copy
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
                <h4 style={{ color: '#f6ffed', marginLeft: 30, marginTop: 6 }}>{judul}</h4>
              </b>
            </Col>
          </Row>
        </div>
        <div className="spacebottom"></div>
      </>
    )
  }

  // isLoading ? (
  //   <Spin indicator={antIcon} />
  // ) :

  return (
    <>
      <div>
        {/* {rolePengguna === '1' && <h1>[Hi Data Peserta]</h1>} */}
        {contextHolder}
        {rolePengguna !== '1' && (
          <Space
            direction="vertical"
            size="middle"
            style={{
              display: 'flex',
            }}
          >
            <Card title="Informasi Peserta" size="small" style={{ padding: 25 }}>
              <Row>
                <Col span={4}>Nama Lengkap</Col>
                <Col span={2}>:</Col>
                <Col span={8}>Gina Anifah Choirunnisa</Col>
              </Row>
              <Row>
                <Col span={4}>NIM</Col>
                <Col span={2}>:</Col>
                <Col span={8}>181524003</Col>
              </Row>
            </Card>
          </Space>
        )}
      </div>
      <CCard className="mb-4">
        {title('REKAP LAPORAN PESERTA')}
        <CCardBody>
          {rolePengguna !== '1' && (
            <FloatButton
              type="primary"
              onClick={AksiKembaliPanitia}
              icon={<ArrowLeftOutlined />}
              tooltip={<div>Kembali ke Rekap Dokumen Peserta</div>}
            />
          )}

          {rolePengguna === '1' && (
            <CRow>
              <CCol sm={12}>
                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columns}
                  dataSource={dataLaporanPeserta}
                  rowKey="id"
                  bordered
                />
              </CCol>
            </CRow>
          )}

          {rolePengguna !== '1' && (
            <CRow>
              <CCol sm={12}>
                <div className="spacebottom"></div>
                <h4 className="justify">LAPORAN PESERTA DAN FORM PEMBIMBING JURUSAN</h4>
                <hr />
                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columnsPanitiaPembimbing}
                  dataSource={dataLaporanPeserta}
                  rowKey="id"
                  bordered
                />
              </CCol>
            </CRow>
          )} 
        </CCardBody>
      </CCard>
    </>
  )
}

export default RekapLaporanPeserta
