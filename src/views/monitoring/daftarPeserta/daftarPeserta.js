import React, { useEffect, useState } from 'react'
import 'antd/dist/reset.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { Tabs, Table, Button, Row, Col, Input, Space, Spin, Popover, Result } from 'antd'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { SmileOutlined} from '@ant-design/icons'

const DaftarPeserta = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [key, setKey] = useState('1')
  let history = useHistory()
  const [loadings, setLoadings] = useState([])
  axios.defaults.withCredentials = true
  const [peserta, setPeserta] = useState([])
  const rolePengguna = localStorage.id_role
  const [isNotNullParticipantSupervisor, setIsNotNullParticipantSupervisor] = useState()



  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node
          }}
          placeholder={`Cari berdasarkan ${name}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, `cari`)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, `cari`)}
            icon={<SearchOutlined />}
            size="small"
            loading={loadings[`cari`]}
            style={{ width: 90 }}
          >
            Cari
          </Button>
          <Button
            loading={loadings[99]}
            onClick={() => handleReset(clearFilters, '', confirm, dataIndex, 99)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100)
      }
    },
    render: (text) =>
      state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const handleSearch = (selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    confirm()
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = false
      return newLoadings
    })
  }

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters()
    refreshData(index)
    setState({ searchText: '' })
    handleSearch(selectedKeys, confirm, dataIndex, index)
  }
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  const refreshData = async (index) => {
    let api_get_peserta
    axios.defaults.withCredentials = true
    if (rolePengguna !== '4') {
      api_get_peserta = `${process.env.REACT_APP_API_GATEWAY_URL}participant/get-all?type=comitte`
    } else {
      await axios
        .get('http://localhost:8080/monitoring/supervisor-mapping/get-all?type=supervisor')
        .then((res) => {
          if (res.data.data !== null) {
            if (res.data.data[0].participant !== null) {
              setPeserta(res.data.data[0].participant)
            } else {
              setPeserta(undefined)
              setIsNotNullParticipantSupervisor(false)
            }
          }

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

    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = false
      return newLoadings
    })
  }

  useEffect(() => {
    const getAllParticipant = async () => {
      axios.defaults.withCredentials = true
      if (rolePengguna !== '4') {
        await axios
          .get(
            `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all?type=comitte`,
          )
          .then((res) => {
            if (res.data.data !== null) {
              let participant_supervisor = []

              let getParticipantSupervisor = function (data) {
                for (var iterate_data in data) {
                  let data_company = data[iterate_data].company_name
                  let data_supervisor = data[iterate_data].lecturer_name
                  let participant = data[iterate_data].participant
                  
              
                 if(participant !== null){
                    for (var iterate_participant in participant) {
                      participant_supervisor.push({
                        id: participant[iterate_participant].id,
                        name: participant[iterate_participant].name,
                        supervisor: data_supervisor,
                        company: data_company,
                      })
                    }
                    setIsNotNullParticipantSupervisor(true)
                  }else{
                    setIsNotNullParticipantSupervisor(false)
                 }
                }
              }

              getParticipantSupervisor(res.data.data)
              setPeserta(participant_supervisor)
            }
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
      } else if (rolePengguna === '4') {
        await axios
          .get(
            `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor-mapping/get-all?type=supervisor`,
          )
          .then((res) => {
            if (res.data.data !== null) {
              let participant_supervisor = []

              let getParticipantSupervisor = function (data) {
                for (var iterate_data in data) {
                  let data_company = data[iterate_data].company_name
                  let data_supervisor = data[iterate_data].lecturer_name
                  let participant = data[iterate_data].participant
                  if(participant !== null){
                    for (var iterate_participant in participant) {
                      participant_supervisor.push({
                        id: participant[iterate_participant].id,
                        name: participant[iterate_participant].name,
                        supervisor: data_supervisor,
                        company: data_company,
                      })
                    }
                    setIsNotNullParticipantSupervisor(true)
                  }else{
                    setIsNotNullParticipantSupervisor(false)
                  }
                }
              }

              getParticipantSupervisor(res.data.data)
              setPeserta(participant_supervisor)
            }
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
    }

    getAllParticipant()
  }, [history])

  const columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'NIM',
      dataIndex: 'id',
      width: '10%',
      ...getColumnSearchProps('id', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '25%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'PEMBIMBING JURUSAN',
      dataIndex: 'supervisor',
      width: '25%',
      ...getColumnSearchProps('supervisor', 'Pembimbing Jurusan'),
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      width: '25%',
      ...getColumnSearchProps('company', 'Perusahaan'),
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover content={<div>Klik tombol, untuk melihat detail dashboard peserta</div>}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    history.push(`/daftarPeserta/dashboardPeserta/${record.id}`)
                  }
                >
                  Dashboard Peserta
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const supervisor_columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'NIM',
      dataIndex: 'id',
      width: '10%',
      ...getColumnSearchProps('id', 'NIM'),
    },
    {
      title: 'NAMA PESERTA',
      dataIndex: 'name',
      width: '30%',
      ...getColumnSearchProps('name', 'Nama'),
    },
    {
      title: 'PERUSAHAAN',
      dataIndex: 'company',
      width: '25%',
      ...getColumnSearchProps('company', 'Perusahaan'),
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Popover content={<div>Klik tombol, untuk melihat detail dashboard peserta</div>}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
               history.push(`/daftarPeserta/dashboardPeserta/${record.id}`)
                  }
                >
                  Dashboard Peserta
                </Button>
              </Popover>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  const onChange = (activeKey) => {
    setKey(activeKey)
  }

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

  const items = [
    {
      key: '1',
      label: 'PESERTA',
      children: (
        <Table
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={peserta}
          rowKey={peserta.id}
          bordered
          pagination={true}
        />
      ),
    },
  ]

  const supervisor_items = [
    {
      key: '1',
      label: 'PESERTA',
      children: (
        <Table
          scroll={{ x: 'max-content' }}
          columns={supervisor_columns}
          dataSource={peserta}
          rowKey={peserta.id}
          bordered
          pagination={true}
        />
      ),
    },
  ]

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <CCard className="mb-4" key={1}>
        {rolePengguna === '4' && <>{title('LIST DASHBOARD PESERTA BIMBINGAN')}</>}
        {rolePengguna !== '4' && <>{title('LIST DASHBOARD  PESERTA KP dan PKL')}</>}
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              {rolePengguna !== '4' && (
                <Tabs type="card" defaultActiveKey="1" items={items} onChange={onChange}></Tabs>
              )}

              {(rolePengguna === '4'  && isNotNullParticipantSupervisor)&& (
                <Tabs
                  type="card"
                  defaultActiveKey="1"
                  items={supervisor_items}
                  onChange={onChange}
                ></Tabs>
              )}

              {(rolePengguna === '4' && !isNotNullParticipantSupervisor)&&(
                  <Result
                  icon={<SmileOutlined />}
                  title="Maaf Akses Untuk Halaman Ini Belum Dibuka"
                  subTitle="Anda belum memiliki peserta bimbingan"
                
                />
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DaftarPeserta
