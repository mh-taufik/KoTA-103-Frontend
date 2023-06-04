import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Space,
  notification,
  Spin,
  Select,
  InputNumber,
  message,
  Popover,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'
import '../pengisianDokumen/rpp/rpp.css'
import TextArea from 'antd/lib/input/TextArea'
import { Box } from '@mui/material'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const PembobotanPenilaianFormPembimbing = () => {
  const [form] = Form.useForm()
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [poinPenilaianFormPembimbing, setPoinPenilaianFormPembimbing] = useState({})
  const [nilaiPoinSatu, setNilaiPoinSatu] = useState()
  const [nilaiPoinDua, setNilaiPoinDua] = useState()
  const [nilaiPoinTigas, setNilaiPoinTiga] = useState()
  const [isCanUpdate, setIsCanUpdate] = useState(true)
  const [dataPoinPenilaian, setDataPoinPenilaian] = useState([])
  const [isSuccessUpdateData, setIsSuccessUpdateData] = useState(true)

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  useEffect(() => {
    const getDataPoinPenilaianFormPembimbing = async (index) => {
      // enterLoading(index)
      await axios
        .get('http://localhost:1337/api/pembobotanformpembimbings')
        .then((result) => {
          console.log(result)
          console.log(result.data.data)
          setPoinPenilaianFormPembimbing({
            idNilaiProsesBimbingan: result.data.data[0].id,
            idNilaiLaporan: result.data.data[1].id,
            idNilaiLainnya: result.data.data[2].id,
            bobotNilaiProsesBimbingan: result.data.data[0].attributes.bobot,
            bobotNilaiLaporan: result.data.data[1].attributes.bobot,
            bobotNilaiLainnya: result.data.data[2].attributes.bobot,
            deskripsiNilaiProsesBimbingan: result.data.data[0].attributes.deskripsi,
            deskripsiNilaiLaporan: result.data.data[1].attributes.deskripsi,
            deskripsiNilaiLainnya: result.data.data[2].attributes.deskripsi,
            poinNilaiProsesBimbingan: result.data.data[0].attributes.poin,
            poinNilaiLaporan: result.data.data[1].attributes.poin,
            poinNilaiLainnya: result.data.data[2].attributes.poin,
          })

          let temp = result.data.data
          let temp1 = []
          let getTempDataPoin = function (obj) {
            for (var i in obj) {
              temp1.push({
                id: obj[i].id,
                deskripsi: obj[i].attributes.deskripsi,
                bobot: obj[i].attributes.bobot,
              })
            }
          }
          getTempDataPoin(temp)
          setDataPoinPenilaian(temp1)
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

    getDataPoinPenilaianFormPembimbing()
    console.log('res', poinPenilaianFormPembimbing)
  }, [history])

  const SimpanDataPerubahanPembobotan = async (index) => {
    await axios
      .put(``)
      .then((result) => {
        console.log(result)
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

  const isBobotEmpty = (nilaibobot) => {
    return nilaibobot ? nilaibobot : 0
  }

  const CekTotalBobotInput = () => {
    let totalBobot =
      parseInt(poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan) +
      parseInt(poinPenilaianFormPembimbing.bobotNilaiLaporan) +
      parseInt(poinPenilaianFormPembimbing.bobotNilaiLainnya)
    return totalBobot
  }

  useEffect(() => {
    console.log('bobot', poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan)
    let total_bobot = CekTotalBobotInput()
    console.log('total bobot', total_bobot)

    if (parseInt(total_bobot) > 100) {
      // if(parseInt(total_bobot)>100 || parseInt(total_bobot)<100){
      notification.warning({
        message: 'Maksimal total bobot 100, silahkan ubah untuk dapat melakukan update data',
      })
    }
  }, [poinPenilaianFormPembimbing])

  const handleUpdateDataPoin = (idData, keyData, dataValue, index) => {
    if (dataPoinPenilaian[index]) {
      dataPoinPenilaian[index][keyData] = dataValue
    } else {
      dataPoinPenilaian[index] = {
        id: idData,
        [keyData]: dataValue,
      }
    }
    setDataPoinPenilaian(dataPoinPenilaian)
  }

  useEffect(() => {
    console.log('DATA POIN PENILAIAN', dataPoinPenilaian)
  }, [dataPoinPenilaian])

  const simpanPoinPenilaian = () => {
    console.log('DATA POIN PENILAIAN', dataPoinPenilaian)
    let total_bobot = CekTotalBobotInput()
    if (parseInt(total_bobot) > 100 || parseInt(total_bobot) < 100) {
      notification.warning({
        message: 'Pastikan total keseluruhan bobot adalah 100',
      })
    } else {
      putBobotPenilaianDanDeskripsi(dataPoinPenilaian)
    }
  }

  const putBobotPenilaianDanDeskripsi = async (data) => {
    for (var i in data) {
      let id = data[i].id
      let deskripsi_new = data[i].deskripsi
      let bobot_new = data[i].bobot
      await axios
        .put(`http://localhost:1337/api/pembobotanformpembimbings/${id}`, {
          data: {
            deskripsi: deskripsi_new,
            bobot: bobot_new,
          },
        })
        .then((res) => {
          console.log(res)
          setIsSuccessUpdateData(true)
          refreshData()
        })
        .catch(function (error) {
          setIsSuccessUpdateData(false)
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

    if (isSuccessUpdateData) {
      notification.success({
        message: 'Data bobot penilaian berhasil diperbarui',
      })
    } else {
      notification.warning({
        message: 'Data bobot penilaian gagal diperbarui',
      })
    }
  }

  const refreshData = async (index) => {
    // enterLoading(index)
    await axios
      .get('http://localhost:1337/api/pembobotanformpembimbings')
      .then((result) => {
        console.log(result)
        console.log(result.data.data)
        setPoinPenilaianFormPembimbing({
          idNilaiProsesBimbingan: result.data.data[0].id,
          idNilaiLaporan: result.data.data[1].id,
          idNilaiLainnya: result.data.data[2].id,
          bobotNilaiProsesBimbingan: result.data.data[0].attributes.bobot,
          bobotNilaiLaporan: result.data.data[1].attributes.bobot,
          bobotNilaiLainnya: result.data.data[2].attributes.bobot,
          deskripsiNilaiProsesBimbingan: result.data.data[0].attributes.deskripsi,
          deskripsiNilaiLaporan: result.data.data[1].attributes.deskripsi,
          deskripsiNilaiLainnya: result.data.data[2].attributes.deskripsi,
          poinNilaiProsesBimbingan: result.data.data[0].attributes.poin,
          poinNilaiLaporan: result.data.data[1].attributes.poin,
          poinNilaiLainnya: result.data.data[2].attributes.poin,
        })

        let temp = result.data.data
        let temp1 = []
        let getTempDataPoin = function (obj) {
          for (var i in obj) {
            temp1.push({
              id: obj[i].id,
              deskripsi: obj[i].attributes.deskripsi,
              bobot: obj[i].attributes.bobot,
            })
          }
        }
        getTempDataPoin(temp)
        setDataPoinPenilaian(temp1)
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

  return isLoading?  (<Spin tip="Loading" size="large">
  <div className="content" />
</Spin>):(
    <>
      <div className="container2">
        <h2 className="justify">Pengelolaan Poin Penilaian Form Pembimbing</h2>

        <hr></hr>
        <Box sx={{ color: 'warning.main' }}>
          CATATAN
          <ul>
            <li>
              Poin penilaian ini digunakan pada halaman &quot;form penilaian pembimbing
              jurusan&quot;
            </li>
            <li>
              Memiliki 3 aspek penilaian diantaranya : Nilai proses bimbingan, laporan, dan lainnya
            </li>
            <li>Total poin harus 100 </li>
          </ul>
        </Box>

        <Form
          form={form}
          name="basic"
          fields={[
            {
              name: ['poinNilaiProsesBimbingan'],
              value: poinPenilaianFormPembimbing.poinNilaiProsesBimbingan,
            },
            {
              name: ['deskripsiPoinNilaiProsesBimbingan'],
              value: poinPenilaianFormPembimbing.deskripsiNilaiProsesBimbingan,
            },
            {
              name: ['bobotNilaiProsesBimbingan'],
              value: poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan,
            },
            {
              name: ['poinNilaiLaporan'],
              value: poinPenilaianFormPembimbing.poinNilaiLaporan,
            },
            {
              name: ['deskripsiPoinNilaiLaporan'],
              value: poinPenilaianFormPembimbing.deskripsiNilaiLaporan,
            },
            {
              name: ['bobotNilaiLaporan'],
              value: poinPenilaianFormPembimbing.bobotNilaiLaporan,
            },
            {
              name: ['poinNilaiLainnya'],
              value: poinPenilaianFormPembimbing.poinNilaiLainnya,
            },
            {
              name: ['deskripsiPoinNilaiLainnya'],
              value: poinPenilaianFormPembimbing.deskripsiNilaiLainnya,
            },
            {
              name: ['bobotNilaiLainnya'],
              value: poinPenilaianFormPembimbing.bobotNilaiLainnya,
            },
          ]}
        >
          <Popover content={<div>Klik tombol untuk menyimpan perubahan</div>}>
            <Button type="primary" onClick={simpanPoinPenilaian}>
              Simpan
            </Button>
          </Popover>
          <div className="spacetop" style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 20 }}>TOTAL BOBOT </b>
            <Box style={{ fontSize: 20 }} sx={{ color: 'error.main' }}>
              <b>{CekTotalBobotInput()}</b>
            </Box>
          </div>
          <div className="spacebottom"></div>
          <CCard>
            <CCardHeader style={{ paddingLeft: '20px' }}>
              <Row align="middle">
                <Col style={{ width: 300 }}>
                  <b>POIN PENILAIAN</b>
                </Col>
                <Col style={{ width: 400 }}>
                  <b style={{ marginLeft: 50 }}>DESKRIPSI PENILAIAN</b>
                </Col>
                <Col style={{ width: 300 }}>
                  <b style={{ marginLeft: 33 }}>BOBOT PENILAIAN</b>
                </Col>
              </Row>
            </CCardHeader>

            <CCardBody>
              <Row>
                <Col>
                  <Form.Item name="poinNilaiProsesBimbingan">
                    <label>
                      <b>{poinPenilaianFormPembimbing.poinNilaiProsesBimbingan}</b>
                    </label>
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="deskripsiPoinNilaiProsesBimbingan"
                    rules={[
                      { message: 'Isi deskripsi yang sesuai !!!' },
                      { required: true, message: 'Deskripsi penilaiaian tidak boleh kosong' },
                    ]}
                  >
                    <TextArea
                      style={{ width: 400, marginLeft: 80, height: 300 }}
                      onChange={(e) => {
                        handleUpdateDataPoin(
                          poinPenilaianFormPembimbing.idNilaiProsesBimbingan,
                          'deskripsi',
                          e.target.value,
                          0,
                        )
                        setPoinPenilaianFormPembimbing((pre) => {
                          return { ...pre, deskripsiNilaiProsesBimbingan: e.target.value }
                        })
                      }}
                      value={poinPenilaianFormPembimbing.deskripsiNilaiProsesBimbingan}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="bobotNilaiProsesBimbingan"
                    rules={[
                      { message: 'Isi dalam bentuk angka' },
                      { required: true, message: 'Bobot penilaian tidak boleh kosong' },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{ width: 270, marginLeft: 40 }}
                      value={poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan}
                      onChange={(e) => {
                        handleUpdateDataPoin(
                          poinPenilaianFormPembimbing.idNilaiProsesBimbingan,
                          'bobot',
                          e.target.value,
                          0,
                        )
                        setPoinPenilaianFormPembimbing((pre) => {
                          return { ...pre, bobotNilaiProsesBimbingan: e.target.value }
                        })
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item name="poinNilaiLaporan">
                    <label>
                      <b>{poinPenilaianFormPembimbing.poinNilaiLaporan}</b>
                    </label>
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="deskripsiPoinNilaiLaporan"
                    rules={[
                      { message: 'Isi deskripsi yang sesuai !!!' },
                      { required: true, message: 'Deskripsi penilaiaian tidak boleh kosong' },
                    ]}
                  >
                    <TextArea
                      style={{ width: 400, marginLeft: 80, height: 300 }}
                      onChange={(e) => {
                        handleUpdateDataPoin(
                          poinPenilaianFormPembimbing.idNilaiLaporan,
                          'deskripsi',
                          e.target.value,
                          1,
                        )
                        setPoinPenilaianFormPembimbing((pre) => {
                          return { ...pre, deskripsiNilaiLaporan: e.target.value }
                        })
                      }}
                      value={poinPenilaianFormPembimbing.deskripsiNilaiLaporan}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="bobotNilaiLaporan"
                    rules={[
                      { message: 'Isi dalam bentuk angka' },
                      { required: true, message: 'Bobot penilaian tidak boleh kosong' },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{ width: 270, marginLeft: 40 }}
                      value={poinPenilaianFormPembimbing.bobotNilaiLaporan}
                      onChange={(e) => {
                        handleUpdateDataPoin(
                          poinPenilaianFormPembimbing.idNilaiLaporan,
                          'bobot',
                          e.target.value,
                          1,
                        )
                        setPoinPenilaianFormPembimbing((pre) => {
                          return { ...pre, bobotNilaiLaporan: e.target.value }
                        })
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item name="poinNilaiLainnya">
                    <label>
                      <b>{poinPenilaianFormPembimbing.poinNilaiLainnya}</b>
                    </label>
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="deskripsiPoinNilaiLainnya"
                    rules={[
                      { message: 'Isi deskripsi yang sesuai !!!' },
                      { required: true, message: 'Deskripsi penilaiaian tidak boleh kosong' },
                    ]}
                  >
                    <TextArea
                      style={{ width: 400, marginLeft: 143, height: 300 }}
                      onChange={(e) => {
                        handleUpdateDataPoin(
                          poinPenilaianFormPembimbing.idNilaiLainnya,
                          'deskripsi',
                          e.target.value,
                          2,
                        )
                        setPoinPenilaianFormPembimbing((pre) => {
                          return { ...pre, deskripsiNilaiLainnya: e.target.value }
                        })
                      }}
                      value={poinPenilaianFormPembimbing.deskripsiNilaiLainnya}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="bobotNilaiLainnya"
                    rules={[
                      { message: 'Isi dalam bentuk angka ' },
                      { required: true, message: 'Bobot penilaian tidak boleh kosong' },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{ width: 270, marginLeft: 40 }}
                      value={poinPenilaianFormPembimbing.bobotNilaiLainnya}
                      onChange={(e) => {
                        handleUpdateDataPoin(
                          poinPenilaianFormPembimbing.idNilaiLainnya,
                          'bobot',
                          e.target.value,
                          2,
                        )
                        setPoinPenilaianFormPembimbing((pre) => {
                          return { ...pre, bobotNilaiLainnya: e.target.value }
                        })
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </CCardBody>
          </CCard>
        </Form>
      </div>
    </>
  )
}

export default PembobotanPenilaianFormPembimbing
