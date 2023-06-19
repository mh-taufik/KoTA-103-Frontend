import React from 'react'
import { Button, Card, Col, Progress, Row, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useLayoutEffect } from 'react'

const DashboardPanitia = () => {
    const [totalParticipantMappingDone, setTotalParticipantMappingDone] = useState()
    const [totalParticipantMappingUndone, setTotalParticipantMappingUndone] = useState()
    const history = useHistory()
 
  
    const [dataDashboard, setDataDashboard] = useState([])
    axios.defaults.withCredentials = true
  
  
  useEffect(()=>{
    const getDataDashboard = async (index) => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/dashboard`)
        .then((result) => {
     
          let data = result.data.data
          setTotalParticipantMappingDone(data.supervisor_mapping_done)
          setTotalParticipantMappingUndone(data.supervisor_mapping_undone)
  
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
  
  },[history])



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

      {title('INFORMASI PEMETAAN PEMBIMBING JURUSAN')}
      <div className='container2'>
      <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>TOTAL PESERTA</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{totalParticipantMappingDone}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Sudah memiliki pembimbing jurusan</Col>
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>TOTAL PESERTA</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>{totalParticipantMappingUndone}</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Belum memiliki pembimbing jurusan</Col>
                </Row>
              </Card>
            </Col>
            </Row>	
      </div>
    </>
  )
}

export default DashboardPanitia
