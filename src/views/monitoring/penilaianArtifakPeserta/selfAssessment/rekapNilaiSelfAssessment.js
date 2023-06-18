import React, { useState, useEffect, useMemo } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined, FileExclamationOutlined } from '@ant-design/icons'
import '../../pengisianDokumen/rpp/rpp.css'
import { Table } from 'react-bootstrap'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { Card, Col, FloatButton, Progress, Result, Row, Space, Spin, Tooltip } from 'antd'
import { Box } from '@mui/material'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapSelfAssessment = () => {
  const params = useParams()
  const ID_PARTICIPANT = params.id
  const [dataPeserta, setDataPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [komponenPenilaianSelfAssessment, setKomponenPenilaianSelfAssessment] = useState([])
  let rolePengguna = localStorage.id_role
  const [dataStatistikPeserta, setDataStatistikPeserta] = useState([])
  let history = useHistory()
  axios.defaults.withCredentials = true
  const [bestPerformance, setBestPerformance] = useState()
  const [hasilAkhirPenilaian, setHasilAkhirPenilaian] = useState()
  const [averagePerPoin, setAveragePerPoin] = useState()
  const [finalGradePerPoin, setFinalGradePerPoin] = useState()
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [isNotNullDataSelfAssessment, setIsNotNullDataSelfAssessment] = useState()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const contoller_abort = new AbortController()
  const [data, setData] = React.useState()
  const handlePopoverOpen = (event, data) => {
    setAnchorEl(event.currentTarget)
    setData(data)
    // console.log(data)
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

  const handlePopOverData = () => {
    return <Typography sx={{ p: 1 }}>{data}</Typography>
  }

  const open = Boolean(anchorEl)

  useEffect(
    () => {
      async function getSelfAssessmentAspect() {
        await axios
          .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/get`)
          .then((result) => {
            console.log('komponen', result.data.data)
            setKomponenPenilaianSelfAssessment(result.data.data)

            axios
              .get(
                `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get-final-grade/${ID_PARTICIPANT}`,
              )
              .then((result) => {
                console.log('RES', result.data.data)
                let best_performance = result.data.data.best_grade
                let average_data = result.data.data.average_grade
                let final_grade = result.data.data.final_grade
                let tempBestPerformance = []

                let getBestPerformanceData = function (data) {
                  for (var i in data) {
                    tempBestPerformance.push({
                      grade: data[i].grade,
                      description: data[i].description,
                    })
                  }
                }
                getBestPerformanceData(best_performance)
                setBestPerformance(tempBestPerformance)

                let tempAverage = []
                let getAverage = function (data) {
                  for (var i in data) {
                    tempAverage.push({
                      grade: data[i].grade,
                    })
                  }
                }
                getAverage(average_data)
                setAveragePerPoin(tempAverage)
                console.log('temssp', average_data)

                let tempfinalGrade = []
                let len_grade = final_grade.length
                let total_final_grade = 0
                let getFinalGrade = function (data) {
                  for (var i in data) {
                    
                    tempfinalGrade.push({
                      grade: data[i].grade,
                    })
                    total_final_grade = total_final_grade + data[i].grade
                    console.log("total",data[i].grade, typeof data[i].grade)
                  }
                }
                getFinalGrade(final_grade)
                setHasilAkhirPenilaian(Math.round(total_final_grade / len_grade))
                setFinalGradePerPoin(tempfinalGrade)

                axios
                  .get(
                    `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/statistic/${ID_PARTICIPANT}`,
                  )
                  .then((res) => {
                    setDataStatistikPeserta(res.data.data)

                    getSelfAssessmentPeserta()
                  })
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
            } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
              history.push('/500')
            }
          })
   
      }

      async function getDataInformasiPeserta() {
        await axios
          .post(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-by-id`, {
            id: [ID_PARTICIPANT],
          })
          .then((result) => {
            setDataPeserta(result.data.data[0])
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

      const getSelfAssessmentPeserta = async (index) => {
        await axios
          .get(
            `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get-all/${ID_PARTICIPANT}`,
          )
          .then((result) => {
            console.log('sa', result.data.data)
            if (result.data.data !== null) {
              let temp = result.data.data

              setIsNotNullDataSelfAssessment(true)
              // setSelfAssessmentPeserta(temp)
              let dataSelfAssessmentPesertaSubmitted = []
              let getDataSelfAssessmentPesertaSubmitted = function (data) {
            
                for (var i in data) {
                  console.log('DDD', data[i])
                  if (data[i].self_assessment_id !== null) {
                    let data_sa = {
                      start_date : convertDate(data[i].start_date),
                      grade : data[i].grade,
                      self_assessment_id : data[i].self_assessment_id,
                      participant_id :data[i].participant_id,
                      finish_date :data[i].finish_date
                    }
                    console.log('datasa', data_sa)
                    dataSelfAssessmentPesertaSubmitted.push(data_sa)
                  } 
                }
              }
              getDataSelfAssessmentPesertaSubmitted(result.data.data)
              console.log('HASIL AKHIR SA', dataSelfAssessmentPesertaSubmitted)
              setSelfAssessmentPeserta(dataSelfAssessmentPesertaSubmitted)
            } else {
              setIsNotNullDataSelfAssessment(false)
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
            } else if (error.toJSON().status > 500 && error.toJSON().status <= 599) {
              history.push('/500')
            } else if (error.toJSON().status === 500) {
              setSelfAssessmentPeserta(undefined)
              setIsNotNullDataSelfAssessment(false)
              setIsLoading(false)
            }
          })
      }

      // GetFinalGrade()
      getDataInformasiPeserta()
      getSelfAssessmentAspect()

      return () => contoller_abort.abort()
    },
    [history],
    [],
  )

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
      </>
    )
  }

  function getDataPerSA(data) {
    data.map((data, index) => <td key={data.grade_id}>{data.grade}</td>)
  }

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <div>
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
      </div>
      {title('REKAP PENILAIAN SELF ASSESSMENT PESERTA')}
      {isNotNullDataSelfAssessment && (
        <>
          <div className="container2">
            <Box sx={{ color: 'warning.main' }} className="spacebottom">
              <ul>
                {/* <li>Pastikan semua RPP terisi</li> */}
                <li>
                  Nilai terdiri dari : nilai performansi terbaik diperoleh dari nilai tertinggi
                  setiap poin self assesment dari keseluruhan self assessment
                </li>
                <li>
                  Rata rata : diperoleh dari hasil rata-rata tiap poin untuk seluruh self assessment
                </li>
                <li>Hasil akhir : 60% dari performansi terbaik dan 40% dari nilai rata-rata</li>
                <li>
                  Arahkan kursor ke nilai performansi terbaik, untuk melihat keterangan dari
                  performansi terbaik
                </li>
              </ul>
            </Box>
            <div className="spacebottom">
              <Row style={{ padding: 6 }}>
                <Col span={4}>Self Assessment Dikumpulkan</Col>
                <Col span={4}>
                  <Progress
                    status="active"
                    percent={dataStatistikPeserta.self_assessment_submitted.percent}
                  />
                </Col>
                <Col span={2}>
                  &nbsp;&nbsp;{dataStatistikPeserta.self_assessment_submitted.count} Dokumen
                </Col>
                <Col span={2}></Col>
                <Col span={4}>Self Assessment Tidak Dikumpulkan</Col>
                <Col span={4}>
                  <Progress
                    status="exception active"
                    percent={dataStatistikPeserta.self_assessment_missing.percent}
                  />
                </Col>
                <Col span={2}>
                  &nbsp;&nbsp;{dataStatistikPeserta.self_assessment_missing.count} Dokumen
                </Col>
              </Row>
            </div>
            <Table responsive>
              <thead>
                <tr>
                  <th>Hasil Penilaian</th>
                  {komponenPenilaianSelfAssessment.map((data, index) => (
                    <th key={data.aspect_id}>{data.aspect_name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selfAssessmentPeserta.map((data, index) => {
                  return (
                    <tr key={data.self_assessment_id}>
                    <td>
                      {data.start_date}
                    </td>
                    {data.grade.map((grades,index)=>{
                      return (
                      <td key={grades.grade_id}>
                          <Tooltip title={grades.description} color="gold">
                        {grades.grade}
                      </Tooltip>
                      </td>
                      )
                    })}
                  </tr>
                  )
                })}

                <tr>
                  <td> BEST PERFORMANCE</td>
                  {bestPerformance.map((data) => (
                    <>
                      <td style={{ width: 10 }}>
                        {' '}
                        <Tooltip title={data.description} color="gold" key={data}>
                          {data.grade}
                        </Tooltip>
                      </td>
                    </>
                  ))}
                </tr>
                <tr>
                  <td> RATA RATA PER POIN</td>
                  {averagePerPoin.map((data) => (
                    <>
                      <td style={{ width: 10 }}>
                        {' '}
                        <Tooltip color="gold" key={data}>
                          {data.grade}
                        </Tooltip>
                      </td>
                    </>
                  ))}
                </tr>
                <tr>
                  <td>TOTAL NILAI PER POIN</td>
                  {finalGradePerPoin.map((data) => (
                    <>
                      <td style={{ width: 10 }}>
                        {' '}
                        <Tooltip color="gold" key={data}>
                          {data.grade}
                        </Tooltip>
                      </td>
                    </>
                  ))}
                </tr>
              </tbody>
            </Table>
            <div className="spacetop"></div>
            <b>HASIL AKHIR PENILAIAN : {hasilAkhirPenilaian}</b>
          </div>
        </>
      )}

      {!isNotNullDataSelfAssessment && (
        <div className="container2">
          <Result
            title="Peserta Belum Memiliki Self Assessment"
            icon={<FileExclamationOutlined />}
            subTitle="Belum ada rekap nilai apapun"
          />
        </div>
      )}
      <FloatButton
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          history.push(`/rekapPenilaianPeserta`)
        }}
        tooltip={<div>Kembali ke Rekap Penilaian Peserta</div>}
      />
    </>
  )
}

export default RekapSelfAssessment
