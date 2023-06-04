import React from 'react'
import { Button, Card, Col, Progress, Row, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
const DashboardPeserta = () => {
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
              // color: 'red',
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
                  <Col>Dokumen Sudah Dikumpulkan</Col>
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
                  <Col>Dokumen Sudah Dikumpulkan</Col>
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
                  <Col>Dokumen Sudah Dikumpulkan</Col>
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
                  <Col>Dokumen Sudah Dikumpulkan</Col>
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
            <Col span={8}>
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
                  <Col>Dokumen Belum Dilengkapi</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={8}>
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
                  <Col>Dokumen Belum Dilengkapi</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>

            <Col span={8}>
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
                  <Col>Dokumen Belum Dilengkapi</Col>
                </Row>
                {/* <Row>
                <Col><Button type='primary'>Lihat Detail</Button></Col>
              </Row> */}
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {title('TIMELINE DOKUMEN PESERTA ')}
      <div className='container2'></div>
    </>
  )
}

export default DashboardPeserta
