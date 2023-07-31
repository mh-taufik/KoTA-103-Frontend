import React from 'react'
import { Card, Col, Button, Progress, Row, Space, Modal, Table, Popover, Spin } from 'antd'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Timeline } from 'antd'
import '../pengisianDokumen/rpp/rpp.css'
import Title from 'antd/es/typography/Title'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

import { useLayoutEffect } from 'react'

const DashboardPanitia = () => {
  const [isOpenCollapseRPPMingguan, setIsOpenCollapseRPPMingguan] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const [isModalRppMingguanOpen, setIsModalRppMingguanOpen] = useState(false)
  const [isModalLogbookMingguanOpen, setIsModalLogbookMingguanOpen] = useState(false)
  const [isModalSelfAssessmentMingguanOpen, setIsModalSelfAssessmentMingguanOpen] = useState(false)
  const [isModalLaporanMingguanOpen, setIsModalLaporanMingguanOpen] = useState(false)
  const [isModalLogbookAllOpen, setIsModalLogbookAllOpen] = useState(false)
  const [isModalLaporanAllOpen, setIsModalLaporanAllOpen] = useState(false)
  const [totalParticipantMappingDone, setTotalParticipantMappingDone] = useState()
  const [totalParticipantMappingUndone, setTotalParticipantMappingUndone] = useState()
  const [totalProgresPesertaKeseluruhan, setTotalProgressPesertaKeseluruhan] = useState([])
  const [totalPesertaProgresMingguan, setTotalPesertaProgresMingguan] = useState([])
  const [listPesertaAllRPPMissing, setListPesertaAllRPPMissing] = useState([])
  const [listPesertaLogbookMingguanMissing, setListPesertaLogbookMingguanMissing] = useState([])
  const [listPesertaSelfAssessmentMingguanMissing, setListPesertaSelfAssessmentMingguanMissing] =
    useState([])
  const [listPesertaLaporanMingguanMissing, setListPesertaLaporanMingguanMissing] = useState([])
  const [listPesertaLogbookAllMissing, setListPesertaLogbookAllMissing] = useState([])
  const [listPesertaLaporanAllMissing, setListPesertaLaporanAllMissing] = useState([])
  const history = useHistory()

  const [dataDashboard, setDataDashboard] = useState([])
  axios.defaults.withCredentials = true

  const showModalRppMingguanInfo = () => {
    setIsModalRppMingguanOpen(true)
  }

  const closeModalRppMingguanInfo = () => {
    setIsModalRppMingguanOpen(false)
  }

  const showModalLogbookMingguanInfo = () => {
    setIsModalLogbookMingguanOpen(true)
  }

  const closeModalLogbookMingguanInfo = () => {
    setIsModalLogbookMingguanOpen(false)
  }

  const showModalSelfAssessmentMingguanInfo = () => {
    setIsModalSelfAssessmentMingguanOpen(true)
  }

  const closeModalSelfAssessmentMingguanInfo = () => {
    setIsModalSelfAssessmentMingguanOpen(false)
  }

  const showModalLaporanMingguanInfo = () => {
    setIsModalLaporanMingguanOpen(true)
  }

  const closeModalLaporanMingguanInfo = () => {
    setIsModalLaporanMingguanOpen(false)
  }

  const showModalLogbookAllInfo = () => {
    setIsModalLogbookAllOpen(true)
  }

  const closeModalLogbookAllInfo = () => {
    setIsModalLogbookAllOpen(false)
  }

  const showModalLaporanAllInfo = () => {
    setIsModalLaporanAllOpen(true)
  }

  const closeModalLaporanAllInfo = () => {
    setIsModalLaporanAllOpen(false)
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
      title: 'NIM',
      dataIndex: 'nim',
      key: 'nim',
    },

    {
      title: 'NAMA',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      key: 'company',
    },
  ]

  useEffect(() => {
    const getDataDashboard = async (index) => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/dashboard`)
        .then((result) => {
          let data = result.data.data
          let listPesertaAllRPPMissing = result.data.data.all.rpp_missing
          let listPesertaAllRPPMissingIdx = []
          let listPesertaLogbookMingguanMissing = result.data.data.weekly.logbook_missing
          let listPesertaLogbookMingguanMissingIdx = []
          let listPesertaSelfAssessmentMingguanMissing = result.data.data.weekly.self_assessment_missing 
          let listPesertaSelfAssessmentMingguanMissingIdx = []
          let listPesertaLaporanMingguanMissing = result.data.data.weekly.laporan_missing
          let listPesertaLaporanMingguanMissingIdx = []
          let listPesertaLogbookAllMissing = result.data.data.all.logbook_missing
          let listPesertaLogbookAllMissingIdx = [] 
          let listPesertaLaporanAllMissing = result.data.data.all.laporan_missing
          let listPesertaLaporanAllMissingIdx = []
          setTotalParticipantMappingDone(data.supervisor_mapping_done)
          setTotalParticipantMappingUndone(data.supervisor_mapping_undone)

          setDataDashboard(result.data.data)
          setTotalProgressPesertaKeseluruhan(result.data.data.all)
          setTotalPesertaProgresMingguan(result.data.data.weekly)
          //setListPesertaAllRPPMissing(result.data.data.all.rpp_missing)
          if(listPesertaAllRPPMissing != null){
            for(let iterateListPesertaAllRPPMissing in listPesertaAllRPPMissing){
              listPesertaAllRPPMissingIdx.push({
                'nim' : listPesertaAllRPPMissing[iterateListPesertaAllRPPMissing].nim,
                'name' : listPesertaAllRPPMissing[iterateListPesertaAllRPPMissing].name,
                'company' : listPesertaAllRPPMissing[iterateListPesertaAllRPPMissing].company,
                'idx' : parseInt(iterateListPesertaAllRPPMissing)
              })
              
            }
            setListPesertaAllRPPMissing(listPesertaAllRPPMissingIdx)
          }else{
            setListPesertaAllRPPMissing(result.data.data.all.rpp_missing)
          }
          
           //setListPesertaLogbookMingguanMissing(result.data.data.weekly.logbook_missing)
          if(listPesertaLogbookMingguanMissing != null){
            for(let iterateListPesertaLogbookMingguanMissing in listPesertaLogbookMingguanMissing){
              listPesertaLogbookMingguanMissingIdx.push({
                'nim' : listPesertaLogbookMingguanMissing[iterateListPesertaLogbookMingguanMissing].nim,
                'name' : listPesertaLogbookMingguanMissing[iterateListPesertaLogbookMingguanMissing].name,
                'company' : listPesertaLogbookMingguanMissing[iterateListPesertaLogbookMingguanMissing].company,
                'idx' : parseInt(iterateListPesertaLogbookMingguanMissing)
              })
              
            }
            setListPesertaLogbookMingguanMissing(   listPesertaLogbookMingguanMissingIdx)
          }else{
            setListPesertaLogbookMingguanMissing(result.data.data.weekly.logbook_missing)
          }

          // setListPesertaSelfAssessmentMingguanMissing(
          //   result.data.data.weekly.self_assessment_missing,
          // )
          if(listPesertaSelfAssessmentMingguanMissing != null){
            for(let iterateListPesertaSelfAssessmentMingguanMissing in listPesertaSelfAssessmentMingguanMissing){
              listPesertaSelfAssessmentMingguanMissingIdx.push({
                'nim' : listPesertaSelfAssessmentMingguanMissing[iterateListPesertaSelfAssessmentMingguanMissing].nim,
                'name' : listPesertaSelfAssessmentMingguanMissing[iterateListPesertaSelfAssessmentMingguanMissing].name,
                'company' : listPesertaSelfAssessmentMingguanMissing[iterateListPesertaSelfAssessmentMingguanMissing].company,
                'idx' : parseInt(iterateListPesertaSelfAssessmentMingguanMissing)
              })
              
            }
            setListPesertaSelfAssessmentMingguanMissing(listPesertaSelfAssessmentMingguanMissingIdx)
          }else{
            setListPesertaSelfAssessmentMingguanMissing(result.data.data.weekly.self_assessment_missing)
          }
          

          // setListPesertaLaporanMingguanMissing(result.data.data.weekly.laporan_missing)
          if(listPesertaLaporanMingguanMissing != null){
            for(let iterateListPesertaLaporanMingguanMissing in listPesertaLaporanMingguanMissing){
              listPesertaLaporanMingguanMissingIdx.push({
                'nim' : listPesertaLaporanMingguanMissing[iterateListPesertaLaporanMingguanMissing].nim,
                'name' : listPesertaLaporanMingguanMissing[iterateListPesertaLaporanMingguanMissing].name,
                'company' : listPesertaLaporanMingguanMissing[iterateListPesertaLaporanMingguanMissing].company,
                'idx' : parseInt(iterateListPesertaLaporanMingguanMissing)
              })
              
            }
            setListPesertaLaporanMingguanMissing(listPesertaLaporanMingguanMissingIdx)
          }else{
            setListPesertaLaporanMingguanMissing(result.data.data.weekly.laporan_missing)
          }

          // setListPesertaLogbookAllMissing(result.data.data.all.logbook_missing)
          if(listPesertaLogbookAllMissing != null){
            for(let iterateListPesertaLogbookAllMissing in listPesertaLogbookAllMissing){
              listPesertaLogbookAllMissingIdx.push({
                'nim' : listPesertaLogbookAllMissing[iterateListPesertaLogbookAllMissing].nim,
                'name' : listPesertaLogbookAllMissing[iterateListPesertaLogbookAllMissing].name,
                'company' : listPesertaLogbookAllMissing[iterateListPesertaLogbookAllMissing].company,
                'idx' : parseInt(iterateListPesertaLogbookAllMissing)
              })
              
            }
            setListPesertaLogbookAllMissing(listPesertaLogbookAllMissingIdx)
          }else{
            setListPesertaLogbookAllMissing(result.data.data.all.logbook_missing)
          }

          // setListPesertaLaporanAllMissing(result.data.data.all.laporan_missing)
          if(listPesertaLaporanAllMissing != null){
            for(let iterateListPesertaLaporanAllMissing in listPesertaLaporanAllMissing){
              listPesertaLaporanAllMissingIdx.push({
                'nim' : listPesertaLaporanAllMissing[iterateListPesertaLaporanAllMissing].nim,
                'name' : listPesertaLaporanAllMissing[iterateListPesertaLaporanAllMissing].name,
                'company' : listPesertaLaporanAllMissing[iterateListPesertaLaporanAllMissing].company,
                'idx' : parseInt(iterateListPesertaLaporanAllMissing)
              })
              
            }
            setListPesertaLaporanAllMissing(listPesertaLaporanAllMissingIdx)
          }else{
            setListPesertaLaporanAllMissing(result.data.data.all.laporan_missing)
          }
          // console.log(result.data.data.weekly.logbook_missing)
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

  return  isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ):(
    <>
      {title('INFORMASI PENGATURAN PEMBIMBING JURUSAN')}
      <div className="container2">
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

      {title('INFORMASI PROGRES PENGUMPULAN DOKUMEN PESERTA ( MINGGU INI )')}
      <div className="container2">
        <div className="spacebottom spacetop">
          <Row gutter={16}>
            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row>
                  <Col>Total Peserta</Col>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 25 }}>
                      {totalPesertaProgresMingguan.logbook_submitted} /{' '}
                      {totalPesertaProgresMingguan.logbook_total}
                    </b>
                  </Col>
                  <Col span={12}>
                    {' '}
                    <UserOutlined style={{ fontSize: 30, color: 'green', marginLeft: 20 }} />
                  </Col>
                </Row>
                <Row>
                  <Col>Yang Telah Melengkapi Dokumen</Col>
                </Row>

                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Popover content={<div>Lihat Peserta Yang Belum Melengkapi Logbook</div>}>
                      <Button type="primary" onClick={showModalLogbookMingguanInfo}>
                        Lihat Detail
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>SELF ASSESSMENT</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row>
                  <Col>Total Peserta</Col>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 25 }}>
                      {totalPesertaProgresMingguan.self_assessment_submitted} /{' '}
                      {totalPesertaProgresMingguan.self_assessment_total}
                    </b>
                  </Col>
                  <Col span={12}>
                    {' '}
                    <UserOutlined style={{ fontSize: 30, color: 'green' }} />
                  </Col>
                </Row>
                <Row>
                  <Col>Yang Telah Mengumpulkan Dokumen</Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Popover
                      content={
                        <div>
                          Lihat Peserta Yang Tidak Mengumpulkan
                          <br />
                          Self Assessment{' '}
                        </div>
                      }
                    >
                      <Button type="primary" onClick={showModalSelfAssessmentMingguanInfo}>
                        Lihat Detail
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row>
                  <Col>Total Peserta</Col>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 25 }}>
                      {totalPesertaProgresMingguan.laporan_submitted} /{' '}
                      {totalPesertaProgresMingguan.laporan_total}
                    </b>
                  </Col>
                  <Col span={12}>
                    {' '}
                    <UserOutlined style={{ fontSize: 30, color: 'green' }} />
                  </Col>
                </Row>
                <Row>
                  <Col>Yang Telah Mengumpulkan Dokumen</Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Popover
                      content={
                        <div>
                          Lihat Peserta Yang Belum Mengumpulkan
                          <br />
                          Laporan Pada Fase Ini{' '}
                        </div>
                      }
                    >
                      <Button type="primary" onClick={showModalLaporanMingguanInfo}>
                        Lihat Detail
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {title('INFORMASI PROGRES PENGUMPULAN DOKUMEN PESERTA ( KESELURUHAN )')}
      <div className="container2">
        <div className="spacebottom spacetop">
          <Row gutter={16}>
            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>RPP</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row>
                  <Col>Total Peserta</Col>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 25 }}>
                      {totalPesertaProgresMingguan.rpp_submitted}/
                      {totalPesertaProgresMingguan.rpp_total}
                    </b>
                  </Col>
                  <Col span={12}>
                    {' '}
                    <UserOutlined style={{ fontSize: 30, color: 'green' }} />
                  </Col>
                </Row>
                <Row>
                  <Col>Yang Telah Mempunyai RPP</Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Popover content={<div>Lihat Peserta Yang Belum Memiliki RPP</div>}>
                      <Button type="primary" onClick={showModalRppMingguanInfo}>
                        Lihat Detail
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LOGBOOK</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row>
                  <Col>Total Peserta</Col>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 25 }}>
                      {totalProgresPesertaKeseluruhan.logbook_submitted} /{' '}
                      {totalProgresPesertaKeseluruhan.logbook_total}
                    </b>
                  </Col>
                  <Col span={12}>
                    {' '}
                    <UserOutlined style={{ fontSize: 30, color: 'green', marginLeft: 20 }} />
                  </Col>
                </Row>
                <Row>
                  <Col>Yang Telah Melengkapi Dokumen</Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Popover
                      content={
                        <div>
                          Lihat Peserta Yang Belum Melengkapi Logbook
                      
                        </div>
                      }
                    >
                      <Button type="primary" onClick={showModalLogbookAllInfo}>
                        Lihat Detail
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card bordered={false}>
                <b style={{ textAlign: 'center', fontSize: 20 }}>LAPORAN</b>
                <hr style={{ paddingTop: 5, color: '#001d66' }} />
                <Row>
                  <Col>Total Peserta</Col>
                </Row>
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <b style={{ fontSize: 25 }}>
                      {totalProgresPesertaKeseluruhan.laporan_submitted} /{' '}
                      {totalProgresPesertaKeseluruhan.laporan_total}
                    </b>
                  </Col>

                  <Col span={12}>
                    {' '}
                    <UserOutlined style={{ fontSize: 30, color: 'green' }} />
                  </Col>
                </Row>
                <Row>
                  <Col>Yang Telah Melengkapi Dokumen</Col>
                </Row>
                <Row style={{ paddingTop: 10 }}>
                  <Col>
                    <Popover
                      content={
                        <div>
                          Lihat Peserta Yang Belum Melengkapi <br/>Dokumen Laporan
                      
                        </div>
                      }
                    >
                      <Button type="primary" onClick={showModalLaporanAllInfo}>
                        Lihat Detail
                      </Button>
                    </Popover>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        width={800}
        open={isModalRppMingguanOpen}
        title="Peserta Yang Belum Memiliki RPP"
        footer={false}
        onCancel={closeModalRppMingguanInfo}
      >
        <Table dataSource={listPesertaAllRPPMissing} columns={columnListPeserta} />
      </Modal>

      <Modal
        width={800}
        open={isModalLogbookMingguanOpen}
        title="Peserta Yang Belum Melengkapi Logbook Minggu ini"
        footer={false}
        onCancel={closeModalLogbookMingguanInfo}
      >
        <Table dataSource={listPesertaLogbookMingguanMissing} columns={columnListPeserta} />
      </Modal>

      <Modal
        width={800}
        open={isModalSelfAssessmentMingguanOpen}
        title="Peserta Yang Tidak Mengumpulkan Self Assessment Minggu ini"
        footer={false}
        onCancel={closeModalSelfAssessmentMingguanInfo}
      >
        <Table dataSource={listPesertaSelfAssessmentMingguanMissing} columns={columnListPeserta} />
      </Modal>

      <Modal
        width={800}
        open={isModalLaporanMingguanOpen}
        title="Peserta Yang Tidak Mengumpulkan Laporan Pada Fase (Minggu) Ini"
        footer={false}
        onCancel={closeModalLaporanMingguanInfo}
      >
        <Table dataSource={listPesertaLaporanMingguanMissing} columns={columnListPeserta} />
      </Modal>

      <Modal
        width={800}
        open={isModalLogbookAllOpen}
        title="Peserta Yang Belum Melengkapi Logbook (Keseluruhan)"
        footer={false}
        onCancel={closeModalLogbookAllInfo}
      >
        <Table dataSource={listPesertaLogbookAllMissing} columns={columnListPeserta} />
      </Modal>

      
      <Modal
        width={800}
        open={isModalLaporanAllOpen}
        title="Peserta Yang Belum Melengkapi Laporan (Keseluruhan)"
        footer={false}
        onCancel={closeModalLaporanAllInfo}
      >
        <Table dataSource={listPesertaLaporanAllMissing} columns={columnListPeserta} />
      </Modal>
    </>
  )
}

export default DashboardPanitia
