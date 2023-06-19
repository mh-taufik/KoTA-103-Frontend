import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons'
import { Table, Button, Row, Col, Input, Space, Spin, Popover, Card, FloatButton, Alert, Result, Tag } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams } from 'react-router-dom'
import { LoadingOutlined,SmileOutlined  } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapSelfAssessment = () => {
  let PARAMS = useParams()
  let NIM_PESERTA_FROM_PARAMS = PARAMS.id //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const NIM_PESERTA_USER = localStorage.username
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [dataPeserta, setDataPeserta] = useState([])
  const [dataDeadlineSelfAssessment, setDataDeadlineSelfAssessment] = useState([])
  const [isParticipantAllowedToAccessThisPage, setIsParticipantAllowedToAccessThisPage] = useState()
  const [isFinishDateToAssignSelfAssessment, setIsFinishDateToAssignSelfAssessment] = useState()
  axios.defaults.withCredentials = true

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
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
 

    const getSelfAssessment = async (index) => {
      let PESERTA
      if (rolePengguna === '1') {
        PESERTA = NIM_PESERTA_USER
      } else {
        PESERTA = NIM_PESERTA_FROM_PARAMS
      }
      enterLoading(index)
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get-all/${PESERTA}`,
        )
        .then((result) => {
          let len = result.data.data.length-1
          console.log('len', len, 'act',result.data.data.length)

          let temp = []
         
          const temp1 = JSON.parse(JSON.stringify(result.data.data))

          

          function handleIdNull (id,index){
            return id?id:index
          }

          function setStatus(id){
            return id?'Sudah Dikumpulkan' : 'Tidak Dikumpulkan'
          }
          if (result.data.data.length > 1) {
            console.log('RESY')
            var getTempSelfAssessment = function (obj) {
              for (var i in obj) {
                console.log(i, len)
                if (parseInt(i)<len) {
                  temp.push({
                    start_date: convertDate(obj[i].start_date),
                    finish_date: convertDate(obj[i].finish_date),
                    self_assessment_id: handleIdNull(obj[i].self_assessment_id,parseInt(i)),
                    actual_id : obj[i].self_assessment_id,
                    participant_id: obj[i].participant_id,
                    status : setStatus(obj[i].self_assessment_id)
                  })
                }
              
              }
            }

            getTempSelfAssessment(temp1)
            setSelfAssessmentPeserta(temp)
            setIsLoading(false)
            return
          } else {
            setSelfAssessmentPeserta(result.data.data)
            setIsLoading(false)
            return
          }
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
            setSelfAssessmentPeserta(undefined)
            setIsLoading(false)
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

    
    async function GetDataDeadlineAndPageOpened(){
      
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all?id_deadline=2`).then((response)=>{
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

       setDataDeadlineSelfAssessment(data_deadline)

       let today = formatDate(new Date())
       if(start_date <= today ){
        setIsParticipantAllowedToAccessThisPage(true)
       }else{
        setIsParticipantAllowedToAccessThisPage(false)
       }

       if(finish_date <= today){
        setIsFinishDateToAssignSelfAssessment(true)
       }else{
        setIsFinishDateToAssignSelfAssessment(false)
       }
      })
    }

    GetDataInfoPeserta()
    GetDataDeadlineAndPageOpened()

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

  const refreshData = async (index) => {
    var PESERTA
    if (rolePengguna === '1') {
      PESERTA = NIM_PESERTA_USER
    } else {
      PESERTA = NIM_PESERTA_FROM_PARAMS
    }
    await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get-all/${PESERTA}`,
        )
        .then((result) => {
          let len = result.data.data.length-1
          console.log('len', len, 'act',result.data.data.length)

          let temp = []
         
          const temp1 = JSON.parse(JSON.stringify(result.data.data))

          

          function handleIdNull (id,index){
            return id?id:index
          }

          function setStatus(id){
            return id?'Sudah Dikumpulkan' : 'Tidak Dikumpulkan'
          }
          if (result.data.data.length > 1) {
            console.log('RESY')
            var getTempSelfAssessment = function (obj) {
              for (var i in obj) {
                console.log(i, len)
                if (parseInt(i)<len) {
                  temp.push({
                    start_date: convertDate(obj[i].start_date),
                    finish_date: convertDate(obj[i].finish_date),
                    self_assessment_id: handleIdNull(obj[i].self_assessment_id,parseInt(i)),
                    actual_id : obj[i].self_assessment_id,
                    participant_id: obj[i].participant_id,
                    status : setStatus(obj[i].self_assessment_id)
                  })
                }
              
              }
            }

            getTempSelfAssessment(temp1)
            setSelfAssessmentPeserta(temp)
            setIsLoading(false)
       
          } else {
            setSelfAssessmentPeserta(result.data.data)
            setIsLoading(false)
      
          }
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  const handleCreateSelfAssessment = () => {
    history.push(`/selfAssessment/formSelfAssessment`)
  }

  const lihatDetailSelfAssessment = (idsa) => {
    rolePengguna !== '1'
      ? history.push(
          `/rekapDokumenPeserta/selfAssessmentPeserta/${NIM_PESERTA_FROM_PARAMS}/detail/${idsa}`,
        )
      : history.push(`/selfAssessment/formSelfAssessment/detail/${idsa}`)
  }

  const actionGradeSelfAssessment = (idsa) => {
    history.push(
      `/rekapDokumenPeserta/selfAssessmentPeserta/${NIM_PESERTA_FROM_PARAMS}/penilaian/${idsa}`,
    )
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
      title: 'TANGGAL MULAI',
      dataIndex: 'start_date',
      key: 'start_date',
      ...getColumnSearchProps('start_date', 'Tanggal Mulai'),
    },
    {
      title: 'TANGGAL SELESAI',
      dataIndex: 'finish_date',
      key: 'finish_date',
      ...getColumnSearchProps('finish_date', 'Tanggal Selesai'),
    },
    {
      title: 'STATUS PENGUMPULAN',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status', 'Status Pengumpulan'),
      render: (text, record) => {
        let color
        if (record.status === 'Sudah Dikumpulkan') {
          color = 'green'
        } else if (record.status === 'Tidak Dikumpulkan') {
          color = 'magenta'
        }
        return <Tag color={color}>{record.status}</Tag>
      },
    },
    {
      title: 'AKSI',
      width: '10%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          {rolePengguna !== '1' && rolePengguna !== '4' && record.actual_id !== null && (
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Popover content={<div>Lihat isi detail self assessment</div>}>
                  <Button
                    id="button-pencil" 
                    htmlType="submit"
                    shape="circle"
                    style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                    onClick={() => {
                      lihatDetailSelfAssessment(record.self_assessment_id)
                      // console.log(record.self_assessment_id)
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                  </Button>
                </Popover>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
               <Popover content={<div>Lihat penilaian self assessment</div>}>
                 <Button
                   id="button-pencil"
                   htmlType="submit"
                   shape="circle"
                   style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                   onClick={() => {
                     actionGradeSelfAssessment(record.self_assessment_id)
                   }}
                 >
                   <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
                 </Button>
               </Popover>
             </Col>
            </Row>
          )}

          {(rolePengguna === '4' && record.actual_id !== null) && (
             <Row>
             <Col span={12} style={{ textAlign: 'center' }}>
               <Popover content={<div>Lihat isi detail self assessment</div>}>
                 <Button
                   id="button-pencil"
                   htmlType="submit"
                   shape="circle"
                   style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                   onClick={() => {
                     lihatDetailSelfAssessment(record.self_assessment_id)
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
                     actionGradeSelfAssessment(record.self_assessment_id)
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

  /** PESERTA */
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
      title: 'TANGGAL MULAI',
      dataIndex: 'start_date',
      key: 'start_date',
      ...getColumnSearchProps('start_date', 'Tanggal Mulai'),
    },
    {
      title: 'TANGGAL SELESAI',
      dataIndex: 'finish_date',
      key: 'finish_date',
      ...getColumnSearchProps('finish_date', 'Tanggal Selesai'),
    },
    {
      title: 'STATUS PENGUMPULAN',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status', 'Status Pengumpulan'),
      render: (text, record) => {
        let color
        if (record.status === 'Sudah Dikumpulkan') {
          color = 'green'
        } else if (record.status === 'Tidak Dikumpulkan') {
          color = 'magenta'
        }
        return <Tag color={color}>{record.status}</Tag>
      },
    },
      
    
    {
      title: 'AKSI',
      width: '5%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
        {record.actual_id !== null && (
            <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Popover content={<div>Lihat isi detail self assessment</div>}>
                <Button
                  id="button-pencil"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                  onClick={() => {
                    lihatDetailSelfAssessment(record.self_assessment_id)
                  }}
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} />
                </Button>
              </Popover>
            </Col>
          </Row>
        )}
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
      {rolePengguna === '1'&& (
        <Alert
        className='spacebottom2'
        message="Informasi Pengumpulan Self Assessment"
        description={
          <div>
          <ul>
          <li>Akses Pengumpulan Self Assessment dimulai dari tanggal &nbsp;&nbsp; <b>{dataDeadlineSelfAssessment.start_date}</b> &nbsp;&nbsp; dan akses akan ditutup pada tanggal &nbsp;&nbsp; <b>{dataDeadlineSelfAssessment.finish_date}</b></li>
          <li>Peserta tidak dapat melakukan pengeditan self assessment</li>
          <li>Self Assessment dikumpulkan seminggu sekali</li>
          <li>Batas pengumpulan terakhir self assessment adalah hari ke - &nbsp;&nbsp;<b>{5+dataDeadlineSelfAssessment.day_range}</b>&nbsp;&nbsp;terhitung dari senin(minggu dari tanggal dokumen yang dikumpulkan)</li>
          <li>Isilah field <b>keterangan</b> pada self assessement sedetail mungkin</li>
          </ul>
          </div>
        }
        type="info"
        showIcon
      />
      )}

      <CCard className="mb-4">
        {title('REKAP SELF ASSESSMENT PESERTA')}
        <CCardBody>
          {(rolePengguna === '1' && isParticipantAllowedToAccessThisPage)&& (
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {(!isFinishDateToAssignSelfAssessment) && (
                  <Button
                  id="create-logbook"
                  size="sm"
                  shape="round"
                  style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                  onClick={handleCreateSelfAssessment}
                >
                  Tambahkan Self Assessment Baru
                </Button>
                )}
                {isFinishDateToAssignSelfAssessment &&( 
               <Popover content={<div>Pengumpulan sudah tidak dizinkan</div>}>
                 <Button
                  id="create-logbook"
                  size="sm"
                  disabled
                  shape="round"
                  style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                  onClick={handleCreateSelfAssessment}
                >
                  Tambahkan Self Assessment Baru
                </Button>
               </Popover>
                )}
              </Col>
            </Row>
          )}

          {(rolePengguna === '1' && isParticipantAllowedToAccessThisPage) && (
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

          {(rolePengguna === '1' && !isParticipantAllowedToAccessThisPage) && (
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
