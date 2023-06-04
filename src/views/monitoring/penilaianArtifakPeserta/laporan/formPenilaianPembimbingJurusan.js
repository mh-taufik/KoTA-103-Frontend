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
  const ROLE_PENGGUNA = localStorage.id_role
  const [idPeserta, setIdPeserta] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
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
  const handleInputNilai = (ids, nilaiS, index, keyData) => {
    if (nilaiPembimbingJurusan[index]) {
      nilaiPembimbingJurusan[index][keyData] = nilaiS
    } else {
      nilaiPembimbingJurusan[index] = {
        id: ids,
        [keyData]: nilaiS,
      }
    }

    setNilaiPembimbingJurusan(nilaiPembimbingJurusan)

    var data = [...nilaiCounter]
    data[index] = {
      nilai: nilaiS,
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

  /** API */
  const getIdPeserta = async (data, index) => {
    enterLoading(index)
    await axios
      .get(`http://localhost:1337/api/pesertas?filters[username][$eq]=${NIM_PESERTA}`)
      .then((response) => {
        console.log(response)
        console.log('id Peserta', response.data.data[0].id)
        setIdPeserta(response.data.data[0].id)
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

  useEffect(() => {
    const getDataPoinPenilaianFormPembimbingJurusan = async (index) => {
      await axios
        .get('http://localhost:1337/api/pembobotanformpembimbings')
        .then((response) => {
          var temp = []
          var temp1 = response.data.data
          var getTempDataPoinPenilaian = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                poin: obj[i].attributes.poin,
                deskripsi: obj[i].attributes.deskripsi,
                bobot: obj[i].attributes.bobot,
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
      function formatDate(date) {
        var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-')
      }

      await axios
        .post(`http://localhost:1337/api/penilaianpembimbings`, {
          data: {
            tanggal_penilaian: formatDate(new Date().toDateString()),
            laporan: {
              connect: [ID_LAPORAN],
            },
          },
        })
        .then((res) => {
          console.log(res)
          console.log(res.data.data)
          setIdPenilaianPembimbing(res.data.data.id)
          postDataNilaiPembimbing(nilaiPembimbingJurusan, res.data.data.id)
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
       <Space
            className="spacebottom"
            direction="vertical"
            size="middle"
            style={{
              display: 'flex',
            }}
          >
            <Card title="INFORMASI PESERTA" size="small" style={{ padding: 30 }}>
              <Row>
                <Col span={4}>Nama</Col>
                <Col span={4}>Gina Anifah Choirunnisa</Col>
                <Col span={16}>&nbsp;</Col>
                <Col span={16}>&nbsp;</Col>
              </Row>
              <Row style={{ marginTop: 20 }}>
                <Col span={4}>NIM</Col>
                <Col span={4}>181524003</Col>
                <Col span={16}>&nbsp;</Col>
                <Col span={16}>&nbsp;</Col>
              </Row>
            </Card>
          </Space>
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
                    <Progress percent={50} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Terlambat
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={20} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Mengumpulkan
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={10} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
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
                    <Progress percent={70} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={10} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Cukup
                  </Col>
                  <Col span={2}>
                    <Progress percent={10} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Kurang Baik
                  </Col>
                  <Col span={2}>
                    <Progress percent={10} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
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
                    Tepat Waktu
                  </Col>
                  <Col span={2}>
                    <Progress percent={50} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Tidak Mengumpulkan
                  </Col>
                  <Col span={2}>
                    {' '}
                    <Progress percent={10} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
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
                    <Progress percent={80} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Baik (75-84)
                  </Col>
                  <Col span={2}>
                    <Progress percent={10} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Cukup (65-83)
                  </Col>
                  <Col span={2}>
                    <Progress percent={5} status="active" />
                  </Col>
                  <Col span={14}>18 (dokumen)</Col>
                </Row>
                <Row>
                  <Col span={6} style={{ marginLeft: 35 }}>
                    Kurang Baik (0-64)
                  </Col>
                  <Col span={2}>
                    <Progress percent={5} status="active" />
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
                              handleInputNilai(data.id, value, index, 'nilai')
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

      {ROLE_PENGGUNA !== '4' && (
        <>
          {/* <button onClick={() => console.log(nilaiPembimbingJurusanEdit)}>tes</button> */}
       
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
                          {nilaiPembimbingJurusan.nilai}
                          {/* <InputNumber
                            placeholder="Nilai"
                            size={'large'}
                            maxLength={2}
                            value={nilaiPembimbingJurusan.nilai}
                            onChange={(value) => {
                              handleInputNilai(data.id, value, index, 'nilai')
                            }}
                            max={data.bobot}
                            disabled
                            keyboard={true}
                            minLength={1}
                            required
                          /> */}
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
                          <b>{data.nilai}</b>
                          {/* <InputNumber
                            placeholder="Nilai"
                            size={'large'}
                            defaultValue={data.nilai}
                            maxLength={2}
                            disabled
                            onChange={(e) => {
                              handleEditChange(data.idpoin, e, index, 'nilai')
                            }}
                            max={data.bobot}
                            keyboard={true}
                            minLength={1}
                            required
                          /> */}
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
            )}
          </div>
        </>
      )}
    </>
  )
}

export default FormPenilaianPembimbingJurusan