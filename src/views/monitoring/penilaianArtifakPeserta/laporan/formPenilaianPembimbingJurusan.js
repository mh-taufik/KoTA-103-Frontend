import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../pengisianDokumen/rpp/rpp.css'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { Refresh } from '@mui/icons-material'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import { Card, Input, Popover, Space, message, notification, spin } from 'antd'
import { InputNumber } from 'antd'

const FormPenilaianPembimbingJurusan = (props) => {
  const params = useParams()
  const NIM_PESERTA = params.nim
  const [idPeserta, setIdPeserta] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
  const [loadings, setLoadings] = useState([])
  const [poinPenilaianForm, setPoinPenilaianForm] = useState([])
  const [nilaiPembimbingJurusan, setNilaiPembimbingJurusan] = useState([
    { id: '', nilai: 0 },
    { id: '', nilai: 0 },
    { id: '', nilai: 0 },
  ])
  const [nilaiTotal, setNilaiTotal] = useState([])

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
  const handleInputNilai = (ids, value, index) => {
    var data = [...nilaiPembimbingJurusan]
    data[index] = {
      id: ids,
      nilai: value,
    }
    setNilaiPembimbingJurusan(data)
  }

  useEffect(() => {
    // console.log(nilaiPembimbingJurusan)
    var temp1 = function (obj) {
      for (var i in obj) {
        // totalnilai += obj[i].nilai
        setNilaiTotal({
          nilaipoinsatu: obj[0].nilai,
          nilaipoindua: obj[1].nilai,
          nilaipointiga: obj[2].nilai,
        })
      }
    }
    temp1(nilaiPembimbingJurusan)
  }, [nilaiPembimbingJurusan])

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

    getDataPoinPenilaianFormPembimbingJurusan()
    console.log(poinPenilaianForm)
  }, [history])

  const buttonKembaliKeListHandling= () => {
    history.push(`/rekapDokumenPeserta/laporan/${NIM_PESERTA}`)
  }
  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}
      >
        <Card title="INFORMASI PESERTA" size="small">
          <Row>
            <Col span={4}>Nama</Col>
            <Col span={4}>Gina Anifah Choirunnisa</Col>
            <Col span={16}>&nbsp;</Col>
            <Col span={16}>&nbsp;</Col>
            <Col span={16}>&nbsp;</Col>
            <Col span={16}>&nbsp;</Col>
          </Row>
          <Row>
            <Col span={4}>NIM</Col>
            <Col span={4}>201511009</Col>
            <Col span={16}>&nbsp;</Col>
            <Col span={16}>&nbsp;</Col>
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
              <Col span={2}></Col>
              <Col span={2}>Tepat Waktu </Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Terlambat</Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Tidak Mengumpulkan </Col>
              <Col span={18}>18</Col>
            </Row>
            <hr />
            <Row>
              <Col span={4}>
                <b>2. &nbsp;&nbsp; Penilaian Pembimbing Jurusan</b>
              </Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Sangat Baik </Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Baik</Col>
              <Col span={18}>12</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Cukup </Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Kurang </Col>
              <Col span={18}>32</Col>
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
              <Col span={2}></Col>
              <Col span={2}>Tepat Waktu </Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Terlambat</Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Tidak Mengumpulkan </Col>
              <Col span={18}>18</Col>
            </Row>
            <hr />
            <Row>
              <Col span={4}>
                <b>2. &nbsp;&nbsp; Penilaian Pembimbing Jurusan</b>
              </Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Sangat Baik </Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Baik</Col>
              <Col span={18}>12</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Cukup </Col>
              <Col span={18}>18</Col>
            </Row>
            <Row>
              <Col span={2}></Col>
              <Col span={2}>Kurang </Col>
              <Col span={18}>32</Col>
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
      <div className=" container">
        <Popover content={<div>Lihat isi detail dokumen laporan peserta</div>}>
          <Button
            size="small"
            onClick={buttonKembaliKeListHandling}
            type='primary'
          >
           Kembali
          </Button>
        </Popover>
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
          {poinPenilaianForm.map((data, index) => {
            return (
              <>
                <Row style={{ paddingBottom: 20, paddingTop: 20 }}>
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
                      maxLength={2}
                      // ref={nilaiTotal}
                      value={nilaiPembimbingJurusan.nilai}
                      onChange={(value) => handleInputNilai(data.id, value, index)}
                      max={data.bobot}
                      keyboard={true}
                      minLength={1}
                    />
                  </Col>
                </Row>
                <hr />
              </>
            )
          })}
          <Row>
            <Col span={16}>TOTAL</Col>
            <Col span={8}>
              <b>{total()}</b>
            </Col>
          </Row>

          <Button className="form-control btn btn-primary" htmlType="submit">
            Simpan Penilaian
          </Button>
        </Form>
      </div>
    </>
  )
}

export default FormPenilaianPembimbingJurusan
