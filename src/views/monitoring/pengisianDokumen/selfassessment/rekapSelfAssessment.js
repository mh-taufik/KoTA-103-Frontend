import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddIcon from '@mui/icons-material/Add'
import { ArrowLeftOutlined } from '@ant-design/icons'
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
  FloatButton,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'
import { HoverStyle } from 'devextreme-react/chart'
import App from '../../penilaianArtifakPeserta/logbook/penilaianLogbook'
import { Fab } from '@mui/material'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapSelfAssessment = () => {
  var idPeserta = useParams() //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaCreate, setWannaCreate] = useState(false)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const { id } = useParams()
  const [loadings, setLoadings] = useState([])
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [jumlahSelfAssessmentTidakDikumpulkan, setJumlahSelfAssessmentTidakDikumpulkan] = useState()
  const [jumlahSelfAssessmentDikumpulkan, setJumlahSelfAssessmentDikumpulkan] = useState()
  const desc = '*edit logbook yang dipilih'
  axios.defaults.withCredentials = true

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  function formatDate(string) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(string).toLocaleDateString([], options)
  }

  useEffect(() => {
    console.log('idpeserta ==> ', idPeserta.id)

    async function getSelfAssessment(record, index) {
      let PESERTA
      if (rolePengguna === '1') {
        PESERTA = idPengguna
      } else {
        PESERTA = idPeserta.id
      }
      enterLoading(index)
      await axios
        .get(
          `http://localhost:1337/api/selfassessments?populate=*&filters[peserta][username]=${PESERTA}`,
        )
        .then((response) => {
          var temp = []
          var temp1 = response.data.data
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

          var getTempSelfAssessment = function (obj) {
            for (var i in obj) {
              temp.push({
                tanggal_mulai: convertDate(obj[i].attributes.tanggalmulai),
                tanggal_selesai: convertDate(obj[i].attributes.tanggalselesai),
                tanggal_pengumpulan: convertDate(obj[i].attributes.tanggal_pengumpulan),
                id: obj[i].id,
              })
            }
          }
          console.log('SA', response.data.data)
          getTempSelfAssessment(temp1)
          setSelfAssessmentPeserta(temp)
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

    getSelfAssessment()
  }, [history])

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

  //PENCARIAN
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

  const refreshData = (index) => {
    var PESERTA
    if (rolePengguna === '1') {
      PESERTA = idPengguna
    } else {
      PESERTA = idPeserta.id
    }
    axios
      .get(
        `http://localhost:1337/api/selfassessments?populate=*&filters[peserta][username]=${PESERTA}`,
      )
      .then((response) => {
        var temp = []
        var temp1 = response.data.data
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

        var getTempSelfAssessment = function (obj) {
          for (var i in obj) {
            temp.push({
              tanggal_mulai: convertDate(obj[i].attributes.tanggalmulai),
              tanggal_selesai: convertDate(obj[i].attributes.tanggalselesai),
              tanggal_pengumpulan: convertDate(obj[i].attributes.tanggal_pengumpulan),
              id: obj[i].id,
            })
          }
        }
        console.log('SA', response.data.data)
        getTempSelfAssessment(temp1)
        setSelfAssessmentPeserta(temp)
        setLogbookPeserta(response.data.data)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  //EDIT LOGBOOK
  const confirmToEdit = () => {
    history.push(`/logbook/formEditLogbook/${wannaEdit.id}`)
  }

  //CREATE
  const handleCreateSelfAssessment = () => {
    history.push(`/selfAssessment/formSelfAssessment`)
  }
  /** RESET SEARCH */

  const lihatRekapNilaiSelfAssessment = () => {
    history.push(
      `/rekapDokumenPeserta/selfAssessmentPeserta/${idPeserta.id}/rekapPenilaianSelfAssessment`,
    )
  }

  const lihatDetailSelfAssessment = (idsa) => {
    rolePengguna !== '1'
      ? history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${idPeserta.id}/detail/${idsa}`)
      : history.push(`/selfAssessment/formSelfAssessment/detail/${idsa}`)
  }

  const lakukanPenilaianSelfAssessment = (idsa) => {
    history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${idPeserta.id}/penilaian/${idsa}`)
  }

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
      title: 'Tanggal Mulai',
      dataIndex: 'tanggal_mulai',
      key: 'tanggal_mulai',
      ...getColumnSearchProps('tanggal_mulai', 'Tanggal Mulai'),
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tanggal_selesai',
      key: 'tanggal_selesai',
      ...getColumnSearchProps('tanggal_selesai', 'Tanggal Selesai'),
    },
    {
      title: 'Tanggal Pengumpulan',
      dataIndex: 'tanggal_pengumpulan',
      ...getColumnSearchProps('tanggal_pengumpulan', 'Status Poin Penilaian'),
    },
    {
      title: 'Aksi',
      width: '10%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {rolePengguna !== '1' && rolePengguna !== '4' && (
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail self assessment</div>}>
                  <Button
                    id="button-pencil"
                    htmlType="submit"
                    shape="circle"
                    style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                    onClick={() => {
                      lihatDetailSelfAssessment(record.id)
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}

          {rolePengguna === '4' && (
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail self assessment</div>}>
                  <Button
                    id="button-pencil"
                    htmlType="submit"
                    shape="circle"
                    style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                    onClick={() => {
                      lihatDetailSelfAssessment(record.id)
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                  </Button>
                </Popover>
              </Col>

              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lakukan penilaian self assessment</div>}>
                  <Button
                    id="button-pencil"
                    htmlType="submit"
                    shape="circle"
                    style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                    onClick={() => {
                      lakukanPenilaianSelfAssessment(record.id)
                    }}
                  >
                    <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}
        </>
      ),
    },
  ]

  //KOLOM UNTUK PESERTA
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
      title: 'Tanggal Mulai',
      dataIndex: 'tanggal_mulai',
      key: 'tanggal_mulai',
      ...getColumnSearchProps('tanggal_mulai', 'Tanggal Mulai'),
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tanggal_selesai',
      key: 'tanggal_selesai',
      ...getColumnSearchProps('tanggal_selesai', 'Tanggal Selesai'),
    },
    {
      title: 'Tanggal Pengumpulan',
      dataIndex: 'tanggal_pengumpulan',
      ...getColumnSearchProps('tanggal_pengumpulan', 'Status Poin Penilaian'),
    },

    {
      title: 'Aksi',
      width: '5%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Popover content={<div>Lihat isi detail self assessment</div>}>
                <Button
                  id="button-pencil"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                  onClick={() => {
                    lihatDetailSelfAssessment(record.id)
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
  const buttonKembaliKeListHandling = () => {
    history.push(`/rekapDokumenPeserta`)
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
  return isLoading ? (
    <Spin indicator={antIcon} />
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
            <Row style={{ fontSize: 16 }}>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>Gina Anifah Choirunnisa</Col>
            </Row>
            <Row style={{ fontSize: 16 }}>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>181524003</Col>
            </Row>
          </Card>
        </Space>
      )}

      <CCard className="mb-4">
        {title('REKAP SELF ASSESSMENT PESERTA')}
        <CCardBody>
          {/* {rolePengguna !== '1' && (
            <Popover content={<div>ke list dokumen peserta</div>}>
              <Button type="primary" size="medium" onClick={buttonKembaliKeListHandling}>
                Kembali
              </Button>
            </Popover>
          )} */}
          {rolePengguna === '1' && (
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button
                  id="create-logbook"
                  size="sm"
                  shape="round"
                  style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                  onClick={handleCreateSelfAssessment}
                >
                  Tambahkan Self Assessment Baru
                </Button>
              </Col>
            </Row>
          )}

          {rolePengguna !== '1' && (
            <>
              <h4 className="justify">REKAP DOKUMEN SELF ASSESSMENT PESERTA</h4>
            </>
          )}

          {rolePengguna === '1' && (
            <CRow>
              <CCol sm={12}>
                <hr />
                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columns}
                  dataSource={selfAssessmentPeserta}
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
                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columnsPanitiaPembimbing}
                  dataSource={selfAssessmentPeserta}
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
          onClick={buttonKembaliKeListHandling}
          icon={<ArrowLeftOutlined />}
          tooltip={<div>Kembali ke Rekap Dokumen Peserta</div>}
        />
      )}
    </>
  )
}

export default RekapSelfAssessment
