import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faLock, faTrashCan, faEdit, faPen } from '@fortawesome/free-solid-svg-icons'
import {
  Tabs,
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Space,
  Spin,
  Popover,
} from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'
import Text from 'antd/lib/typography/Text'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TabPane } = Tabs

const ListDokumenPeserta = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [pesertaD3, setPesertaD3] = useState([])
  const [pesertaD4, setPesertaD4] = useState([])
  var rolePengguna = localStorage.id_role
  var usernamePengguna = localStorage.username

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  const showModalEdit = (record) => {
    setIsModalEditVisible(true)
    setChoose(record)
  }

  //LIHAT LOGBOOK PESERTA
  const actionSeeListLogbookParticipant = (idPeserta) => {
    history.push(`/rekapDokumenPeserta/logbookPeserta/${idPeserta}`)
  }

  useEffect(() => {
    //  alert(rolePengguna)

    const getAllListPesertaD3 = async (record, index) => {
      var APIGETPESERTA

      //GET DATA PESERTA BASED ON ROLE, PANITIA OR PEMBIMBING
      if (rolePengguna === '0') {
        APIGETPESERTA = 'http://localhost:1337/api/pesertas?filters[prodi]=D3'
      } else if (rolePengguna === '1') {
        APIGETPESERTA = 'http://localhost:1337/api/pesertas?filters[prodi]=D4'
      }

      await axios
        .get(`${APIGETPESERTA}`)
        .then((res) => {
          // console.log("d3 all == ", res.data.data)
          setPesertaD3(res.data.data)
          setIsLoading(false)
          console.log(res)
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

    const getAllListPesertaD4 = async (record, index) => {
      var APIGETPESERTAD4

      if (rolePengguna === '0') {
        //API NYA PERLU DISESUAIKAN
        APIGETPESERTAD4 = 'http://localhost:1337/api/pesertas?filters[prodi]=D4'
      } else if (rolePengguna === '1') {
        APIGETPESERTAD4 = 'http://localhost:1337/api/pesertas?filters[prodi]=D3'
      }

      await axios
        .get(`${APIGETPESERTAD4}`)
        .then((res) => {
          console.log('d3 all == ', res.data.data)
          setIsLoading(false)
          setPesertaD4(res.data.data)
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

    getAllListPesertaD3()
    getAllListPesertaD4()
  }, [history])

  const hoverButton = <div>Klik Tombol, untuk melakukan monitoring peserta ini</div>

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'Nama Peserta',
      dataIndex: ['attributes', 'nama'],
      width: '40%',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                style={{ borderColor: 'white' }}
                onClick={() => {
                  console.log('rpp peserta dari : ', record)
                  console.log('username', record.attributes.username)
                }}
            
                size="small"
                
              >
                <Text style={{fontSize:'3',color:'white'}}>RPP</Text>
              </Button>
              <Button
                type="primary"
                style={{ borderColor: 'white' }}
                onClick={() => {
                  console.log('logbook dari peserta : ', record)
                  actionSeeListLogbookParticipant(record.attributes.username)
                }}
              
                size="small"
              >
                   <Text style={{fontSize:'3',color:'white'}}>Logbook</Text>
              </Button>
              <Button type="primary" style={{ borderColor: 'white' }}  size="small">
              <Text style={{fontSize:'3',color:'white'}}>Self Assessment</Text>
              </Button>
              <Button type="primary" style={{ borderColor: 'white' }} size="small">
              <Text style={{fontSize:'3',color:'white'}}>Laporan</Text>
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const onChange = (activeKey) => {
    setKey(activeKey)
  }
  // isLoading ? (<Spin indicator={antIcon} />) : (
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          {/* {localStorage.getItem("id_role") === "0" && key === "1" && (
              <>
              
              </>)} */}
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {pesertaD3.length > 0 && (
                  <>
                    <TabPane tab="Prodi D3" key="1">
                      <h6>Daftar Peserta Kerja Praktik (KP) </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={pesertaD3}
                        rowKey="id"
                        bordered
                      />
                    </TabPane>
                  </>
                )}

                {pesertaD4.length > 0 && (
                  <>
                    <TabPane tab="Prodi D4" key="2">
                      <h6>Daftar Peserta Praktik Kerja Lapangan (PKL) </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={pesertaD4}
                        rowKey="id"
                        bordered
                      />
                    </TabPane>
                  </>
                )}
              </Tabs>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ListDokumenPeserta
