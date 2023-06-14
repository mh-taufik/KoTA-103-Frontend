import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCardHeader} from '@coreui/react'
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  notification,
  Spin,
  Popover,
} from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import '../pengisianDokumen/rpp/rpp.css'
import TextArea from 'antd/lib/input/TextArea'
import { Box } from '@mui/material'

const PengaturanBobotFormPembimbingJurusan = () => {
  const [form] = Form.useForm()
  let history = useHistory()
  axios.defaults.withCredentials = true
  const [isLoading, setIsLoading] = useState(true)
  const [poinPenilaianFormPembimbing, setPoinPenilaianFormPembimbing] = useState({})
  const [dataPoinPenilaian, setDataPoinPenilaian] = useState([])
  const [isSuccessUpdateData, setIsSuccessUpdateData] = useState(true)


  
  useEffect(() => {
    const getDataPoinPenilaianFormPembimbing = async (index) => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/aspect/get`)
        .then((result) => {
          setPoinPenilaianFormPembimbing({
            idNilaiProsesBimbingan: result.data.data[0].id,
            idNilaiLaporan: result.data.data[1].id,
            idNilaiLainnya: result.data.data[2].id,

            bobotNilaiProsesBimbingan: result.data.data[0].max_grade,
            bobotNilaiLaporan: result.data.data[1].max_grade,
            bobotNilaiLainnya: result.data.data[2].max_grade,

            deskripsiNilaiProsesBimbingan: result.data.data[0].description,
            deskripsiNilaiLaporan: result.data.data[1].description,
            deskripsiNilaiLainnya: result.data.data[2].description,

            poinNilaiProsesBimbingan: result.data.data[0].name,
            poinNilaiLaporan: result.data.data[1].name,
            poinNilaiLainnya: result.data.data[2].name,
          })

          let temp = result.data.data
          let temp1 = []
          let getTempDataPoin = function (obj) {
            for (var i in obj) {
              temp1.push({
                id: obj[i].id,
                name : obj[i].name,
                description: obj[i].description,
                max_grade: obj[i].max_grade,
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



  }, [history])



  const isMaxGradeEmpty = (nilaibobot) => {
    return nilaibobot ? nilaibobot : 0
  }

  const CekTotalBobotInput = () => {
    let totalBobot =
      isMaxGradeEmpty(parseInt(poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan)) +
      isMaxGradeEmpty(parseInt(poinPenilaianFormPembimbing.bobotNilaiLaporan)) +
      isMaxGradeEmpty(parseInt(poinPenilaianFormPembimbing.bobotNilaiLainnya))
    return totalBobot
  }

  useEffect(() => {
    let total_bobot = CekTotalBobotInput()
    if (parseInt(total_bobot) > 100) {
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


  const simpanPoinPenilaian = () => {
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
      let aspect_id = data[i].id
      let description_new = data[i].description
      let max_grade_new = data[i].max_grade
      let name_new = data[i].name
      await axios
        .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/aspect/update`, {
          "description" : description_new,
          "id" : aspect_id,
          "max_grade" : max_grade_new,
          "name" : name_new
        })
        .then((res) => {
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
    await axios
    .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/aspect/get`)
    .then((result) => {
      setPoinPenilaianFormPembimbing({
        idNilaiProsesBimbingan: result.data.data[0].id,
        idNilaiLaporan: result.data.data[1].id,
        idNilaiLainnya: result.data.data[2].id,

        bobotNilaiProsesBimbingan: result.data.data[0].max_grade,
        bobotNilaiLaporan: result.data.data[1].max_grade,
        bobotNilaiLainnya: result.data.data[2].max_grade,

        deskripsiNilaiProsesBimbingan: result.data.data[0].description,
        deskripsiNilaiLaporan: result.data.data[1].description,
        deskripsiNilaiLainnya: result.data.data[2].description,

        poinNilaiProsesBimbingan: result.data.data[0].name,
        poinNilaiLaporan: result.data.data[1].name,
        poinNilaiLainnya: result.data.data[2].name,
      })

      let temp = result.data.data
      let temp1 = []
      let getTempDataPoin = function (obj) {
        for (var i in obj) {
          temp1.push({
            id: obj[i].id,
            name : obj[i].name,
            description: obj[i].description,
            max_grade: obj[i].max_grade,
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
                          'description',
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
                          'max_grade',
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
                          'description',
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
                          'max_grade',
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
                          'description',
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
                          'max_grade',
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

export default PengaturanBobotFormPembimbingJurusan
