import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow } from '@coreui/react'
import { ArrowLeftOutlined, FileOutlined } from '@ant-design/icons'
import Chart, {
  CommonSeriesSettings,
  Legend,
  SeriesTemplate,
  Animation,
  ArgumentAxis,
  Tick,
  Title,
  Tooltip,
  ValueAxis,
  Height,
} from 'devextreme-react/chart'
import { LoadingOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  FloatButton,
  Form,
  Input,
  Modal,
  Pagination,
  Popover,
  Result,
  Row,
  Select,
  Space,
  Spin,
  notification,
} from 'antd'
import '../../pengisianDokumen/rpp/rpp.css'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'

import { useMemo } from 'react'
import { Table } from 'react-bootstrap'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const PenilaianSelfAssessment = () => {
  let history = useHistory()
  var params = useParams()

  let NIM_PESERTA = params.nim //untuk pembimbing
  let ID_SELFASSESSMENT = params.id //untuk pembimbing

  const [timeline, setTimeline] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  let rolePengguna = localStorage.id_role
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
 

  const [idDataRPP,setIdDataRPP] = useState()
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  const [loadings, setLoadings] = useState([])
  const [logbookCurrentComplete, setLogbookCurrentComplete] = useState([])
  const [showArrow, setShowArrow] = useState(true)
  const [arrowAtCenter, setArrowAtCenter] = useState(false)
  const [penilaianBefore, setPenilaianBefore] = useState()
  const [idLogbookChoosen, setIdLogbookChoosen] = useState()
  const [nilai, setNilai] = useState()
  const [listAspectSelfAssessment, setListAspectSelfAssessment] = useState([])
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [nilaiSelfAssessment, setNilaiSelfAssessment] = useState([])
  const [pages, setPages] = useState(1)
  const [currentLogbook, setCurrentLogbook] = useState(0)

  const [isRppAvailable, setIsRppAvailable] = useState()
  const [isLogbookAvailable, setIsLogbookAvailable] = useState()
  const [isSelfAssessmentAvailable, setIsSelfAssessmentAvailable] = useState()

  /** PAGINATION LOGBOOK */
  const handleChange = (value) => {
    var page = value - 1
    setCurrentLogbook(page)
    console.log('page', value)
    setPages(value)
  }

  /** HANDLE SAAT NILAI SA DI UBAH */
  const handleChangeNilaiSelfAssessment = (
    index,
    keyData,
    sa_grade,
    sa_desc,
    sa_aspect_id,
    sa_grade_id,
  ) => {
    if (nilaiSelfAssessment[index]) {
      console.log('ya')
      nilaiSelfAssessment[index][keyData] = sa_grade
    } else {
      console.log('no')
      nilaiSelfAssessment[index] = {
        aspect_id: sa_aspect_id,
        [keyData]: sa_grade,
        description: sa_desc,
        grade_id: sa_grade_id,
      }

      setNilaiSelfAssessment(nilaiSelfAssessment)
    }
  }

  useEffect(() => {
    console.log('nilai self assessment', nilaiSelfAssessment)
  }, [nilaiSelfAssessment])



  /** HANDLE CANCEL EDIT MODAL */
  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }

  axios.defaults.withCredentials = true

  const getData = (data) => {
    for (var i = 0; i < data.length; i++) {
      data[i].start_date = new Date(data[i].start_date)
      data[i].end_date = new Date(data[i].end_date)
    }
    return data
  }

  /** SHOW EDIT PENILAIAN LOGBOOK */
  const showModalEdit = (record) => {
    setIsModalEditVisible(true)
    setChoose(record)
    setIdLogbookChoosen(record.id)
    setNilai(record.grade)
    // if (record.nilai === null) {
    //   setPenilaianBefore('Belum Diberi Penilaian')
    // } else {
    //   setPenilaianBefore(record.nilai)
    // }
  }


  /** POST DATA PENILAIAN LOGBOOK PESERTA */
  const penilaianLogbookPeserta = async (idLogbook, index) => {
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/grade`, {
        grade: nilai,
        id: parseInt(idLogbook),
      })
      .then((response) => {
        console.log('res', response)
        setIsModalEditVisible(false)
        notification.success({
          message: 'Penilaian Logbook Berhasil Diubah',
        })

        refreshData()
      })
      .catch((error) => {
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

  /** HANDLING PERUBAHAN NILAI SELF ASSESSMENT */

  const SimpanPenilaianSelfAssessment = async () => {
    if (nilaiSelfAssessment.length > 0) {
      await axios
        .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/update`, {
          finish_date: selfAssessmentPeserta.finish_date,
          grade: nilaiSelfAssessment,
          id: selfAssessmentPeserta.self_assessment_id,
          participant_id: parseInt(NIM_PESERTA),
          start_date: selfAssessmentPeserta.start_date,
        })
        .then((res) => {
          console.log(res)
          notification.success({
            message: 'Penilaian self assessment berhasil diubah',
          })
          refreshData()
        })
    } else {
      notification.warning({ message: 'Tidak ada penilaian yang diubah !!! ' })
    }
  }

  /** USE EFFECT */
  useEffect(() => {
    const getDataBasedOnSelfAssessment = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/associated/self-assessment?participant_id=${NIM_PESERTA}&self_assessment_id=${ID_SELFASSESSMENT}`,
        )
        .then((response) => {
          const data_rpp = response.data.data.rpp
          const data_logbook = response.data.data.logbook
          const data_self_assessment = response.data.data.selfAssessment
          let content = []
          // console.log('dataaa', data_logbook)

          if (data_rpp === null) {
            setIsRppAvailable(false)
          } else {
            setIsRppAvailable(true)
          }

          if (data_logbook === null || data_logbook.length<1) {
            setIsLogbookAvailable(false)
          } else {
            setIsLogbookAvailable(true)
            console.log('logbook', data_logbook)
            setLogbookPeserta(data_logbook)
          }

          if (data_self_assessment === null) {
            setIsSelfAssessmentAvailable(false)
          } else {
            setIsSelfAssessmentAvailable(true)
            setSelfAssessmentPeserta(data_self_assessment)
            setListAspectSelfAssessment(data_self_assessment.aspect_list)
          }

          if (data_rpp !== null) {
            if (data_rpp.completion_schedules !== null) {
              setIdDataRPP(data_rpp.rpp_id)
              var findObjectByLabel = function (obj) {
                for (var i in obj) {
                  content.push({
                    id: obj[i].id,
                    name: obj[i].task_type,
                    description: obj[i].task_name,
                    start_date: obj[i].start_date,
                    end_date: obj[i].finish_date,
                  })
                }
              }

              findObjectByLabel(data_rpp.completion_schedules)
              setTimeline(content)
            }
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    }

    function getCurrUrl () {
      let url = window.location.href
      let getSplit = url.split('/')
      console.log('hasil split', getSplit)
      console.log('url', window.location.href)
    }

    getCurrUrl()

    getDataBasedOnSelfAssessment()
  }, [history])

  /** HANDLING TIMELINE */
  const customizeTooltip = (arg) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    var start_date = new Date(arg.point.data.start_date)
    var end_date = new Date(arg.point.data.end_date)
    return {
      text: `<b>${arg.point.data.description}</b> <br> ${start_date.toLocaleDateString(
        'en-GB',
        options,
      )} - ${end_date.toLocaleDateString('en-GB', options)}`,
    }
  }

  /** JUDUL  */
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
        <div className="spacebottom"></div>
      </>
    )
  }

  /** PENYESUAIAN WARNA TEKS PADA STATUS PENGUMPULAN */
  const colorTextStatusPengumpulan = (teks) => {
    if (teks === 'terlambat') {
      return <text style={{ color: '#a8071a' }}>{teks}</text>
    } else if (teks === 'tepat waktu') {
      return <text style={{ color: '#237804' }}>{teks}</text>
    }
  }

  /** HOVER STATUS PENILAIAN DAN DETAIL PENILAIAN DARI LOGBOOK */
  const textSangatBaik = <text>Deskripsi Penilaian</text>

  const contentPenilaianSangatBaik = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit tepat waktu</li>
        <li>Kelengkapan semua data logbook</li>
        <li>Isi konten logbook yang dinilai baik</li>
        <li>Sesuai dengan perencanaan RPP</li>
        <li>Tidak copy paste dari logbook sebelumnya</li>
      </ul>
    </div>
  )

  const contentPenilaianBaik = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit tepat waktu / terlambat maksimal 5 hari </li>
        <li>Kelengkapan semua data logbook</li>
        <li>Isi konten logbook yang dinilai baik</li>
        <li>Sesuai dengan perencanaan RPP</li>
        <li>Tidak copy paste dari logbook sebelumnya</li>
      </ul>
    </div>
  )

  const contentPenilaianCukup = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit terlambat lebih dari 7 hari dan kurang dari 10 hari</li>
        <li>Isi data logbook yang kurang lengkap</li>
        <li>Isi konten logbook yang dinilai cukup</li>
        <li>Waktu perencanaan dan isi konten yang tidak sesuai</li>
      </ul>
    </div>
  )

  const contentPenilaianKurang = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit terlambat lebih dari 10 hari</li>
        <li>Tidak copy paste dari logbook sebelumnya</li>
      </ul>
    </div>
  )

  const mergedArrow = useMemo(() => {
    if (arrowAtCenter) return { pointAtCenter: true }
    return showArrow
  }, [showArrow, arrowAtCenter])

  const refreshData = async (id, index) => {
    await axios
      .get(
        `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/associated/self-assessment?participant_id=${NIM_PESERTA}&self_assessment_id=${ID_SELFASSESSMENT}`,
      )
      .then((response) => {
        const data_rpp = response.data.data.rpp
        const data_logbook = response.data.data.logbook
        const data_self_assessment = response.data.data.selfAssessment
        let content = []

        if (data_rpp === null) {
          setIsRppAvailable(false)
        } else {
          setIsRppAvailable(true)
        }

        if (data_logbook === null) {
          setIsLogbookAvailable(false)
        } else {
          setIsLogbookAvailable(true)
          console.log('logbook', data_logbook)
          setLogbookPeserta(data_logbook)
        }

        if (data_self_assessment === null) {
          setIsSelfAssessmentAvailable(false)
        } else {
          setIsSelfAssessmentAvailable(true)
          setSelfAssessmentPeserta(data_self_assessment)
          setListAspectSelfAssessment(data_self_assessment.aspect_list)
        }

        if (data_rpp !== null) {
          if (data_rpp.completion_schedules !== null) {
            var findObjectByLabel = function (obj) {
              for (var i in obj) {
                content.push({
                  id: obj[i].id,
                  name: obj[i].task_type,
                  description: obj[i].task_name,
                  start_date: obj[i].start_date,
                  end_date: obj[i].finish_date,
                })
              }
            }

            findObjectByLabel(data_rpp.completion_schedules)
            setTimeline(content)
          }
        }

        setIsLoading(false)
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  /** HANDLE BUTTON */
  const btnKembali = () => {
    history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${NIM_PESERTA}`)
  }

  const lihatIsiDetailRPP = () => {
    history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${NIM_PESERTA}/penilaian/${ID_SELFASSESSMENT}/detailRPP/${idDataRPP}`)
  }

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <div className="container2">
        {title('RENCANA PENGERJAAN PROYEK ( RPP )')}

        {isRppAvailable && (
          <>
          <div style={{ padding: 10 }}>
            <div style={{ background: '#fff', padding: 24 }}>
              <div style={{ overflowX: 'scroll' }}>
                <Chart
                  id="chart"
                  dataSource={getData(timeline)}
                  barGroupPadding={0}
                  barPadding={0}
                  rotated={true}
                >
                  <ArgumentAxis>
                    <Tick visible={false} />
                  </ArgumentAxis>
                  <ValueAxis></ValueAxis>
                  <Title
                    horizontalAlignment={'left'}
                    text="Timeline Rencana Pengerjaan Proyek Peserta"
                  />
                  <CommonSeriesSettings
                    type="rangeBar"
                    argumentField="name"
                    rangeValue1Field="end_date"
                    rangeValue2Field="start_date"
                    barOverlapGroup="description"
                    barWidth="25"
                    barPadding={0}
                  />
                  <Legend
                    visible={false}
                    orientation="horizontal"
                    verticalAlignment="bottom"
                    horizontalAlignment="left"
                  />
                  <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
                  <SeriesTemplate nameField="name" />
                  <Animation enabled={true} />
                </Chart>
              </div>
            </div>
          </div>
          <div className='spacetop'><Button type='primary' onClick={lihatIsiDetailRPP}>Lihat Detail RPP</Button></div>
          </>
        )}

        {!isRppAvailable && <Result icon={<FileOutlined />} title="Tidak Ada RPP Yang Terkait" />}

        <div style={{ marginTop: 150 }}>
          {title('SELF ASSESSMENT')}

          {(isSelfAssessmentAvailable && rolePengguna === '4') && (
            <ul className="list-group mb-4">
              <div>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <td>Tanggal Self Assessment</td>
                        <td>:</td>
                        <td>
                          &nbsp;&nbsp;
                          {selfAssessmentPeserta.start_date} &nbsp; s/d &nbsp;
                          {selfAssessmentPeserta.finish_date}
                        </td>
                      </tr>
                    </thead>
                  </table>
                  <div className="spacetop"></div>
                  <Table striped="columns">
                    <thead>
                      <tr>
                        <td>
                          <b>NO</b>
                        </td>
                        <td>
                          <b>POIN SELF ASSESSMENT</b>
                        </td>
                        <td width={'10%'}>
                          <b>NILAI</b>
                        </td>
                        <td width={'50%'}>
                          <b>KETERANGAN</b>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {listAspectSelfAssessment.map((data, index) => {
                        return (
                          <tr key={data.aspect_id}>
                            <td>{index + 1}</td>
                            <td>{data.aspect_name}</td>
                            <td width={'10%'}>
                              <Input
                                onChange={(e) =>
                                  handleChangeNilaiSelfAssessment(
                                    index,
                                    'grade',
                                    e.target.value,
                                    data.description,
                                    data.aspect_id,
                                    data.grade_id,
                                  )
                                }
                                defaultValue={data.grade}
                                type="number"
                                placeholder="Input a number"
                                maxLength={2}
                              ></Input>
                            </td>
                            <td>{data.description}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
             
                  <Button type="primary" onClick={SimpanPenilaianSelfAssessment} variant="contained">
                  Simpan Nilai
                </Button>
              
              </div>
              <br />
            </ul>
          )}

{(isSelfAssessmentAvailable && rolePengguna !== '4') && (
            <ul className="list-group mb-4">
              <div>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <td>Tanggal Self Assessment</td>
                        <td>:</td>
                        <td>
                          &nbsp;&nbsp;
                          {selfAssessmentPeserta.start_date} &nbsp; s/d &nbsp;
                          {selfAssessmentPeserta.finish_date}
                        </td>
                      </tr>
                    </thead>
                  </table>
                  <div className="spacetop"></div>
                  <Table striped="columns">
                    <thead>
                      <tr>
                        <td>
                          <b>NO</b>
                        </td>
                        <td>
                          <b>POIN SELF ASSESSMENT</b>
                        </td>
                        <td width={'10%'}>
                          <b>NILAI</b>
                        </td>
                        <td width={'50%'}>
                          <b>KETERANGAN</b>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {listAspectSelfAssessment.map((data, index) => {
                        return (
                          <tr key={data.aspect_id}>
                            <td>{index + 1}</td>
                            <td>{data.aspect_name}</td>
                            <td width={'10%'}>
                              <Input
                              disabled
                                onChange={(e) =>
                                  handleChangeNilaiSelfAssessment(
                                    index,
                                    'grade',
                                    e.target.value,
                                    data.description,
                                    data.aspect_id,
                                    data.grade_id,
                                  )
                                }
                                defaultValue={data.grade}
                                type="number"
                                placeholder="Input a number"
                                maxLength={2}
                              ></Input>
                            </td>
                            <td>{data.description}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
             
              
              </div>
              <br />
            </ul>
          )}

          {!isSelfAssessmentAvailable && (
            <Result icon={<FileOutlined />} title="Tidak Ada Self Assessment Yang Terkait" />
          )}
        </div>

        <div style={{ marginTop: 150 }}>
          {title('LOGBOOK')}

          {isLogbookAvailable && (
            <div>
              {logbookPeserta.map((currElement, index) => {
                if (index === currentLogbook) {
                  return (
                    <>
                      <table>
                        <tr>
                          {/* <td>Status Pengumpulan</td> */}
                          {/* <td>:</td> */}
                          <td>
                            <b>
                              {/* {colorTextStatusPengumpulan(
                                logbookPeserta[currentLogbook].statuspengumpulan,
                              )} */}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Penilaian</td>
                          <td>:</td>
                          <td>{logbookPeserta[currentLogbook].grade}</td>
                        </tr>
                        <tr>
                          <td>Tanggal Logbook</td>
                          <td>:</td>
                          <td>{logbookPeserta[currentLogbook].date}</td>
                        </tr>
                      </table>
                      <div className="spacetop"></div>
                      <Table striped="columns">
                        <tbody>
                          <tr>
                            <td>
                              <b>Tanggal</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].date}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Nama Proyek</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].project_name}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Proyek Manager</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].project_manager}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Technical leader</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].technical_leader}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Tugas</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].task}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Waktu dan Kegiatan Harian</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].time_and_activity}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Tools yang digunakan</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].tools}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Hasil Kerja</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].work_result}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Keterangan</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].description}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <br />
                      <br />
                     {rolePengguna === '4' && (
                       <Button
                       type="primary"
                       onClick={() => showModalEdit(logbookPeserta[currentLogbook])}
                     >
                        Penilaian
                     </Button>
                     )}
                      <br />
                      <br />
                      <Pagination
                        defaultCurrent={pages}
                        defaultPageSize={1}
                        onChange={handleChange}
                        total={logbookPeserta.length}
                      />
                    </>
                  )
                }
              })}
            </div>
          )}

          {!isLogbookAvailable && (
            <Result icon={<FileOutlined />} title="Tidak Ada Logbook Yang Terkait" />
          )}
        </div>
      </div>

      <Modal
        title="Penilaian Logbook Peserta"
        open={isModaleditVisible}
        onOk={form1.submit}
        onCancel={handleCancelEdit}
        width={600}
        zIndex={99}
        enforceFocus={true}
        footer={[
          <Button key="back" onClick={handleCancelEdit}>
            Batal
          </Button>,
          <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
            Simpan
          </Button>,
        ]}
      >
        <h6>Penilaian dipilih : {nilai}</h6>
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => penilaianLogbookPeserta(idLogbookChoosen)}
          autoComplete="off"
          fields={[
            {
              name: 'namapembimbing',
              // value: pembimbingChoosen,
            },
          ]}
        >
          <Form.Item label="Pilih Nilai" rules={[{ required: true, message: 'Penilaian' }]}>
            <Form.Item>
              <Space wrap>
                <Popover
                  className="indexing"
                  placement="topRight"
                  title={textSangatBaik}
                  content={contentPenilaianSangatBaik}
                  arrow={mergedArrow}
                >
                  <Button primary onClick={() => setNilai('SANGAT_BAIK')}>
                    Sangat Baik
                  </Button>
                </Popover>
                <Popover
                  className="indexing"
                  placement="topRight"
                  title={textSangatBaik}
                  content={contentPenilaianBaik}
                  arrow={mergedArrow}
                >
                  <Button primary onClick={() => setNilai('BAIK')}>
                    Baik
                  </Button>
                </Popover>
                <Popover
                  className="indexing"
                  placement="topRight"
                  title={textSangatBaik}
                  content={contentPenilaianCukup}
                  arrow={mergedArrow}
                >
                  <Button primary onClick={() => setNilai('CUKUP')}>
                    Cukup
                  </Button>
                </Popover>
                <Popover
                  className="indexing"
                  placement="topRight"
                  title={textSangatBaik}
                  content={contentPenilaianKurang}
                  arrow={mergedArrow}
                >
                  <Button primary onClick={() => setNilai('KURANG')}>
                    Kurang
                  </Button>
                </Popover>
              </Space>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      <FloatButton
        type="primary"
        onClick={btnKembali}
        icon={<ArrowLeftOutlined />}
        tooltip={<div>Kembali ke Rekap Self Assessment Peserta</div>}
      />
    </>
  )
}

export default PenilaianSelfAssessment
