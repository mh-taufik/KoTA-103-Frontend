import React, { useEffect, useState } from 'react'
import { Button, Card, Col, FloatButton, Progress, Row, Space } from 'antd'
import { ClockCircleOutlined,ArrowLeftOutlined  } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'
const DashboardPeserta = () => {
  const params = useParams()
  const NIM_PESERTA = params.nim
  const rolePengguna = localStorage.id_role
  const [isLoading, setIsLoading] = useState(true)
  const history = useHistory()
  const [namaPembimbing, setNamaPembimbing] = useState()
  const [namaPerusahaan, setNamaPerusahaan] = useState()
  const [totalLogbookDinilai,setTotalLogbookDinilai] = useState()
  const [totalLogbookBelumDinilai,setTotalLogbookBelumDinilai] = useState()
  const [totalLaporanDinilai,setTotalLaporanDinilai] = useState()
  const [totalLaporanBelumDinilai,setTotalLaporanBelumDinilai] = useState()
  const [isHaveSupervisor, setIsHaveSupervisor] = useState(true)
  const [dataDashboardPeserta, setDataDashboardPeserta] = useState([])
  const [informasiPenilaianDokumenPeserta, setInformasiPenilaianDokumenPeserta] = useState()
  axios.defaults.withCredentials = true

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
          axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/document-grade?participant_id=${NIM_PESERTA}`)
          .then((res)=>{
            setInformasiPenilaianDokumenPeserta(res.data.data)
            setTotalLogbookDinilai(res.data.data.logbook_graded)
            setTotalLogbookBelumDinilai(res.data.data.logbook_ungraded)
            setTotalLaporanDinilai(res.data.data.laporan_graded)
            setTotalLaporanBelumDinilai(res.data.data.laporan_ungraded)
            setIsLoading(false)
          })
          
   
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
    {rolePengguna !== '1' && (
       <>
        {title('INFORMASI PENILAIAN DOKUMEN PESERTA ')}
        <div className="container2">
          <div className="spacebottom spacetop">
            <Row gutter={16}>
              <Col span={6}>
                <Card bordered={false}>
                  <b style={{ textAlign: 'center', fontSize: 20 }}>PENILAIAN LOGBOOK</b>
                  <hr style={{ paddingTop: 5, color: '#001d66' }} />
                  <Row style={{ padding: 10 }}>
                    <Col span={12}>
                      <b style={{ fontSize: 55 }}>{totalLogbookDinilai}</b>
                    </Col>
                    <Col span={12}>
                      <Progress type="circle" size={80} percent={100} />
                    </Col>
                    <Col>Logbook Telah Dinilai</Col>
                  </Row>
                </Card>
              </Col>
  
              <Col span={6}>
              <Card bordered={false}>
                  <b style={{ textAlign: 'center', fontSize: 20 }}>PENILAIAN LOGBOOK</b>
                  <hr style={{ paddingTop: 5, color: '#520339' }} />
                  <Row style={{ padding: 10 }}>
                    <Col span={12}>
                      <b style={{ fontSize: 55 }}>{totalLogbookBelumDinilai}</b>
                    </Col>
                    <Col span={12}>
                      <Progress type="circle" status="exception" size={80} percent={100} />
                    </Col>
                    <Col>Logbook Belum Dinilai</Col>
                  </Row>
                </Card>
              </Col>
  
              <Col span={6}>
                <Card bordered={false}>
                  <b style={{ textAlign: 'center', fontSize: 20 }}>PENILAIAN LAPORAN</b>
                  <hr style={{ paddingTop: 5, color: '#001d66' }} />
                  <Row style={{ padding: 10 }}>
                    <Col span={12}>
                      <b style={{ fontSize: 55 }}>{totalLaporanDinilai}</b>
                    </Col>
                    <Col span={12}>
                      <Progress type="circle" size={80} percent={100} />
                    </Col>
                    <Col>Form Pembimbing Telah Diisi</Col>
                  </Row>
                </Card>
              </Col>
  
              <Col span={6}>
              <Card bordered={false}>
                  <b style={{ textAlign: 'center', fontSize: 20 }}>PENILAIAN LAPORAN</b>
                  <hr style={{ paddingTop: 5, color: '#520339' }} />
                  <Row style={{ padding: 10 }}>
                    <Col span={12}>
                      <b style={{ fontSize: 55 }}>{totalLaporanBelumDinilai}</b>
                    </Col>
                    <Col span={12}>
                      <Progress type="circle" status="exception" size={80} percent={100} />
                    </Col>
                    <Col>Form Pembimbing Belum Diisi</Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
       
        </div>
       </>
    )}
      {title('INFORMASI DOKUMEN PESERTA ')}
      <div className="container2">
        <div className="spacebottom spacetop">
          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>RPP</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.rpp_submitted}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Sudah Dikumpulkan</Col>
                </Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.logbook_submitted}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Sudah Dikumpulkan</Col>
                </Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.self_assessment_submitted}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Sudah Dikumpulkan</Col>
                </Row>
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.laporan_submitted}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Sudah Dikumpulkan</Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.logbook_missing}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Belum Dikumpulkan</Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.self_assessment_missing}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Belum Dikumpulkan</Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboardPeserta.laporan_submitted}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Belum Dikumpulkan</Col>
                </Row>
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

    </>
  )
}

export default DashboardPeserta
