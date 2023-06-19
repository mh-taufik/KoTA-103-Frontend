import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { ArrowLeftOutlined } from '@ant-design/icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../pengisianDokumen/rpp/rpp.css'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import {
  Card,
  FloatButton,
  Input,
  Popover,
  Progress,
  Space,
  message,
  notification,
  spin,
} from 'antd'
import { InputNumber } from 'antd'

const FormPenilaianPembimbingJurusan = (props) => {
  const params = useParams()
  const NIM_PESERTA = params.nim
  const ID_LAPORAN = params.id
  const [dataPeserta, setDataPeserta] = useState([])
  const ROLE_PENGGUNA = localStorage.id_role
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([])
  const [poinPenilaianForm, setPoinPenilaianForm] = useState([])
  const [idPenilaianPembimbing, setIdPenilaianPembimbing] = useState()
  const [nilaiPembimbingJurusan, setNilaiPembimbingJurusan] = useState([])
  const [nilaiTotal, setNilaiTotal] = useState([])
  const [fasePenilaian, setFasePenilaian] = useState()
  const [idSupervisorGrade, setIdSupervisorGrade] = useState()
  const [nilaiCounter, setNilaiCounter] = useState([{ nilai: 0 }, { nilai: 0 }, { nilai: 0 }])
  const [nilaiCounterEdit, setNilaiCounterEdit] = useState([
    { nilai: 0 },
    { nilai: 0 },
    { nilai: 0 },
  ])
  const [penilaianIsDone, setPenilaianIsDone] = useState()
  const [dataPenilaianSebelumnya, setdataPenilaianSebelumnya] = useState([])
  const [idPenilaianPembimbingSebelumnya, setIdPenilaianPembimbingSebelumnya] = useState()
  const [nilaiPembimbingJurusanEdit, setNilaiPembimbingJurusanEdit] = useState([])
  const [dataLaporanPeserta, setDataLaporanPeserta] = useState([])
  const [statistikLogbookSubmitted, setStatistikLogbookSubmitted] = useState([{}])
  const [statistikLogbookMissing, setStatistikLogbookMissing] = useState([])
  const [statistikLogbookOnTime, setStatistikLogbookOnTime] = useState([])
  const [statistikLogbookLate, setStatistikLogbookLate] = useState([])
  const [statistikLogbookMatch, setStatistikLogbookMatch] = useState([])
  const [statistikLogbookNotMatch, setStatistikLogbookNotMatch] = useState([])
  const [statistikLogbookNilaiSangatBaik, setStatistikLogbookNilaiSangatBaik] = useState([])
  const [statistikLogbookNilaiBaik, setStatistikLogbookNilaiBaik] = useState([])
  const [statistikLogbookNilaiCukup, setStatistikLogbookNilaiCukup] = useState([])
  const [statistikLogbookNilaiKurang, setStatistikLogbookNilaiKurang] = useState([])
  const [statistikSelfAssessmentSubmitted, setStatistikSelfAssessmentSubmitted] = useState([])
  const [statistikSelfAssessmentMissing, setStatistikSelfAssessmentMissing] = useState([])
  const [statistikApresiasiPerusahaan, setStatistikApresiasiPerusahaan] = useState([])




  axios.defaults.withCredentials = true
  let history = useHistory()

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }



  /**HANDLE EDIT NILAI */
  const handleEditChange = (id_grade, nilai, index, keyData) => {
    if (nilaiPembimbingJurusanEdit[index]) {
      nilaiPembimbingJurusanEdit[index][keyData] = nilai
    } else {
      nilaiPembimbingJurusanEdit[index] = {
        [keyData]: nilai,
        grade_id: id_grade,
      
      }
    }
    setNilaiPembimbingJurusanEdit(nilaiPembimbingJurusanEdit)

    var data = [...nilaiCounterEdit]
    data[index] = nilai
    setNilaiCounterEdit(data)
    console.log('datas', data)
  }
  useEffect(() => {
    // console.log('HASIL NILAI', nilaiCounter)
    var temp1 = function (obj) {
      for (var i in obj) {
        setNilaiTotal({
          nilaipoinsatu: obj[0].nilai,
          nilaipoindua: obj[1].nilai,
          nilaipointiga: obj[2].nilai,
        })
      }
    }
    temp1(nilaiCounter)
  }, [nilaiCounter])



  const isNilaiKosong = (nilai) => {
    return nilai ? nilai : 0
  }



  const totalEdit = () => {
    return (
      parseInt(isNilaiKosong(nilaiCounterEdit[0])) +
      parseInt(isNilaiKosong(nilaiCounterEdit[1])) +
      parseInt(isNilaiKosong(nilaiCounterEdit[2]))
    )
  }

  useEffect(() => {
    console.log('isihita', nilaiTotal)
  }, [nilaiTotal])

  const countTotalNilai = () => {
    return parseInt
  }


  useEffect(() => {
    const getDataPoinPenilaianFormPembimbingJurusan = async (index) => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/aspect/get`)
        .then((response) => {
          var temp = []
          var temp1 = response.data.data
          var getTempDataPoinPenilaian = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                poin: obj[i].name,
                deskripsi: obj[i].description,
                bobot: obj[i].max_grade,
              })
            }
          }
          getTempDataPoinPenilaian(temp1)
          setPoinPenilaianForm(temp)
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



    const GetDataInfoPeserta = async (index) => {
  
      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-by-id`, {
          id: [NIM_PESERTA],
        })
        .then((result) => {
          setDataPeserta(result.data.data[0])
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
            history.push('/500')
          }
        })
    }

    const GetDataStatistik = async (index) => {
  
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/statistic/${NIM_PESERTA}`)
        .then((result) => {
          console.log('STATISTIK',result.data.data.logbook_late)
          setStatistikLogbookSubmitted(JSON.parse(JSON.stringify(result.data.data.logbook_submitted)))
          setStatistikLogbookMissing(JSON.parse(JSON.stringify(result.data.data.logbook_missing)))
          setStatistikLogbookOnTime(JSON.parse(JSON.stringify(result.data.data.logbook_on_time)))
          setStatistikLogbookLate(JSON.parse(JSON.stringify(result.data.data.logbook_late)))
          setStatistikLogbookMatch(JSON.parse(JSON.stringify(result.data.data.logbook_match)))
          setStatistikLogbookNotMatch(JSON.parse(JSON.stringify(result.data.data.logbook_not_match)))
          setStatistikLogbookNilaiSangatBaik(JSON.parse(JSON.stringify(result.data.data.logbook_nilai_sangat_baik)))
          setStatistikLogbookNilaiBaik(JSON.parse(JSON.stringify(result.data.data.logbook_nilai_baik)))
          setStatistikLogbookNilaiCukup(JSON.parse(JSON.stringify(result.data.data.logbook_nilai_cukup)))
          setStatistikLogbookNilaiKurang(JSON.parse(JSON.stringify(result.data.data.logbook_nilai_kurang)))
          setStatistikSelfAssessmentSubmitted(JSON.parse(JSON.stringify(result.data.data.self_assessment_submitted)))
          setStatistikSelfAssessmentMissing(JSON.parse(JSON.stringify(result.data.data.self_assessment_missing)))
          setStatistikApresiasiPerusahaan(JSON.parse(JSON.stringify(result.data.data.self_assessment_apresiasi_perusahaan)))
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
            history.push('/500')
          }
        })
    }

    const GatDataPenilaianPeserta = async() =>{
      await axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get/${ID_LAPORAN}`, {
       
      })
      .then((response) => {
        setFasePenilaian(response.data.data.phase)
        setIdSupervisorGrade(response.data.data.supervisor_grade)
       let idSupervisorGrade = response.data.data.supervisor_grade
       axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/aspect/get`).then((result)=>{
        
 
        const data_poin_penilaian = result.data.data
        let max_grade_1 = data_poin_penilaian[0].max_grade
        let max_grade_2 = data_poin_penilaian[1].max_grade
        let max_grade_3 = data_poin_penilaian[2].max_grade
        let name_1 = data_poin_penilaian[0].name
        let name_2 = data_poin_penilaian[1].name
        let name_3 = data_poin_penilaian[2].name
        let id_1 = data_poin_penilaian[0].id
        let id_2 = data_poin_penilaian[1].id
        let id_3 = data_poin_penilaian[2].id

        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/get/${idSupervisorGrade}`)
        .then((res)=>{
          let dataSupervisorGrade = res.data.data.grade_list
          let dataSupervisorGradeWithNamePoinAspect = []
          let getConcateGradeWithNamePoinAspect = function(data){
            dataSupervisorGradeWithNamePoinAspect.push(
              {
                grade_id : data[0].grade_id,
                poinpenilaian : name_1,
                bobot : max_grade_1,
                deskripsi : data[0].aspect,
                nilai : data[0].grade,
                aspect_id : id_1
              },
              {
                grade_id : data[1].grade_id,
                poinpenilaian : name_2,
                bobot : max_grade_2,
                deskripsi : data[1].aspect,
                nilai : data[1].grade,
                aspect_id : id_2
              },
              {
                grade_id : data[2].grade_id,
                poinpenilaian : name_3,
                bobot : max_grade_3,
                deskripsi : data[2].aspect,
                nilai : data[2].grade,
                aspect_id : id_3
              },

              )
          }

          getConcateGradeWithNamePoinAspect(dataSupervisorGrade)
          let temp_counter = []
          temp_counter[0] = dataSupervisorGradeWithNamePoinAspect[0].nilai
          temp_counter[1] = dataSupervisorGradeWithNamePoinAspect[1].nilai
          temp_counter[2] = dataSupervisorGradeWithNamePoinAspect[2].nilai
          setNilaiCounterEdit(temp_counter)

          let nilai_pembimbing = ([{
            grade :dataSupervisorGradeWithNamePoinAspect[0].nilai,
            grade_id : dataSupervisorGradeWithNamePoinAspect[0].grade_id
          },{
            grade :dataSupervisorGradeWithNamePoinAspect[1].nilai,
            grade_id : dataSupervisorGradeWithNamePoinAspect[1].grade_id
          },{
            grade :dataSupervisorGradeWithNamePoinAspect[2].nilai,
            grade_id : dataSupervisorGradeWithNamePoinAspect[2].grade_id
          }]
          
          )
          setNilaiPembimbingJurusanEdit(nilai_pembimbing)

          setdataPenilaianSebelumnya(dataSupervisorGradeWithNamePoinAspect)
          console.log('CONSATE',dataSupervisorGradeWithNamePoinAspect )
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



    GetDataInfoPeserta()
    GatDataPenilaianPeserta()
    GetDataStatistik()
    getDataPoinPenilaianFormPembimbingJurusan()

  }, [history])


  /** SIMPAN EDIT PENILAIAN */
  const putEditPenilaian = async () => {
    await axios
    .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/update`,{
        "grade_list": nilaiPembimbingJurusanEdit,
        "id": idSupervisorGrade,
        "phase": fasePenilaian
      
      }
    )
    .then((req,res) => {
    console.log(res)
    console.log(req)
    
    notification.success({message:'Penilaian Berhasil Dilakukan!!!'})
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




  const buttonKembaliKeListHandling = () => {
    history.push(`/rekapDokumenPeserta/laporan/${NIM_PESERTA}`)
  }
  return (
    <>
      <div>
       
          <Space
            className="spacebottom"
            direction="vertical"
            size="small"
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
          <Row gutter={16}>
            <Col span={10}>
              <Card title="INFORMASI LOGBOOK PESERTA" bordered={true}>
                <Row>
                  <Col span={4}>
                    <b>1. &nbsp;&nbsp; Kedisiplinan</b>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tepat Waktu
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookOnTime.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookOnTime.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Terlambat
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikLogbookLate.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookLate.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Mengumpulkan
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikLogbookMissing.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookMissing.count} (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={4}>
                    <b>2. &nbsp;&nbsp; Penilaian</b>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Sangat Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiSangatBaik.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiSangatBaik.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiBaik.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiBaik.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Cukup
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiCukup.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiCukup.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Kurang Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiKurang.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiKurang.count} (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={4}>
                    <b>3. &nbsp;&nbsp; Total Kesesuaian Dengan RPP  </b>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Sesuai Perencanaan
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookMatch.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookMatch.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Sesuai Perencanaan
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNotMatch.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNotMatch.count} (dokumen)</Col>
                </Row>
              </Card>
            </Col>
            <Col span={10}>
              <Card title="INFORMASI SELF ASSESSMENT PESERTA" bordered={true}>
                <Row>
                  <Col span={4}>
                    <b>1. &nbsp;&nbsp; Kedisiplinan</b>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Mengumpulkan
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikSelfAssessmentSubmitted.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikSelfAssessmentSubmitted.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Mengumpulkan
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikSelfAssessmentMissing.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikSelfAssessmentMissing.count} (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                   <b>Apresiasi Perusahaan</b>
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikApresiasiPerusahaan.percent}   status="active" />
                  </Col>
                  <Col span={14}>{statistikApresiasiPerusahaan.count} (dokumen)</Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <div className="spacebottom" />

      {ROLE_PENGGUNA === '4' && (
        <>
        
          <div className=" container">
            <FloatButton
              type="primary"
              onClick={buttonKembaliKeListHandling}
              icon={<ArrowLeftOutlined />}
              tooltip={<div>Kembali ke Rekap Laporan Peserta</div>}
            />
            <h3 align="center" className="title-s">
              FORM PENILAIAN PEMBIMBING JURUSAN
            </h3>

            <hr />
            <Row style={{ paddingBottom: 5, paddingTop: 4 }}>
              <Col style={{ textAlign: 'center' }} span={2}>
                NO
              </Col>
              <Col style={{ textAlign: 'center' }} span={14}>
                KOMPONEN PENILAIAN
              </Col>
              <Col style={{ textAlign: 'center' }} span={4}>
                NILAI MAKSIMUM
              </Col>
              <Col style={{ textAlign: 'center' }} span={4}>
                NILAI
              </Col>
            </Row>
            <hr />
              <Form>
                {dataPenilaianSebelumnya.map((data, index) => {
                  return (
                    <>
                      <Row key={data.id} style={{ paddingBottom: 20, paddingTop: 20 }}>
                        <Col style={{ textAlign: 'center' }} span={2}>
                          {index + 1}
                        </Col>
                        <Col span={14}>
                          <div>
                            <b>{data.poinpenilaian}</b>
                          </div>
                          <div>{data.deskripsi}</div>
                        </Col>
                        <Col style={{ textAlign: 'center' }} span={4}>
                          {data.bobot}
                        </Col>
                        <Col style={{ textAlign: 'center' }} span={4}>
                          <InputNumber
                            placeholder="Nilai"
                            size={'large'}
                            defaultValue={data.nilai}
                            maxLength={2}
                            onChange={(nilai) => {
                              handleEditChange(data.grade_id, nilai, index, 'grade')
                              console.log('gradeid', data.grade_id)
                            }}
                            max={data.bobot}
                            keyboard={true}
                            minLength={1}
                            required
                          />
                        </Col>
                      </Row>
                      <hr />
                    </>
                  )
                })}
                <Row>
                  <Col span={16} style={{ fontSize: 20 }}>
                    <b>TOTAL</b>
                  </Col>
                  <Col span={8}>
                    <b>{totalEdit()}</b>
                  </Col>
                </Row>

                <Button
                  onClick={putEditPenilaian}
                  className="form-control btn btn-primary"
                  htmlType="submit"
                >
                  Simpan Penilaian
                </Button>
              </Form>
          
          </div>
        </>
      )}
       {ROLE_PENGGUNA !== '4' && (
        <>
        
          <div className=" container">
            <FloatButton
              type="primary"
              onClick={buttonKembaliKeListHandling}
              icon={<ArrowLeftOutlined />}
              tooltip={<div>Kembali ke Rekap Laporan Peserta</div>}
            />
            <h3 align="center" className="title-s">
              FORM PENILAIAN PEMBIMBING JURUSAN
            </h3>

            <hr />
            <Row style={{ paddingBottom: 5, paddingTop: 4 }}>
              <Col style={{ textAlign: 'center' }} span={2}>
                NO
              </Col>
              <Col style={{ textAlign: 'center' }} span={14}>
                KOMPONEN PENILAIAN
              </Col>
              <Col style={{ textAlign: 'center' }} span={4}>
                NILAI MAKSIMUM
              </Col>
              <Col style={{ textAlign: 'center' }} span={4}>
                NILAI
              </Col>
            </Row>
            <hr />
              <Form>
                {dataPenilaianSebelumnya.map((data, index) => {
                  return (
                    <>
                      <Row key={data.id} style={{ paddingBottom: 20, paddingTop: 20 }}>
                        <Col style={{ textAlign: 'center' }} span={2}>
                          {index + 1}
                        </Col>
                        <Col span={14}>
                          <div>
                            <b>{data.poinpenilaian}</b>
                          </div>
                          <div>{data.deskripsi}</div>
                        </Col>
                        <Col style={{ textAlign: 'center' }} span={4}>
                          {data.bobot}
                        </Col>
                        <Col style={{ textAlign: 'center' }} span={4}>
                          <InputNumber
                            placeholder="Nilai"
                            size={'large'}
                            defaultValue={data.nilai}
                            disabled
                            maxLength={2}
                            onChange={(nilai) => {
                              handleEditChange(data.grade_id, nilai, index, 'grade')
                              console.log('gradeid', data.grade_id)
                            }}
                            max={data.bobot}
                            keyboard={true}
                            minLength={1}
                            required
                          />
                        </Col>
                      </Row>
                      <hr />
                    </>
                  )
                })}
                <Row>
                  <Col span={16} style={{ fontSize: 20 }}>
                    <b>TOTAL</b>
                  </Col>
                  <Col span={8}>
                    <b>{totalEdit()}</b>
                  </Col>
                </Row>

              </Form>
          
          </div>
        </>
      )}

      
    </>
  )
}

export default FormPenilaianPembimbingJurusan
