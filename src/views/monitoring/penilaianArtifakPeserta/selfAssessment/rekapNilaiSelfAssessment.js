import React, { useState, useEffect, useMemo } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined,FileExclamationOutlined  } from '@ant-design/icons'
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
  let history = useHistory()
  axios.defaults.withCredentials = true
  const [bestPerformance, setBestPerformance] = useState()
  const [hasilAkhirPenilaian, setHasilAkhirPenilaian]  = useState()
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

  const handlePopoverClose = () => {
    setAnchorEl(null)
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
                console.log('temssp',average_data)

                let tempfinalGrade = []
                let len_grade = final_grade.length
                let total_final_grade =0
                let getFinalGrade = function(data) {
                  for(var i in data){
                    tempfinalGrade.push({
                      grade : data[i].grade
                    })
                    total_final_grade = total_final_grade+data[i].grade
                    console.log(data[i].grade, typeof(data[i].grade))
                   
                  }
                }
                getFinalGrade(final_grade)
                setHasilAkhirPenilaian(Math.round(total_final_grade/len_grade))
                setFinalGradePerPoin(tempfinalGrade)
                setIsLoading(false)
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
        return () => contoller_abort.abort()
      }

      getSelfAssessmentAspect()

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
              setSelfAssessmentPeserta(temp)
            } else {
              setIsNotNullDataSelfAssessment(false)
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
              setIsNotNullDataSelfAssessment(false)
              setIsLoading(false)
            }
          })
      }

      // GetFinalGrade()
      getDataInformasiPeserta()

      getSelfAssessmentPeserta()
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

  const getRowGradeaDesc = (data) => {
    return data.map((nilaipoin, index) => (
      <td key={nilaipoin.grade_id}>
        <Tooltip title={nilaipoin.description}>{nilaipoin.grade}</Tooltip>
      </td>
    ))
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
      {isNotNullDataSelfAssessment && (
        <>
         

          {title('REKAP PENILAIAN SELF ASSESSMENT PESERTA')}

          <div className="container2">
          <Box sx={{ color: 'warning.main' }} className="spacebottom">
          <ul>
            {/* <li>Pastikan semua RPP terisi</li> */}
            <li>Nilai terdiri dari : nilai performansi terbaik diperoleh dari nilai tertinggi setiap poin self assesment  dari keseluruhan self assessment</li>
            <li>Rata rata : diperoleh dari hasil rata-rata tiap poin untuk seluruh self assessment</li>
            <li>Hasil akhir : 60% dari performansi terbaik dan 40% dari nilai rata-rata</li>
            <li>Arahkan kursor ke nilai performansi terbaik, untuk melihat keterangan dari performansi terbaik</li>
          </ul>
        </Box>
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
            <div className='spacetop'></div>
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
