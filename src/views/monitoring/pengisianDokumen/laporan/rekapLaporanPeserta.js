import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import {
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Spin,
  Popover,
  Card,
  FloatButton,
  Alert,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { message } from 'antd'

const RekapLaporanPeserta = () => {
  const params = useParams()
  const NIM_PESERTA_FROM_PARAMS = params.id
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const  NIM_PESERTA_USER = localStorage.username
  const [dataLaporanPeserta, setDataLaporanPeserta] = useState([])
  const [dataPeserta, setDataPeserta] = useState([])
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [tanggalLaporanDibuka, setTanggalLaporanDibuka] = useState()
  const [infoDeadlineLaporan, setInfoDeadlineLaporan] = useState([])
  const [totalLaporanPhase, setTotalLaporanPhase] = useState()
  const [isStartDateToAccessThisPage, setIsStartDateToAccessThisPage] = useState()
  const [messageApi, contextHolder] = message.useMessage();
  const success = (link) => {
    navigator.clipboard.writeText(link)
    messageApi.open({
      type: 'success',
      content: 'Link berhasil disalin',
    });
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
    let PESERTA
    if (rolePengguna !== '1') {
      PESERTA = parseInt(NIM_PESERTA_FROM_PARAMS)
    } else {
      PESERTA = parseInt(NIM_PESERTA_USER)
    }

    await axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get-all/${PESERTA}`)
      .then((res) => {
        let temp = res.data.data
        let temp_after = []
        let funcGetTempAfter = function (obj) {
          for (var i in obj) {
            temp_after.push({
              id: obj[i].id,
              uri: obj[i].uri,
              phase: obj[i].phase,
              upload_date: convertDate(obj[i].upload_date),
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

  const convertDate = (date) => {
    var temp_date_split = date.split('-')
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
    var date_month = temp_date_split[1]
    var month_of_date = month[parseInt(date_month) - 1]
    return date ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}` : null
  }

  useEffect(() => {
    

    async function getLaporanPeserta(record, index) {
      let PESERTA
      if (rolePengguna !== '1') {
        PESERTA = parseInt(NIM_PESERTA_FROM_PARAMS)
      } else {
        PESERTA = parseInt(NIM_PESERTA_USER)
      }

      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get-all/${PESERTA}`)
        .then((res) => {
          let temp = res.data.data
         if(temp !== null && temp.length>0){
          let temp_after = []
          let funcGetTempAfter = function (obj) {
            for (var i in obj) {
              temp_after.push({
                id: obj[i].id,
                uri: obj[i].uri,
                phase: obj[i].phase,
                upload_date: convertDate(obj[i].upload_date),
                supervisor_grade : obj[i].supervisor_grade
              })
            }
          }
          funcGetTempAfter(temp)
        
          setDataLaporanPeserta(temp_after)
         }else{
          setDataLaporanPeserta(undefined)
         }

        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all/laporan`).then((response)=>{
          let dataDeadlineLaporan =[]
          let getInfoDeadlineLaporan = function(data){
            for(var i in data){
              dataDeadlineLaporan.push({
                id : data[i].id,
                day_range : data[i].day_range,
                start_assignment_date : convertDate(data[i].start_assignment_date),
                finish_assignment_date : convertDate(data[i].finish_assignment_date),

              })
            }
          }
          getInfoDeadlineLaporan(response.data.data)
          setInfoDeadlineLaporan(dataDeadlineLaporan)
          setTotalLaporanPhase(response.data.data.length)
          setIsLoading(false)
        })

   
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
          } else if (error.toJSON().status > 500 && error.toJSON().status <= 500) {
            history.push('/500')
          } else if (error.toJSON().status===500){
            setDataLaporanPeserta(undefined)
          }
        })
    }

    const GetDataInfoPeserta = async (index) => {
      var PESERTA
      if (rolePengguna === '1') {
        PESERTA = parseInt(NIM_PESERTA_USER)
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



    GetDataInfoPeserta()


    getLaporanPeserta()
  }, [history])

  const actionPenilaianFormPembimbingJurusan = (idLaporan) => {
    history.push(`/rekapDokumenPeserta/laporan/${NIM_PESERTA_FROM_PARAMS}/nilai/${idLaporan}`)
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
              <Col span={8} style={{ textAlign: 'center' }}>
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
              <Col span={8} style={{ textAlign: 'center' }}>
                <Popover content={<div>Salin Link Gdrive</div>}>
                {contextHolder}
                  <Button type="primary" onClick={() => success(record.uri)}>
                    Copy
                  </Button>
                </Popover>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
              <Popover content={<div>Kunjungi Link</div>}>
              <a href={record.uri} target="_blank" rel="noopener noreferrer">
              <Button type="primary">
                  Kunjungi Link
                </Button>
              </a>
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
            <Col span={8} style={{ textAlign: 'center' }}>
              <Popover content={<div>Lakukan edit pengumpulan Laporan KP / PKL</div>}>
                <Button type="primary" onClick={() => pengumpulanLaporan(record.id)}>
                  Pengumpulan
                </Button>
              </Popover>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Popover content={<div>Salin Link Gdrive</div>}>
              {contextHolder}
                <Button type="primary" onClick={() => success(record.uri)}>
                  Copy
                </Button>
              </Popover>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Popover content={<div>Kunjungi Link</div>}>
              <a href={record.uri} target="_blank" rel="noopener noreferrer">
              <Button type="primary">
                  Kunjungi Link
                </Button>
              </a>
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
    <div>
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
      </div>
      {rolePengguna === '1' && (
        <Alert
          className="spacebottom2"
          message="Informasi Pengumpulan Laporan"
          description={
            <div>
              <ul>
                <li>
                  Pengisian dapat dilakukan mulai &nbsp;&nbsp; <b>{tanggalLaporanDibuka}</b>&nbsp;&nbsp;
                </li>
                <li>Peserta dapat melakukan edit link laporan selama masih memiliki akses untuk pengeditan</li>
                <li>Laporan dikumpulkan dalam bentuk link Gdrive</li>
                <li>Dalam pelaksanaan pengumpulan laporan memiliki &nbsp;&nbsp; <b>{totalLaporanPhase}</b> &nbsp;&nbsp; fase </li>
                {infoDeadlineLaporan.map((data,index)=>{
                  return(
                    <li key={data.id}><b>Fase {index+1}</b> Akses pengumpulan akan dimulai dari tanggal &nbsp;&nbsp; <b>{data.start_assignment_date}</b>&nbsp;&nbsp; dan batas pengumpulan terakhir pada tanggal &nbsp;&nbsp;<b>{data.finish_assignment_date}</b></li>
                  )
                })}
            
              </ul>
            </div>
          }
          type="info"
          showIcon
        />
      )}

      <CCard className="mb-4">
        {title('REKAP LAPORAN PESERTA')}
    {rolePengguna === '1' && (
          <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
          
              <Button
                id="create-laporan"
              
                size="sm"
                shape="round"
                style={{ color: 'white', background: '#339900', marginBottom: 16, margin:5 }}
                onClick={()=>history.push(`/laporan/submissionLaporan`)}
              >
                Tambahkan Laporan
              </Button>
        
          
          </Col>
        </Row>
    )}
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
