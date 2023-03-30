import React
, { useState, useEffect }
  from 'react';
import 'antd/dist/antd.css';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react';
import { Table, Row, Col, Button, Input, Space, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const TabelPengajuanPerusahaan = () => {
  let searchInput;
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  let history = useHistory();
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([]);
  axios.defaults.withCredentials = true;
  const detailPengajuanPerusahaan = (record) => {
    history.push(`/pengajuanPerusahaan/detailPengajuanPerusahaan/${record.id}`);
  }

  useEffect(() => {
    async function getDataPengajuan() {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/submission`)
        .then(result => {
          setDataPengajuan(result.data.data)
          setIsLoading(false)
        })
        .catch(function (error) {
          if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
            history.push({
              pathname: "/login",
              state: {
                session: true,
              }
            });
          } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
            history.push("/404");
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
            history.push("/500");
          }
        });
    }
    getDataPengajuan()
  }, [history]);

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Cari berdasarkan ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button loadign={loadings[`reset`]} onClick={() => handleReset(clearFilters, confirm, dataIndex, `reset`)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: text =>
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
  });

  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  const handleSearch = (selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const handleReset = (clearFilters, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters();
    confirm();
    setState({
      searchText: '',
      searchedColumn: dataIndex,
    });
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const columns = [{
    title: 'Nama Perusahaan',
    dataIndex: 'company_name',
    width: '15%',
    ...getColumnSearchProps('company_name', 'nama perusahaan'),
    align: "center"
  },
  {
    title: 'Narahubung',
    width: '75%',
    children: [
      {
        title: 'Nama',
        dataIndex: 'cp_name',
        align: "center",
      },
      {
        title: 'No HP',
        dataIndex: 'cp_phone',
        align: "center",
      },
      {
        title: 'Email',
        dataIndex: 'cp_mail',
        align: "center",
      },
    ]
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    align: "center",
    render: (text, record) =>
      <>
        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <Button
              id="detail"
              size="small"
              shape="round"
              style={{ color: "black", background: "#FBB03B" }}
              onClick={() => detailPengajuanPerusahaan(record)}
            >
              <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
            </Button>
          </Col>
        </Row>
      </>
  }];

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      <CCard className="mb-4" style={{ height: "2000px" }}>
        <CCardBody style={{ paddingLeft: "20px" }}>
          <CRow>
            <CCol sm={12}>
              <h6>Tabel data pengajuan perusahaan</h6>
              <Table
                columns={columns}
                dataSource={dataPengajuan}
                pagination={false}
                scroll={{x: "max-content"}}
                rowKey="id"
                bordered />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default TabelPengajuanPerusahaan
