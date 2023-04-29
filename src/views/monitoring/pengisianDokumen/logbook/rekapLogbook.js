import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
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
  Popconfirm,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapLogbook = () => {
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaCreate, setWannaCreate] = useState(false)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const { id } = useParams()
  const [loadings, setLoadings] = useState([])
  const desc = "*edit logbook yang dipilih"
  axios.defaults.withCredentials = true

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  function formatDate(string) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(string).toLocaleDateString([], options)
  }

  const refreshData = (index) => {
    axios.get('http://localhost:1337/api/logbooks').then((result) => {
      setLogbookPeserta(result.data.data)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }

  // useEffect(()=>{
  //   alert(rolePengguna)
  // },[])

  useEffect(() => {
    // if(rolePengguna!== 1){
    //   setIdPengguna(id)
    // }
    async function getLogbookPeserta(record, index) {
      enterLoading(index)
      await axios
        .get(
          `http://localhost:1337/api/logbooks?populate=*&filters[peserta][username]=${idPengguna}`,
        )
        .then((result) => {
          setLogbookPeserta(result.data.data)
          console.log(result.data.data)
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
    getLogbookPeserta()
  }, [history])

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
    onFilterDropdownVisibleChange: (visible) => {
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

  //PENCARIAN
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

  //EDIT LOGBOOK
  const confirmToEdit = () => {
    history.push(`/logbook/formEditLogbook/${wannaEdit.id}`)

  }

  //CREATE
  const handleCreateLogbook = () => {
    // alert(idPengguna)

    history.push(`/logbook/formlogbook/${idPengguna}`)
  }

  //RESET PENCARIAN
  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters()
    refreshData(index)
    setState({ searchText: '' })
    handleSearch(selectedKeys, confirm, dataIndex, index)
  }
  //KOLOM
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
      title: 'Tanggal Logbook',
      dataIndex: ['attributes', 'tanggallogbook'],
      ...getColumnSearchProps('tanggallogbook', 'Poin Penilaian'),
    },
    {
      title: 'Status Pengumpulan',
      dataIndex: ['attributes', 'statuspengumpulan'],
      ...getColumnSearchProps('statuspengumpulan', 'Status Poin Penilaian'),
    },
    {
      title: 'Aksi',
      width: '5%',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Popconfirm
                placement="topRight"
                title="Yakin akan melakukan edit logbook?"
                description={desc}
                onConfirm={confirmToEdit}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  id="button-pencil"
                  htmlType="submit"
                  shape="circle"
                  style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
                  onClick={() => {
                    setWannaEdit(record)
                  }}
                >
                  <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </>
      ),
    },
  ]

  return isLoading ? (
    <Spin indicator={antIcon} />
  ) : (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                id="create-logbook"
                size="sm"
                shape="round"
                style={{ color: 'white', background: '#339900', marginBottom: 16 }}
                onClick={handleCreateLogbook}
              >
                Tambahkan Logbook Baru
              </Button>
            </Col>
          </Row>
          <CRow>
            <CCol sm={12}>
              <h4>Tabel Logbook Peserta</h4>
              <Table
                scroll={{ x: 'max-content' }}
                columns={columns}
                dataSource={logbookPeserta}
                rowKey="id"
                bordered
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default RekapLogbook
