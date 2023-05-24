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
  Select,
} from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const { TabPane } = Tabs

const PemetaanPembimbingJurusan = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  const [form1] = Form.useForm()
  const [pembimbing, setPembimbing] = useState([])
  const [pembimbingChoosen, setPembimbingChoosen] = useState([])
  const [idChoosen, setIdChoosen] = useState()
  const [idPerusahaanChoosen, setIdPerusahaanChoosen] = useState()
  axios.defaults.withCredentials = true
  const [perusahaan, setPerusahaan] = useState([])
  const [perusahaanEdit, setPerusahaanEdit] = useState([])

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

  const getPembimbingJurusanBasedOnId = async (record) => {
    await axios
      .get(`http://localhost:1337/api/perusahaans?filters[id]=${record.id}&populate=*`)
      .then((res) => {
        console.log('record', res.data.data[0].id)
        setPembimbingChoosen(res.data.data[0].attributes.pembimbingjurusan.data.attributes.nama)
        setIdChoosen(res.data.data[0].attributes.pembimbingjurusan.data.id)
        setIdPerusahaanChoosen(res.data.data[0].id)
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

  const refreshData = (index) => {
    // window.location.reload(false);
    axios.get('http://localhost:1337/api/perusahaans?populate=*').then((result) => {
      setPembimbingChoosen(' ')
      setPerusahaan(result.data.data)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }

  const HandleEditPembimbingJurusan = async (id, idPembimbing, index) => {
    await axios
      .put(`http://localhost:1337/api/perusahaans/${id}`, {
        data: {
          pembimbingjurusan: {
            connect: [idPembimbing],
          },
        },
      })
      .then((res) => {
        refreshData(index)
        notification.success({
          message: 'Data Pembimbing Jurusan Berhasil Diubah',
        })
        setIsModalEditVisible(false)
        form1.resetFields()
        // console.log(res)

        // setTimeout(function() {

        // }, 1000);
        // window.location.reload(false);
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

  const getAllDataPembimbingJurusan = async () => {
    await axios
      .get('http://localhost:1337/api/pembimbing-jurusans')
      .then((res) => {
        console.log(res.data.data)
        setPembimbing(res.data.data)
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
    async function getDataPemetaanPerusahaan() {
      await axios
        .get('http://localhost:1337/api/perusahaans?populate=*')
        .then((result) => {
          setPerusahaan(result.data.data)
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
    getDataPemetaanPerusahaan()
  }, [history])

  const columns = [
    {
      title: 'Nama Perusahaan',
      dataIndex: ['attributes', 'namaperusahaan'],
      width: '40%',
    },
    {
      title: 'Nama Pembimbing Jurusan',
      dataIndex: ['attributes', 'pembimbingjurusan', 'data', 'attributes', 'nama'],
      width: '30%',
    },
    {
      title: 'id',
      dataIndex: 'id',
      width: '30%',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Button
                id="button-pencil"
                htmlType="submit"
                shape="circle"
                style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                onClick={() => {
                  getPembimbingJurusanBasedOnId(record)
                  getAllDataPembimbingJurusan()

                  showModalEdit(record)
                  console.log('data edit', record)
                  // console.log("pembimbing choosen", pembimbingChoosen)
                }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
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

  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }

  // isLoading ? (<Spin indicator={antIcon} />) : (
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          {localStorage.getItem('id_role') === '3' && key === '1' && <></>}
          <CRow>
            <CCol sm={12}>
              <Tabs type="card" onChange={onChange}>
                {perusahaan.length > 0 && (
                  <>
                    <TabPane tab="Prodi D3" key="1">
                      <h6>Tabel Pemetaan Perusahaan Prodi D3 </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={perusahaan}
                        rowKey="id"
                        bordered
                      />
                    </TabPane>
                  </>
                )}

                {perusahaan.length > 0 && (
                  <>
                    <TabPane tab="Prodi D4" key="2">
                      <h6>Tabel Pemetaan Perusahaan Prodi D4 </h6>
                      <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={perusahaan}
                        rowKey="perusahaan."
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

      <Modal
        title="Ubah Pembimbing Jurusan"
        visible={isModaleditVisible}
        onOk={form1.submit}
        onCancel={handleCancelEdit}
        width={600}
        zIndex={9999999}
        footer={[
          <Button key="back" onClick={handleCancelEdit}>
            Batal
          </Button>,
          <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
            Simpan
          </Button>,
        ]}
      >
        <Form
          form={form1}
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={() => HandleEditPembimbingJurusan(idPerusahaanChoosen, idChoosen)}
          autoComplete="off"
          fields={[
            {
              name: 'namapembimbing',
              value: pembimbingChoosen,
            },
          ]}
        >
          <Form.Item
            label="Pilih Pembimbing"
            rules={[{ required: true, message: 'Nama Pembimbing Tidak Boleh Kosong' }]}
          >
            <Select
              name="namapembimbing"
              placeholder="Pilih Pembimbing Jurusan"
              value={pembimbingChoosen}
              onChange={(value) => {
                setIdChoosen(value)
              }}
            >
              {pembimbing.map((p) => {
                return (
                  <Option key={p.id} value={p.id}>
                    {p.attributes.nama}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          {/* <Form.Item>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={() => alert('tes')}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true },
              ]}
            />
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  )
}

export default PemetaanPembimbingJurusan
