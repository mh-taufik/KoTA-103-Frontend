import React from 'react'
import { Button, Card, Col, Progress, Row, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
const MonitoringPelaksanaan = () => {
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
                    <b style={{ fontSize: 55 }}>1</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Sudah Mempunyai RPP</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>7</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Memiliki Dokumen Lengkap</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>2</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Memiliki Dokumen Lengkap</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>1</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Memiliki Dokumen Lengkap</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>
          </Row>
        </div>
        <div>
          <Row gutter={16}>
          <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>RPP</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>0</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Belum Mempunyai RPP</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>0</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Dokumen Tidak Lengkap</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>0</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Dokumen Tidak Lengkap</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={6}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#520339' }} />
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 55 }}>0</b>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle" status="exception" size={80} percent={100} />
                  </Col>
                  <Col>Peserta Dokumen Tidak Lengkap</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
     
    </>
  )
}

export default MonitoringPelaksanaan
