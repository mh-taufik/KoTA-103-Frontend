import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
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
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'
import './rpp.css'
import moment from 'moment'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapRPP = () => {
  var idPeserta = useParams()
  //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [rppPeserta, setRppPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [wannaDetail, setWannaDetail] = useState(false)
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [infoDataPeserta, setInfoDataPeserta] = useState([])

  const desc = '*edit RPP yang dipilih'
  axios.defaults.withCredentials = true

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
      PESERTA = idPengguna
    } else {
      PESERTA = idPeserta.id
    }
    axios
      .get(`http://localhost:1337/api/rpps?populate=*&filters[peserta][username]=${PESERTA}`)
      .then((result) => {
        let temp = []
        let temp1 = result.data.data
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

        const convertStatusPengecekan =(status)=>{
          return status?'Sudah Dicek' : 'Belum Dicek'
        }

        let getDataTempRPP = function (obj) {
          for (var i in obj) {
            temp.push({
              id: obj[i].id,
              judul_pekerjaan: obj[i].attributes.judulpekerjaan,
              status: obj[i].attributes.status,
              deskripsi_tugas: obj[i].attributes.deskripsi_tugas,
              tanggal_mulai: convertDate(obj[i].attributes.tanggal_mulai),
              tanggal_selesai: convertDate(obj[i].attributes.tanggal_selesai),
              waktupengisian: obj[i].attributes.waktupengisian,
            })
          }
        }

        getDataTempRPP(temp1)
        setRppPeserta(temp)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  /** GET DATA PESERTA */
  const GetDataInfoPeserta = async (index) => {
    var PESERTA
    if (rolePengguna === '1') {
      PESERTA = idPengguna
    } else {
      PESERTA = idPeserta.id
    }
    await axios
      .get(`http://localhost:1337/api/pesertas?filters[username][$eq]=${PESERTA}`)
      .then((result) => {
        setInfoDataPeserta(result.data.data[0].attributes)
        console.log('res', result)
        console.log('data peserta', result.data.data[0].attributes)
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

  /**
   * idPengguna = role nya peserta
   * idPengguna = role selain peserta
   **/

  useEffect(() => {
    console.log('data rpp', rppPeserta)
  }, [rppPeserta])

  useEffect(() => {
    console.log('idpeserta ==> ', idPeserta.id)

    async function getRppPeserta(index) {
      let PESERTA
      if (rolePengguna === '1') {
        PESERTA = idPengguna
      } else {
        PESERTA = idPeserta.id
      }
      enterLoading(index)
      await axios
        .get(`http://localhost:1337/api/rpps?populate=*&filters[peserta][username]=${PESERTA}`)
        .then((result) => {
          let temp = []
          let temp1 = result.data.data
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

          let getDataTempRPP = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                judul_pekerjaan: obj[i].attributes.judulpekerjaan,
                status: obj[i].attributes.status,
                deskripsi_tugas: obj[i].attributes.deskripsi_tugas,
                tanggal_mulai: convertDate(obj[i].attributes.tanggal_mulai),
                tanggal_selesai: convertDate(obj[i].attributes.tanggal_selesai),
                waktupengisian: obj[i].attributes.waktupengisian,
              })
            }
          }

          getDataTempRPP(temp1)
          setRppPeserta(temp)
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

    GetDataInfoPeserta()
    getRppPeserta()
  }, [history])

  /** HANDLE FILTERING TABLE */
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

  /** TOMBOL EDIT RPP */
  const confirmToEdit = () => {
    history.push(`/rencanaPenyelesaianProyek/edit/${wannaEdit.id}`)
  }

  /** TOMBOL DETAIL RPP */
  const confirmToDetail = (idMhs) => {
    idMhs
      ? history.push(`/rencanaPenyelesaianProyek/DetailRPP/${wannaDetail.id}/${idMhs}`)
      : history.push(`/rencanaPenyelesaianProyek/detail/${wannaDetail.id}`)
  }

  /** TOMBOL CREATE RPP BARU */
  const handleCreateRPP = () => {
    history.push(`/rencanaPenyelesaianProyek/peserta/formPengisianRPP`)
  }

  /** TOMBOL DETAIL RPP PESERTA (PEMBIMBING DAN PANITIA) */
  const actionLihatRPPPeserta = (idRPP) => {
    history.push(`/rekapDokumenPeserta/rppPeserta/${idPeserta.id}/detail/${idRPP}`)
  }

  /** HOVER BUTTON */
  const hoverButtonLihatDetail = <div>Klik tombol, untuk melihat isi RPP peserta</div>

  /** KOLOM UNTUK PANITIA DAN PEMBIMBING JURUSAN */
  const columnsPanitiaPembimbing = [
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
      title: 'Judul Pekerjaan',
      dataIndex: 'judul_pekerjaan',
      key: 'judul_pekerjaan',
      ...getColumnSearchProps('judul_pekerjaan', 'Judul Pekerjaan'),
    },
    {
      title: 'Tanggal Mulai Pengerjaan',
      dataIndex: 'tanggal_mulai',
      key: 'tanggal_mulai',
      ...getColumnSearchProps('tanggal_mulai', 'Tanggal Mulai Pengerjaan'),
    },
    {
      title: 'Tanggal Selesai Pengerjaan',
      dataIndex: 'tanggal_selesai',
      key: 'tanggal_selesai',
      ...getColumnSearchProps('tanggal_selesai', 'Tanggal Selesai Pengerjaan'),
    },
    {
      title: 'Status Pengumpulan',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status', 'Status'),
    },
    {
      title: 'Aksi',
      width: '5%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {rolePengguna === '0' && (
            <Row>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Popover content={hoverButtonLihatDetail}>
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => actionLihatRPPPeserta(record.id)}
                  >
                    Lihat Detail
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}

          {rolePengguna === '4' && (
            <Row>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Popconfirm
                  placement="topRight"
                  title="Yakin akan melakukan edit RPP?"
                  description={desc}
                  onConfirm={confirmToEdit}
                  okText="Yes"
                  cancelText="No"
                >
                  {/* <Button
              id="button-pencil"
              htmlType="submit"
              shape="circle"
              style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
              onClick={() => {
                setWannaEdit(record)
              }}
            >
              <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
            </Button> */}
                  <Button>akyam</Button>
                </Popconfirm>
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ]

/** KOLOM PESERTA */
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
      title: 'Judul Pekerjaan',
      dataIndex: 'judul_pekerjaan',
      key: 'judul_pekerjaan',
      ...getColumnSearchProps('judul_pekerjaan', 'Judul Pekerjaan'),
    },
    {
      title: 'Tanggal Mulai Pengerjaan',
      dataIndex: 'tanggal_mulai',
      key: 'tanggal_mulai',
      ...getColumnSearchProps('tanggal_mulai', 'Tanggal Mulai Pengerjaan'),
    },
    {
      title: 'Tanggal Selesai Pengerjaan',
      dataIndex: 'tanggal_selesai',
      key: 'tanggal_selesai',
      ...getColumnSearchProps('tanggal_selesai', 'Tanggal Selesai Pengerjaan'),
    },
    {
      title: 'Status Pengumpulan',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status', 'Status'),
    },

    {
      title: 'Aksi',
      width: '10%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Popconfirm
                placement="topRight"
                title="Yakin akan melakukan edit RPP?"
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
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Popconfirm
                placement="topRight"
                title="Yakin akan melihat detail RPP?"
                description={desc}
                onConfirm={() => confirmToDetail()}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  id="button-eye"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: '#bae0ff', borderColor: '#bae0ff' }}
                  onClick={() => {
                    setWannaDetail(record)
                  }}
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </>
      ),
    },
  ]


  // isLoading ? (
  //   <Spin indicator={antIcon} />
  // ) :
  const buttonKembaliKeListHandling= () => {
    history.push(`/rekapDokumenPeserta`)
  }
  const title = (judul) => {
    return (
      <>
        <div>
          <Row style={{ backgroundColor: '#00474f', padding: 5, borderRadius:2 }}>
            <Col span={24}>
              <b>
                <h4 style={{color:'#f6ffed', marginLeft:30, marginTop:6}}>{judul}</h4>
              </b>
            </Col>
          </Row>
        </div>
        <div className="spacebottom"></div>
      </>
    )
  }

  return (
    <>
       <div>
        {/* {rolePengguna === '1' && <h1>[Hi Data Peserta]</h1>} */}

        {rolePengguna !== '1' && (
          <Space
            direction="vertical"
            size="middle"
            bordered
            style={{
              display: 'flex',
            }}
          >
            <Card title="Informasi Peserta" size="small">
              <Row>
                <Col span={4}>Nama Lengkap</Col>
                <Col span={2}>:</Col>
                <Col span={8}>Gina Anifah Choirunnisa</Col>
              </Row>
              <Row>
                <Col span={4}>NIM</Col>
                <Col span={2}>:</Col>
                <Col span={8}>201511009</Col>
              </Row>
            </Card>
          </Space>
        )}
      </div>
      <div className="spacetop"></div>
      <div className="spacetop">
        <CCard className="mb-4">
          {title('REKAP RENCANA PENYELESAIAN PROYEK PESERTA')}
          <CCardBody>
          {rolePengguna !== '1' && (
            <Popover content={<div>ke list dokumen peserta</div>}>
              <Button type="primary" shape="round" size="small" onClick={buttonKembaliKeListHandling}>
                Kembali
              </Button>
            </Popover>
          )}
            {rolePengguna === '1' && (
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button
                    id="create-logbook"
                    size="sm"
                    shape="round"
                    style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                    onClick={handleCreateRPP}
                  >
                    Tambahkan RPP Baru
                  </Button>
                </Col>
              </Row>
            )}

            {rolePengguna === '1' && (
              <CRow>
                <CCol sm={12}>
                  <hr></hr>
                  <Table
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    dataSource={rppPeserta}
                    rowKey="id"
                    bordered
                  />
                </CCol>
              </CRow>
            )}

            {rolePengguna !== '1' && (
              <CRow>
                <CCol sm={12}>
                <h4 className="justify">TABEL RENCANA PENYELESAIAN PROYEK (RPP) PESERTA</h4>
                  <hr />
                  <Table
                    scroll={{ x: 'max-content' }}
                    columns={columnsPanitiaPembimbing}
                    dataSource={rppPeserta}
                    rowKey="id"
                    bordered
                  />
                </CCol>
              </CRow>
            )}
          </CCardBody>
        </CCard>
      </div>
      
    </>
  )
}

export default RekapRPP
