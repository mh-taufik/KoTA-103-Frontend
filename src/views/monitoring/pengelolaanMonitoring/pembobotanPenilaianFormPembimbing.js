import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
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

  const SimpanDataPerubahanPembobotan = async(index) => {
    await axios.put('')
    .then((result)=>{
      console.log(result)

    }).catch(function (error) {
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
    var totalBobot = parseInt(poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan)+parseInt(poinPenilaianFormPembimbing.bobotNilaiLaporan)+parseInt(poinPenilaianFormPembimbing.bobotNilaiLainnya)
    console.log("total", totalBobot)
    setNilaiPoinDua(totalBobot)
    if(totalBobot>100){
      setIsCanUpdate(false)
      notification.warning({
        message:'Bobot harus berjumlah 100, silahkan ubah untuk dapat melakukan update data'
      })
    }
  }


  useEffect(() => {

    console.log("bobot",poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan)
    CekTotalBobotInput()


  },[poinPenilaianFormPembimbing])

  const columns = [
    {
      title: 'POIN PENILIAN',
      dataIndex: ['attributes', 'poin'],
      key: 'poinpenilaian',
    },
    {
      title: 'DESKRIPSI',
      dataIndex: ['attributes, deskripsi'],
      key: 'deskripsi',
    },
  ]

  return (
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
            <li>Masing masing poin memiliki bobot dengan maksimal total 100 </li>
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
          <Button type="primary" onClick={()=>alert(nilaiPoinDua)}>Simpan</Button>
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
                        console.log(e.target.value)
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
                    type='number'
                      style={{ width: 270, marginLeft: 40 }}
                      value={poinPenilaianFormPembimbing.bobotNilaiProsesBimbingan}
                      onChange={ (e) =>
                        
                        {console.log(e.target.value); setPoinPenilaianFormPembimbing((pre)=>{
                        return{...pre, bobotNilaiProsesBimbingan:e.target.value}
                      })
                    }
                    
                    }
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
                    type='number'
                      style={{ width: 270, marginLeft: 40 }}
                      value={poinPenilaianFormPembimbing.bobotNilaiLaporan}
                      onChange={ (e) =>
                        
                        {console.log(e.target.value); setPoinPenilaianFormPembimbing((pre)=>{
                        return{...pre, bobotNilaiLaporan:e.target.value}
                      })
                    }
                    
                    }
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
                    type='number'
                      style={{ width: 270, marginLeft: 40 }}
                      value={poinPenilaianFormPembimbing.bobotNilaiLainnya}
                      onChange={ (e) =>
                        
                        {console.log(e.target.value); setPoinPenilaianFormPembimbing((pre)=>{
                          return{...pre, bobotNilaiLainnya:e.target.value}
                        })
                    }
                    
                    }
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
