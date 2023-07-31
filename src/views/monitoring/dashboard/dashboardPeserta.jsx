import React, { useEffect, useState } from 'react'
import { Button, Card, Col, FloatButton, Modal, Popover, Progress, Row, Space, Table } from 'antd'
import { ClockCircleOutlined,ArrowLeftOutlined , FileDoneOutlined } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'
import { set } from 'lodash'
const DashboardPeserta = () => {
  const params = useParams()
  const NIM_PESERTA = params.nim
  const rolePengguna = localStorage.id_role
  const [isLoading, setIsLoading] = useState(true)
  const [isModalLogbookAllOpen, setIsModalLogbookAllOpen] = useState(false)
  const history = useHistory()
  const [listPesertaLogbookAllMissing, setListPesertaLogbookAllMissing] = useState([])
  const [namaPembimbing, setNamaPembimbing] = useState()
  const [namaPerusahaan, setNamaPerusahaan] = useState()
  const [logbookMissing, setLogbookMissing] = useState()
  const [isHaveSupervisor, setIsHaveSupervisor] = useState(true)
  const [dataDashboardPeserta, setDataDashboardPeserta] = useState([])
  const [informasiPenilaianDokumenPeserta, setInformasiPenilaianDokumenPeserta] = useState()
  axios.defaults.withCredentials = true

  
  const showModalLogbookAllInfo = () => {
    setIsModalLogbookAllOpen(true)
  }

  const closeModalLogbookAllInfo = () => {
    setIsModalLogbookAllOpen(false)
  }

  const columnListPeserta = [
    {
      title: 'NO',
      dataIndex: 'idx',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return value + 1
      },
    },

    {
      title: 'Tanggal Logbook',
      dataIndex: 'logbook_missing',
      key: 'logbook_missing',
    },

  ]
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
    const getDataDashboard = async (index) => {
      let api_get_dashboard
      if (rolePengguna === '1') {
        api_get_dashboard = `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/dashboard`
      } else {
        api_get_dashboard = `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/dashboard?participant_id=${NIM_PESERTA}`
      }
      await axios
        .get(api_get_dashboard)
        .then((result) => {
          
         if(rolePengguna === '1'){
          setDataDashboardPeserta(result.data.data)
          let dataLogbookMissing = result.data.data.logbook_missing
          let dataLogbookMissingWithIndoDate = []
          let getDataLogbookMissingWithDateIndoVer = function (data){
            for(let iteration in data){
              dataLogbookMissingWithIndoDate.push(convertDate(data[iteration]))
            }
          }
        
          getDataLogbookMissingWithDateIndoVer(dataLogbookMissing)
          setLogbookMissing(dataLogbookMissingWithIndoDate)
          axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all`)
          .then((res)=>{
            setNamaPembimbing(res.data.data.lecturer_name)
            setNamaPerusahaan(res.data.data.company_name)
            setIsLoading(false)
          }).catch(function (error) {
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
              setNamaPembimbing('Belum Memiliki Pembimbing')
              setIsHaveSupervisor(false)
              setNamaPerusahaan('-')
              setIsLoading(false)
            }
          })
        
         }else{
        
           setDataDashboardPeserta(result.data.data)
           let dataLogbookMissing = result.data.data.logbook_missing
           let dataLogbookMissingWithIndoDate = []
           let getDataLogbookMissingWithDateIndoVer = function (data){
             for(let iteration in data){
               dataLogbookMissingWithIndoDate.push({
                idx : parseInt(iteration),
                logbook_missing : convertDate(data[iteration])
               })
             }
           }
         
           getDataLogbookMissingWithDateIndoVer(dataLogbookMissing)
           setListPesertaLogbookAllMissing(dataLogbookMissingWithIndoDate)
          // axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/document-grade?participant_id=${NIM_PESERTA}`)
          // .then((res)=>{
          //   setInformasiPenilaianDokumenPeserta(res.data.data)
          //   setTotalLogbookDinilai(res.data.data.logbook_graded)
          //   setTotalLogbookBelumDinilai(res.data.data.logbook_ungraded)
          //   setTotalLaporanDinilai(res.data.data.laporan_graded)
          //   setTotalLaporanBelumDinilai(res.data.data.laporan_ungraded)
          //   setIsLoading(false)
          // })
          
   
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    }
    getDataDashboard()
  }, [history])
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
      </>
    )
  }

  const printLogbookMissed = (data) =>{
    for(let iteration in logbookMissing){
      <ul>
        <li>{logbookMissing[iteration]}</li>
      </ul>
    }
  }

  const listLogbookMissed = () =>{

  return (
  logbookMissing.map((data)=>{
    return(
      <li key={data}>{data}</li>
    )
  })
  )
  }
  return (
    <>
      {title('DASHBOARD PESERTA')}
      <div className="container2">
       {rolePengguna === '1' && (
         <div className='spacebottom'>
         <Title level={4} style={{ padding: 10 }}>
           INFORMASI PEMBIMBING
         </Title>
         <div style={{ padding: 10 }}>
       {isHaveSupervisor && (
         <>
          <Row style={{ padding: 3 }}>
          <Col span={4}><b>Nama Pembimbing</b></Col>
          <Col span={2}><b>:</b></Col>
          <Col span={6}><b>{namaPembimbing}</b></Col>
        </Row>
        <Row style={{ padding: 3 }}>
          <Col span={4}><b>Nama Perusahaan</b></Col>
          <Col span={2}><b>:</b></Col>
          <Col span={6}><b>{namaPerusahaan}</b></Col>
        </Row>
        <hr/>
         </>
       )}

       {!isHaveSupervisor && (
        <>
          <Col span={6}><b> *&nbsp;&nbsp;{namaPembimbing}</b></Col>
          <hr/>
        </>
       )}
         </div>
         </div>
       )}
   
        <Title level={4} style={{ padding: 10 }}>
          KEGIATAN PESERTA SELAMA PELAKSANAAN
        </Title>
        <Timeline
          mode="alternate"
          items={[
            {
              children: 'Melakukan kegiatan KP dan PKL pada masing-masing lokasi',
            },
            {
              children:
                'Mengerjakan dan mengumpulkan Rencana Pengerjaan Proyek (RPP) dan melakukan pembaruan atau penambahan RPP apabila waktu/tanggal RPP telah berakhir',
              color: 'green',
            },
            {
              children: 'Mengerjakan logbook harian ( setiap hari )',
            },
            {
              children: 'Mengerjakan self assessment per minggu ',
              color: 'green',
            },
            {
              children: 'Menyicil dan menyusun laporan KP / PKL',
            },
            {
              dot: (
                <ClockCircleOutlined
                  style={{
                    fontSize: '16px',
                  }}
                />
              ),
              children:
                'Sempatkan waktu untuk melakukan bimbingan kepada masing-masing pembimbing KP dan PKL (termasuk ke dalam penilaian KP/PKL)',
              color: 'green',
            },
          ]}
        />
      </div>
    
      {title('INFORMASI PROGRES PENGUMPULAN DOKUMEN PESERTA')}
      <div className="container2">
        <div className="spacebottom spacetop">
          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>RPP</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 40 }}>{dataDashboardPeserta.rpp_submitted}</b>
                  </Col>
                   <Col span={12}> <FileDoneOutlined style={{ fontSize: 50 , color: 'green' }}/></Col>
                
                </Row>
               <Row>  <Col>Dokumen Sudah Dikumpulkan</Col></Row>
              </Card>
            </Col>

            {/* <Popover content={listLogbookMissed} title="LOGBOOK YANG TERLEWAT"> */}
            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 40 }}>{dataDashboardPeserta.logbook_submitted} / {dataDashboardPeserta.logbook_total}</b>
                  </Col>
                   <Col span={12}> <FileDoneOutlined style={{ fontSize: 50 , color: 'green' , marginLeft:20}}/></Col>
              
                </Row>
                <Row>  <Col>Dokumen Sudah Dikumpulkan</Col></Row>
                <Row><Col><Popover content={<div>List Tanggal Logbook Yang Belum Dikumpulkan</div>}><Button type='primary' onClick={showModalLogbookAllInfo}>Lihat Detail</Button></Popover></Col></Row>
              </Card>
            </Col>
            {/* </Popover> */}

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    {/* <b style={{ fontSize: 40 }}>{dataDashboardPeserta.self_assessment_submitted}</b> */}
                    <b style={{ fontSize: 40 }}>{dataDashboardPeserta.self_assessment_submitted} / {dataDashboardPeserta.self_assessment_total}</b>
                  </Col>
                  {/* <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col> */}
                   <Col span={12}> <FileDoneOutlined style={{ fontSize: 50 , color: 'green' }}/></Col>
                
                </Row>
                <Row>  <Col>Dokumen Sudah Dikumpulkan</Col></Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 40 }}>{dataDashboardPeserta.laporan_submitted} / {dataDashboardPeserta.laporan_total}</b>
                  </Col>
                  {/* <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col> */}
                 <Col span={12}> <FileDoneOutlined style={{ fontSize: 50 , color: 'green' }}/></Col>
               
                </Row>
                <Row>  <Col>Dokumen Sudah Dikumpulkan</Col></Row>
              </Card>
            </Col>
          </Row>
        </div>

      </div>
   {rolePengguna !== '1' && (
       <FloatButton
       type="primary"
       onClick={()=>{history.push(`/daftarPeserta`)}}
       icon={<ArrowLeftOutlined />}
       tooltip={<div>Kembali ke Rekap Dokumen Peserta</div>}
     />
   )}

   
<Modal
        width={800}
        open={isModalLogbookAllOpen}
        title="List Tanggal Logbook Yang Belum Dikumpulkan Oleh Peserta"
        footer={false}
        onCancel={closeModalLogbookAllInfo}
      >
        <Table dataSource={listPesertaLogbookAllMissing} columns={columnListPeserta} />
      </Modal>

    </>
  )
}

export default DashboardPeserta
