import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons'
import { ArrowLeftOutlined,SmileOutlined } from '@ant-design/icons'
import { Alert, FloatButton, Result } from 'antd'
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
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import './rpp.css'


const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapRPP = () => {
  const PARAMS = useParams()
  const NIM_PESERTA_FROM_PARAMS = PARAMS.id
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [rppPeserta, setRppPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [wannaDetail, setWannaDetail] = useState(false)
  const NIM_PESERTA_AS_USER = localStorage.username
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [dataPeserta, setDataPeserta] = useState([])
  const [isParticipantAllowedToAccessThisPage, setIsParticipantAllowedToAccessThisPage] = useState('load')
  const [dataDeadlineRPP, setDataDeadlineRPP] = useState([])
  const desc = '*edit RPP yang dipilih'
  axios.defaults.withCredentials = true

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
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/get-all/${PESERTA}`)
      .then((result) => {
        console.log('ES', result.data.data)
        if (result.data.data.length > 0) {
          let temp = []
          let getDataTempRPP = function (obj) {
            for (var i in obj) {
              temp.push({
                rpp_id: obj[i].rpp_id,
                work_title: obj[i].work_title,
                start_date: convertDate(obj[i].start_date),
                finish_date: convertDate(obj[i].finish_date),
                end_date_rpp: obj[i].finish_date,
              })
            }
          }

          getDataTempRPP(result.data.data)
          setRppPeserta(temp)
        } else {
          setRppPeserta(result.data.data)
        }
        setIsLoading(false)
        setIsLoading(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
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
    console.log(month_of_date, 'isi date monts', month_of_date)
    return `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
  }

  useEffect(() => {
    async function GetRppPeserta(index) {
      let PESERTA
      if (rolePengguna === '1') {
        PESERTA = NIM_PESERTA_AS_USER
      } else {
        PESERTA = NIM_PESERTA_FROM_PARAMS
      }
      enterLoading(index)
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/get-all/${PESERTA}`)
        .then((result) => {
          console.log('ES', result.data.data)
          if (result.data.data.length > 0) {
            let temp = []
          
            let getDataTempRPP = function (obj) {
              for (var i in obj) {
                temp.push({
                  rpp_id: obj[i].rpp_id,
                  work_title: obj[i].work_title,
                  start_date: convertDate(obj[i].start_date),
                  finish_date: convertDate(obj[i].finish_date),
                  end_date_rpp: obj[i].finish_date,
                })
              }
            }

            getDataTempRPP(result.data.data)
            setRppPeserta(temp)
          } else {
            setRppPeserta(result.data.data)
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
            //history.push('/500')
            setRppPeserta(undefined)
          } 
        })
    }

    const GetDataInfoPeserta = async (index) => {
      var PESERTA
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

    async function GetDataDeadlineAndPageOpened(){
      
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all?id_deadline=6`).then((response)=>{
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
       let data_deadline = {
        start_date : convertDate(start_date),
        finish_date : convertDate(finish_date),
        day_range : range
       }

       setDataDeadlineRPP(data_deadline)

       let today = formatDate(new Date())
       if(start_date <= today ){
        setIsParticipantAllowedToAccessThisPage(true)
       }else{
        setIsParticipantAllowedToAccessThisPage(false)
       }
      })
    }

    GetDataInfoPeserta()
    GetDataDeadlineAndPageOpened()
    GetRppPeserta()
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


  const confirmToEdit = () => {
    history.push(`/rencanaPenyelesaianProyek/edit/${wannaEdit.rpp_id}`)
  }



  const handleCreateRPP = () => {
    history.push(`/rencanaPenyelesaianProyek/peserta/formPengisianRPP`)
  }


  const actionLihatRPPPeserta = (idRPP) => {
    history.push(`/rekapDokumenPeserta/rppPeserta/${NIM_PESERTA_FROM_PARAMS}/detail/${idRPP}`)
  }


  const hoverButtonLihatDetail = <div>Klik tombol, untuk melihat isi RPP peserta</div>


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
      title: 'Judul Pekerjaan',
      dataIndex: 'work_title',
      key: 'work_title',
      ...getColumnSearchProps('work_title', 'Judul Pekerjaan'),
    },
    {
      title: 'Tanggal Mulai Pengerjaan',
      dataIndex: 'start_date',
      key: 'start_date',
      ...getColumnSearchProps('start_date', 'Tanggal Mulai Pengerjaan'),
    },
    {
      title: 'Tanggal Selesai Pengerjaan',
      dataIndex: 'finish_date',
      key: 'finish_date',
      ...getColumnSearchProps('finish_date', 'Tanggal Selesai Pengerjaan'),
    },
    {
      title: 'AKSI',
      width: '5%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {/* ROLE PANITIA */}
          {rolePengguna !== '1' && (
            <Row>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Popover content={hoverButtonLihatDetail}>
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => actionLihatRPPPeserta(record.rpp_id)}
                  >
                    Lihat Detail
                  </Button>
                </Popover>
              </Col>
            </Row>
          )}

        </>
      ),
    },
  ]

  const getWeekBasedOnDate = (date) => {
    var year = new Date(date.getFullYear(), 0, 1)
    var days = Math.floor((date - year) / (24 * 60 * 60 * 1000))
    var week = Math.ceil((date.getDay() + 1 + days) / 7)

    return week
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

  function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    var ISOweekStart = simple
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    return formatDate(ISOweekStart.toDateString())
  }

  /** KOLOM PESERTA */
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
      title: 'Judul Pekerjaan',
      dataIndex: 'work_title',
      key: 'work_title',
      ...getColumnSearchProps('work_title', 'Judul Pekerjaan'),
    },
    {
      title: 'Tanggal Mulai Pengerjaan',
      dataIndex: 'start_date',
      key: 'start_date',
      ...getColumnSearchProps('start_date', 'Tanggal Mulai Pengerjaan'),
    },
    {
      title: 'Tanggal Selesai Pengerjaan',
      dataIndex: 'finish_date',
      key: 'finish_date',
      ...getColumnSearchProps('finish_date', 'Tanggal Selesai Pengerjaan'),
    },
    {
      title: 'AKSI',
      width: '10%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => {
        let isDisableButton
        let today = formatDate(new Date())
        let rec_end_date = new Date(record.end_date_rpp)
        let week_end_date = getWeekBasedOnDate(rec_end_date) - 1
        let year_end_date = record.end_date_rpp
        year_end_date = year_end_date.slice(0, 4)
        let limit_date_for_edit_rpp = getDateOfISOWeek(week_end_date, year_end_date)

        if (limit_date_for_edit_rpp > today) {
          isDisableButton = false
        } else {
          isDisableButton = true
        }

        return (
          <>
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                {isDisableButton && (
                  <Popover content={<div>Pengeditan tidak diizinkan</div>}>
                    <Button
                      id="button-pencil"
                      htmlType="submit"
                      disabled={isDisableButton}
                      shape="circle"
                      style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                      onClick={() => {
                        setWannaEdit(record)
                      }}
                    >
                      <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
                    </Button>
                  </Popover>
                )}

                {!isDisableButton && (
                <Popover content="Edit data RPP">
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
                      disabled={isDisableButton}
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
                <Popover content={<div>Lihat detail RPP</div>}>
                  <Button
                    id="button-eye"
                    htmlType="submit"
                    shape="circle"
                    style={{ backgroundColor: '#bae0ff', borderColor: '#bae0ff' }}
                    onClick={() => {
                      history.push(`/rencanaPenyelesaianProyek/detail/${record.rpp_id}`)
                      // console.log(limit_date_for_edit_rpp , today,  limit_date_for_edit_rpp > today)
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                  </Button>
                </Popover>
              </Col>
            </Row>
          </>
        )
      },
    },
  ]


  const buttonKembaliKeListHandling = () => {
    history.push(`/rekapDokumenPeserta`)
  }
  const title = (judul) => {
    return isLoading ? (
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    ) : (
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

  return (
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

      {rolePengguna === '1'&& (
        <Alert
        className='spacebottom2'
        message="Informasi Pengumpulan RPP"
        description={
          <div>
          <ul>
          <li>Akses Pengumpulan RPP dimulai dari tanggal &nbsp;&nbsp; <b>{dataDeadlineRPP.start_date}</b> &nbsp;&nbsp; dan akses akan ditutup pada tanggal &nbsp;&nbsp; <b>{dataDeadlineRPP.finish_date}</b></li>
          <li>Peserta dapat melakukan pengeditan RPP selama tanggal yang sedang berlangsung belum memasuki minggu dari tanggal berakhir RPP</li>
          <li>Isilah data RPP sedetail mungkin</li>
          </ul>
          </div>
        }
        type="info"
        showIcon
      />
      )}
      <div>
        <CCard className="mb-4">
          {title('REKAP RENCANA PENYELESAIAN PROYEK PESERTA')}
          {(rolePengguna === '1' && !isParticipantAllowedToAccessThisPage) && (
              <Result
              icon={<SmileOutlined />}
              title="Maaf Akses Untuk Halaman Ini Belum Dibuka"
              subTitle="Anda dapat melakukan akses setelah memasuki tanggal yang telah ditentukan"
              // extra={<Button type="primary">Next</Button>}
            />
          )}
          <CCardBody>
            {(rolePengguna === '1' && isParticipantAllowedToAccessThisPage ) && (
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

            {(rolePengguna === '1' && isParticipantAllowedToAccessThisPage )&& (
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

export default RekapRPP
