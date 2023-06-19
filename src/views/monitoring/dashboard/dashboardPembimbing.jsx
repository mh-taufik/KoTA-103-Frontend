import React, { useEffect, useState } from 'react'
import { Button, Card, Col, FloatButton, Progress, Row, Space } from 'antd'
import { ClockCircleOutlined,ArrowLeftOutlined  } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'
const DashboardPembimbing = () => {
  const params = useParams()
  const NIM_PESERTA = params.nim
  const rolePengguna = localStorage.id_role
  const history = useHistory()
  const [dataDashboard, setDataDashboard] = useState([])
  axios.defaults.withCredentials = true

  useEffect(() => {
    const getDataDashboard = async (index) => {
    
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/dashboard`)
        .then((result) => {
          setDataDashboard(result.data.data)
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

 
      {title('DASHBOARD PEMBIMBING JURUSAN - INFORMASI DOKUMEN PESERTA ')}
      <div className="container2">
        <div className="spacebottom spacetop">
          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>RPP</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboard.rpp_submitted}</b>
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
                    <b style={{ fontSize: 55 }}>{dataDashboard.logbook_submitted}</b>
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
                    <b style={{ fontSize: 55 }}>{dataDashboard.self_assessment_submitted}</b>
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
                    <b style={{ fontSize: 55 }}>{dataDashboard.laporan_submitted}</b>
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
                    <b style={{ fontSize: 55 }}>{dataDashboard.logbook_missing}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Belum Dilengkapi</Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboard.self_assessment_missing}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Belum Dilengkapi</Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{dataDashboard.laporan_submitted}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Dokumen Belum Dilengkapi</Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <FloatButton
          type="primary"
          onClick={()=>{history.push(`/daftarPeserta`)}}
          icon={<ArrowLeftOutlined />}
          tooltip={<div>Kembali ke Rekap Dokumen Peserta</div>}
        />

    </>
  )
}

export default DashboardPembimbing
