import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons'
import { ArrowLeftOutlined, SmileOutlined } from '@ant-design/icons'
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
  Result,
  Alert,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

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
  const [isParticipantAllowedToAccessThisPage, setIsParticipantAllowedToAccessThisPage] = useState()
  const [startDateAccessThisPage, setStartDateThisPage] = useState()
  const [isFinishDateToAssignLogbook, setIsFinishDateToAssignLogbook] = useState()
  const [limitDateToSubmitAndEditLogbook, setLimitDateToSubmitAndEditLogbook] = useState()
  const [dataDeadlineLogbook, setDataDeadlineLogbook] = useState([])


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

  const refreshData = async(index) => {
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
        if (result.data.data.length > 0) {
          console.log(result.data.data)
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
            return date
              ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
              : null
          }

          function setKeyIfNull(index, id) {
            return id ? id : index
          }

          function setProjectNameIfNull(project_name) {
            return project_name ? project_name : '-'
          }

          let getTempRes = function (obj) {
            for (var i in obj) {
              temp_res.push({
                id: setKeyIfNull(parseInt(i), obj[i].id),
                real_id: obj[i].id,
                date: convertDate(obj[i].date),
                real_date : obj[i].date,
                grade: obj[i].grade,
                status: obj[i].status,
                project_name: setProjectNameIfNull(obj[i].project_name),
              })
            }
          }

          getTempRes(temp)
          setLogbookPeserta(temp_res)
        } else {
          setLogbookPeserta(result.data.data)
        }
        setIsLoading(false)

 
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
          if (result.data.data.length > 0) {
            console.log(result.data.data)
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
              return date
                ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
                : null
            }

            function setKeyIfNull(index, id) {
              return id ? id : index
            }

            function setProjectNameIfNull(project_name) {
              return project_name ? project_name : '-'
            }

            let getTempRes = function (obj) {
              for (var i in obj) {
                temp_res.push({
                  id: setKeyIfNull(parseInt(i), obj[i].id),
                  real_id: obj[i].id,
                  date: convertDate(obj[i].date),
                  grade: obj[i].grade,
                  status: obj[i].status,
                  project_name: setProjectNameIfNull(obj[i].project_name),
                })
              }
            }

            getTempRes(temp)
            setLogbookPeserta(temp_res)
          } else {
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
          } else if (error.toJSON().status > 500 && error.toJSON().status <= 599) {
            history.push('/500')
          } else if (error.toJSON().status === 500) {
            setLogbookPeserta(undefined)
            setIsLoading(false)
          }
        })
    }

    async function GetAccessPesertaToThisPage() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all?id_deadline=1`)
        .then((response) => {
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
            console.log(month_of_date, 'isi date monts', month_of_date)
            return `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
          }

          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear()

            if (month.length < 2) month = '0' + month
            if (day.length < 2) day = '0' + day

            return [year, month, day].join('-')
          }
          let start_date = response.data.data.start_assignment_date
          let finish_date = response.data.data.finish_assignment_date
          let range = response.data.data.day_range

          let data_date_deadline = []
          data_date_deadline = {
            start_date: convertDate(start_date),
            finish_date: convertDate(finish_date),
            day_range : range
          }
          setDataDeadlineLogbook(data_date_deadline)

          let today = formatDate(new Date())
          console.log('===', start_date, today)
          if (start_date <= today) {
            setIsParticipantAllowedToAccessThisPage(true)
          } else {
            setIsParticipantAllowedToAccessThisPage(false)
          }

          if (finish_date <= today) {
            setIsFinishDateToAssignLogbook(true)
          } else {
            setIsFinishDateToAssignLogbook(false)
          }
          // setFinishDateThisPageAllowedToAccess(response.data.data.finish_assignment_date)
        })
    }
    getLogbookPeserta()
    GetAccessPesertaToThisPage()
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
      title: 'NAMA PROYEK',
      dataIndex: 'project_name',
      key: 'project_name',
      ...getColumnSearchProps('project_name', 'Nama Proyek'),
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
          {rolePengguna !== '1' && rolePengguna !== '4' && record.real_id !== null && (
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail dokumen logbook</div>}>
                  <Button
                    size="small"
                    type="primary"
                    
                    onClick={() => actionLihatDetailPenilaianLogbook(record.id)}
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
                    style={{ backgroundColor: '#ffa940', color: 'white' }}
                  >
                    &nbsp;&nbsp; &nbsp;&nbsp; Penilaian &nbsp;&nbsp;&nbsp;&nbsp;
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}

          {rolePengguna === '4' && record.real_id !== null && (
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail dokumen logbook</div>}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => actionLihatDetailPenilaianLogbook(record.id)}
                  >
                    Lihat Detail
                  </Button>
                </Popover>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lakukan penilaian logbook</div>}>
                  <Button
                    size="small"
                    onClick={() => actionPenilaianLogbook(record.id)}
                    style={{ backgroundColor: '#ffa940', color: 'white' }}
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

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  function cekIfDateLogbookIsLimitDeadline(date){
    let dateLimit = new Date(date)
    dateLimit.setDate(dateLimit.getDate()+0)
    let dateLimitResult = formatDate(dateLimit.toDateString())
    let today = formatDate(new Date())
    console.log(dateLimitResult,today,date)

    if(dateLimitResult < today){
     
      return false
     
    }else{
      console.log('dase')
      return true
    }
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
      title: 'NAMA PROYEK',
      dataIndex: 'project_name',
      key: 'project_name',
      ...getColumnSearchProps('project_name', 'Nama Proyek'),
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
              {(record.grade !== 'BELUM DINILAI' && record.real_id !== null && cekIfDateLogbookIsLimitDeadline(record.real_date))&& (
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

              {(record.grade === 'BELUM DINILAI' && record.real_id !== null && !isFinishDateToAssignLogbook) && (
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
            {record.real_id !== null && (
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Klik untuk melihat isi detail Logbook</div>}>
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
            )}

            {record.real_id === null && <b>-</b>}
          </Row>
        </>
      ),
    },
  ]

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
            <Row style={{ padding: 5 }}>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.name}</Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.nim}</Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={4}>Sistem Kerja</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.work_system}</Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={4}>Angkatan</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.year}</Col>
            </Row>
          </Card>
        </Space>
      )}

      {rolePengguna === '1' && (
        <Alert
          className="spacebottom2"
          message="Informasi Pengumpulan Logbook"
          description={
            <div>
              <ul>
                <li>
                  Pengisian dapat dilakukan mulai &nbsp;&nbsp; <b>{dataDeadlineLogbook.start_date}</b>&nbsp;&nbsp; dan akan ditutup
                  akses pengumpulan pada &nbsp;&nbsp; <b>{dataDeadlineLogbook.finish_date}</b>
                </li>
                <li>
                  Pengeditan logbook akan berpengaruh pada status pengumpulan
                </li>
                <li>Peserta dapat melakukan edit (selama masih memiliki akses) dan melihat detail isi logbook</li>
                <li>Tanggal logbook yang dikumpulkan melebihi &nbsp; <b>{dataDeadlineLogbook.day_range}</b> &nbsp; hari, pengumpulan logbook tersebut akan ditolak</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
        />
      )}
      <CCard className="mb-4">
        {title('REKAP LOGBOOK PESERTA')}
        <CCardBody>
          {rolePengguna === '1' && isParticipantAllowedToAccessThisPage && (
            <>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  {!isFinishDateToAssignLogbook && (
                    <Button
                      id="create-logbook"
                      size="sm"
                      shape="round"
                      style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                      onClick={handleCreateLogbook}
                    >
                      Tambahkan Logbook Baru
                    </Button>
                  )}

                  {isFinishDateToAssignLogbook && (
                    <Popover content={'Pengumpulan Logbook Sudah Tidak Diizinkan !!! '}>
                      <Button
                        id="create-logbook"
                        size="sm"
                        disabled
                        shape="round"
                        style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                        onClick={handleCreateLogbook}
                      >
                        Tambahkan Logbook Baru
                      </Button>
                    </Popover>
                  )}
                </Col>
              </Row>
            </>
          )}

          {rolePengguna === '1' && isParticipantAllowedToAccessThisPage && (
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

          {rolePengguna === '1' && !isParticipantAllowedToAccessThisPage && (
            <Result
              icon={<SmileOutlined />}
              title="Maaf Akses Untuk Halaman Ini Belum Dibuka"
              subTitle="Anda dapat melakukan akses setelah memasuki tanggal yang telah ditentukan"
            
            />
          )}

          {rolePengguna !== '1' && (
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
