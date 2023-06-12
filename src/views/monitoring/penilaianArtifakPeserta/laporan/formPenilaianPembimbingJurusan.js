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



  const [isSuccessEdit, setIsSuccessEdit] = useState()

  axios.defaults.withCredentials = true
  let history = useHistory()

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  /** HANDLE INPUT */
  const handleInputNilai = (aspectId, grade_sa, index, keyData) => {
    if (nilaiPembimbingJurusan[index]) {
      nilaiPembimbingJurusan[index][keyData] = grade_sa
    } else {
      nilaiPembimbingJurusan[index] = {
        aspect_id : aspectId,
        [keyData]: grade_sa,
      }
    }

    setNilaiPembimbingJurusan(nilaiPembimbingJurusan)

    var data = [...nilaiCounter]
    data[index] = {
      nilai: grade_sa,
    }
    setNilaiCounter(data)
  }

  /**HANDLE EDIT NILAI */
  const handleEditChange = (idpoin, nilai, index, keyData) => {
    if (nilaiPembimbingJurusanEdit[index]) {
      nilaiPembimbingJurusanEdit[index][keyData] = nilai
    } else {
      nilaiPembimbingJurusanEdit[index] = {
        id: idpoin,
        [keyData]: nilai,
      }
    }
    setNilaiPembimbingJurusanEdit(nilaiPembimbingJurusanEdit)

    var data = [...nilaiCounterEdit]
    data[index] = nilai
    setNilaiCounterEdit(data)
  }
  useEffect(() => {
    console.log('HASIL NILAI', nilaiCounter)
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

  // const tes = () => {
  //   console.log(nilaiPembimbingJurusan)
  // }

  const isNilaiKosong = (nilai) => {
    return nilai ? nilai : 0
  }

  const total = () => {
    return (
      parseInt(isNilaiKosong(nilaiTotal.nilaipoinsatu)) +
      parseInt(isNilaiKosong(nilaiTotal.nilaipoindua)) +
      parseInt(isNilaiKosong(nilaiTotal.nilaipointiga))
    )
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

    const getPenilaianPembimbingLaporanIsAvailable = async () => {
      await axios
        .get(
          `http://localhost:1337/api/penilaianpembimbings?populate=*&filters[laporan][id][$eq]=${ID_LAPORAN}`,
        )
        .then((res) => {
          console.log('HASIL', res.data.data[0])
          let temp = res.data.data
          if (temp.length > 0) {
            setPenilaianIsDone(true)
            setIdPenilaianPembimbingSebelumnya(res.data.data[0].id)
          } else if (temp.length < 1) {
            setPenilaianIsDone(false)
          }

          // console.log('MOALBOROS',res.data.data[0])
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

    const GetDataLaporanPeserta = async() =>{
      await axios
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get/${ID_LAPORAN}`, {
       
      })
      .then((response) => {
        setDataLaporanPeserta(response.data.data)
        console.log('data laporan', response.data.data)
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



    GetDataInfoPeserta()
    GetDataLaporanPeserta()
    GetDataStatistik()
    getDataPoinPenilaianFormPembimbingJurusan()
    getPenilaianPembimbingLaporanIsAvailable()
    if (penilaianIsDone) {
    }
    console.log(poinPenilaianForm)
  }, [history])

  useEffect(() => {
    const getDetailPenilaianSebelumnya = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/${ID_LAPORAN}`,
        )
        .then((res) => {
          console.log('DETAIL PENILAIAN', res.data.data)
          // let temp = res.data.data
          // let temp1 = []
          // let temps = []
          // let getTemp = function (obj) {
          //   let idx = 0
          //   for (var i in obj) {
          //     temps[idx] = obj[i].attributes.nilai
          //     temp1.push({
          //       nilai: obj[i].attributes.nilai,
          //       id: obj[i].id,
          //       idpoin: obj[i].attributes.pembobotanformpembimbing.data.id,
          //       poinpenilaian: obj[i].attributes.pembobotanformpembimbing.data.attributes.poin,
          //       deskripsi: obj[i].attributes.pembobotanformpembimbing.data.attributes.deskripsi,
          //       bobot: obj[i].attributes.pembobotanformpembimbing.data.attributes.bobot,
          //     })
          //     idx++
          //   }
          //   setNilaiCounterEdit(temps)
          // }
          // getTemp(temp)
          // console.log('IYA', temp1)
          // setdataPenilaianSebelumnya(temp1)
        })
    }
    getDetailPenilaianSebelumnya()
  }, [idPenilaianPembimbingSebelumnya])

  /** SIMPAN EDIT PENILAIAN */
  const putEditPenilaian = async () => {
    //  console.log(idPenilaianPembimbingSebelumnya)
    let datas = nilaiPembimbingJurusanEdit
    let iterator = 1
    let len_data = nilaiPembimbingJurusanEdit.length
    for (var i in datas) {
      let nilais = datas[i].nilai
      await axios
        .get(
          `http://localhost:1337/api/detailpenilaianpembimbings?populate=*&filters[penilaianpembimbing][id][$eq]=${idPenilaianPembimbingSebelumnya}&filters[pembobotanformpembimbing][id][$eq]=${datas[i].id}`,
        )
        .then((res) => {
          console.log('RES', res.data.data[0].id)
          console.log('nilasi', nilais)
          axios.put(`http://localhost:1337/api/detailpenilaianpembimbings/${res.data.data[0].id}`, {
            data: {
              nilai: nilais,
            },
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
      iterator++

      // console.log('===========', parseInt(iterator) === parseInt(len_data)) 
      if (parseInt(iterator) === parseInt(len_data)) {
        notification.success({
          message: 'Perubahan nilai berhasil disimpan',
        })
      }
  
    }
    refreshGetDataPenilaian()
  }

  const refreshGetDataPenilaian = async (index) => {
    await axios
      .get(
        `http://localhost:1337/api/detailpenilaianpembimbings?populate=*&filters[penilaianpembimbing][id][$eq]=${idPenilaianPembimbingSebelumnya}`,
      )
      .then((res) => {
        console.log('DETAIL PENILAIAN', res.data.data)
        let temp = res.data.data
        let temp1 = []
        let temps = []
        let getTemp = function (obj) {
          let idx = 0
          for (var i in obj) {
            temps[idx] = obj[i].attributes.nilai
            temp1.push({
              nilai: obj[i].attributes.nilai,
              id: obj[i].id,
              idpoin: obj[i].attributes.pembobotanformpembimbing.data.id,
              poinpenilaian: obj[i].attributes.pembobotanformpembimbing.data.attributes.poin,
              deskripsi: obj[i].attributes.pembobotanformpembimbing.data.attributes.deskripsi,
              bobot: obj[i].attributes.pembobotanformpembimbing.data.attributes.bobot,
            })
            idx++
          }
          setNilaiCounterEdit(temps)
        }
        getTemp(temp)
        console.log('IYA', temp1)
        setdataPenilaianSebelumnya(temp1)

        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings]
          newLoadings[index] = false
          return newLoadings
        })
      })
  }

  /** POST DATA PENILAIAN */
  const postPenilaian = async (data) => {
    console.log('ID LAPORAN', ID_LAPORAN)
    if (nilaiPembimbingJurusan.length > 2) {
    

      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/create`, {
        
            grade_list:nilaiPembimbingJurusan,
            participant_id : parseInt(NIM_PESERTA),
            phase:dataLaporanPeserta.phase
        })
        .then((res) => {
          console.log(res)
          console.log(res.data.data)
          setIdPenilaianPembimbing(res.data.data.id)
          postDataNilaiPembimbing(nilaiPembimbingJurusan, res.data.data.id)
        })
        // .catch(function (error) {
        //   if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
        //     history.push({
        //       pathname: '/login',
        //       state: {
        //         session: true,
        //       },
        //     })
        //   } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
        //     history.push('/404')
        //   } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
        //     history.push('/500')
        //   }
        // })
    } else {
      notification.warning({
        message: 'pastikan semua nilai setiap poin sudah terisi !!!',
      })
    }
  }

  useEffect(() => {
    console.log('ID PENILAIAN', idPenilaianPembimbing)
  }, idPenilaianPembimbing)

  const postDataNilaiPembimbing = async (dataNilai, idPenilaian) => {
    let isSuccess = false
    if (dataNilai.length > 2) {
      for (var i in dataNilai) {
        console.log('NILAI', dataNilai[i].nilai)
        console.log('ID', dataNilai[i].id)
        let nilai = dataNilai[i].nilai
        let idPembobotan = dataNilai[i].id
        console.log('id penilaian', idPenilaian)
        await axios
          .post(`http://localhost:1337/api/detailpenilaianpembimbings`, {
            data: {
              nilai: nilai,
              pembobotanformpembimbing: {
                connect: [idPembobotan],
              },
              penilaianpembimbing: {
                connect: [idPenilaian],
              },
            },
          })
          .then((res) => {
            console.log('berhasil', res)
            isSuccess = true
          })
      }

      if (isSuccess) {
        notification.success({
          message: 'Data Penilaian Berhasil Disimpan',
        })
      } else {
        notification.error({
          message: 'Data Penilaian Gagal Disimpan',
        })
      }
      history.push(`/rekapDokumenPeserta/laporan/${NIM_PESERTA}`)
    } else {
      notification.warning({
        message: 'Setiap nilai pada poin penilaian harus diisi !!!',
      })
    }
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
                    <Progress percent={statistikLogbookOnTime.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookOnTime.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Terlambat
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikLogbookLate.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookLate.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Mengumpulkan
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikLogbookMissing.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookMissing.count} (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={4}>
                    <b>2. &nbsp;&nbsp; Penilaian Pembimbing Jurusan</b>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Sangat Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiSangatBaik.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiSangatBaik.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiBaik.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiBaik.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Cukup
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiCukup.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiCukup.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Kurang Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikLogbookNilaiKurang.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikLogbookNilaiKurang.count} (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={4}>
                    <b>3. &nbsp;&nbsp; Total Kesesuaian Dengan RPP : </b>
                  </Col>
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
                    Mnegumpulkan
                  </Col>
                  <Col span={2}>
                    <Progress percent={statistikSelfAssessmentSubmitted.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikSelfAssessmentSubmitted.count} (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Mengumpulkan
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={statistikSelfAssessmentMissing.percent} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>{statistikSelfAssessmentMissing.count} (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={4}>
                    <b>2. &nbsp;&nbsp; Penilaian Pembimbing Jurusan</b>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Sangat Baik (85-100)
                  </Col>
                  <Col span={2}>
                    <Progress percent={80} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Baik (75-84)
                  </Col>
                  <Col span={2}>
                    <Progress percent={10} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Cukup (65-83)
                  </Col>
                  <Col span={2}>
                    <Progress percent={5} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Kurang Baik (0-64)
                  </Col>
                  <Col span={2}>
                    <Progress percent={5} format={(percent) => `${percent}`}  status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <hr />
                <Row>
                  <Col span={4}>
                    <b>3. &nbsp;&nbsp; Perolehan Aspirasi Dari Perusahaan : </b>
                  </Col>
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
            {!penilaianIsDone && (
              <Form>
                {poinPenilaianForm.map((data, index) => {
                  return (
                    <>
                      <Row key={data.id} style={{ paddingBottom: 20, paddingTop: 20 }}>
                        <Col style={{ textAlign: 'center' }} span={2}>
                          {index + 1}
                        </Col>
                        <Col span={14}>
                          <div>
                            <b>{data.poin}</b>
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
                            // defaultValue={3}
                            maxLength={2}
                            // ref={nilaiTotal}
                            value={nilaiPembimbingJurusan.nilai}
                            onChange={(value) => {
                              // if (value) {
                              handleInputNilai(data.id, value, index, 'grade')
                              // } else {
                              //   notification.error({
                              //     message: 'Harap isi semua nilai',
                              //   })
                              // }
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
                    <b>{total()}</b>
                  </Col>
                </Row>

                <Button
                  onClick={postPenilaian}
                  className="form-control btn btn-primary"
                  htmlType="submit"
                >
                  Simpan Penilaian
                </Button>
              </Form>
            )}

            {penilaianIsDone && (
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
                          {console.log('PENIALIAN', dataPenilaianSebelumnya[index])}
                          <InputNumber
                            placeholder="Nilai"
                            size={'large'}
                            defaultValue={data.nilai}
                            maxLength={2}
                            onChange={(e) => {
                              handleEditChange(data.idpoin, e, index, 'nilai')
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
            )}
          </div>
        </>
      )}

      
    </>
  )
}

export default FormPenilaianPembimbingJurusan
