import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react';
import { Table, Input, Space, Button, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const TabelPrerequisite = () => {
  let searchInput;
  const [dataPrerequisite, setDataPrerequisite] = useState([])
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([]);
  axios.defaults.withCredentials = true;
  let history = useHistory()

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
            loadings={loadings[`cari`]}
            style={{ width: 90 }}
          >
            Cari
          </Button>
          <Button loading={loadings[`reset`]} onClick={() => handleReset(clearFilters, confirm, dataIndex, `reset`)} size="small" style={{ width: 90 }}>
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

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  useEffect(() => {
    axios.defaults.withCredentials = true;
    async function getDataPrerequisite() {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/prerequisite/prerequisites-company`)
        .then(function (result) {
          setDataPrerequisite(result.data.data)
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
    getDataPrerequisite()
  }, [history]);

  const columns = [{
    title: 'Nama Perusahaan',
    dataIndex: 'company_name',
    width: '10%',
    align: "center",
    fixed: 'left',
    ...getColumnSearchProps('company_name', 'nama perusahaan'),
  },
  {
    title: 'Alamat',
    dataIndex: 'address',
    width: '10%',
  },
  {
    title: 'Mekanisme',
    dataIndex: 'work_system',
    width: '3%',
    align: "center",
    filterSearch: true,
    filterMode: 'tree',
    filters: [
      {
        text: 'WFH',
        value: 'WFH'
      },
      {
        text: 'WFO',
        value: 'WFO'
      },
      {
        text: 'WFH & WFO',
        value: 'WFH & WFO'
      },
    ],
    onFilter: (value, record) => record.mekanisme.includes(value)
  },
  {
    title: 'Kuota',
    dataIndex: 'quota',
    width: '3%',
    align: "center",
  },
  {
    title: 'Requirement Perusahaan',
    children: [
      {
        title: 'Minat Pekerjaan',
        dataIndex: 'job_scopes',
        width: '10%',
        filterSearch: true,
        filterMode: 'tree',
        // filters: _.uniqWith(filterData(dataPemetaan)(i => i.name), _.isEqual),
        onFilter: (value, record) => record.minat.includes(value),
        render: (text, record) =>
          <>
            {record.job_scopes.map((item, i) => (
              <div key={i}>
                {i + 1}.{item}<br />
              </div>
            ))}
          </>
      },
      {
        title: 'Bahasa Pemrograman',
        dataIndex: 'programming_languages',
        width: '7%',
        ...getColumnSearchProps('programming_languages', 'nama bahasa pemrograman'),
      },
      {
        title: 'Database',
        dataIndex: 'databases',
        width: '7%',
        ...getColumnSearchProps('databases', 'nama database'),
      },
      {
        title: 'Framework',
        dataIndex: 'frameworks',
        width: '7%',
        ...getColumnSearchProps('frameworks', 'nama framework'),
      },
      {
        title: 'Tools',
        dataIndex: 'tools',
        width: '9%',
        ...getColumnSearchProps('tools', 'nama tool'),
      },
      {
        title: 'Modelling',
        dataIndex: 'modelling_tools',
        width: '7%',
        ...getColumnSearchProps('modelling_tools', 'nama modelling'),
      },
      {
        title: 'Kemampuan Bahasa',
        dataIndex: 'communication_languages',
        width: '7%',
        ...getColumnSearchProps('communication_languages', 'nama bahasa komuniksi'),
      }
    ]
  },
  {
    title: 'Fasilitas',
    dataIndex: 'facility',
    width: '7%',
    align: "center",
  },
  {
    title: 'Keterangan',
    dataIndex: 'description',
    width: '7%',
    render: (text, record) =>
      <>
        <div className="preview" dangerouslySetInnerHTML={createMarkup(record.description)}></div>
      </>
  },
  {
    title: 'Proyek',
    dataIndex: 'project',
    width: '20%',
    render: (text, record) =>
      <>
        {showProject(record.project).map((item, i) => (
          <div key={i}>
            {i + 1}.{item}<br />
          </div>
        ))}
      </>
  }
  ];

  const showProject = (project) => {
    let dataKP = [];
    let dataPKL = [];
    let data2 = [];
    if (project) {
      if (project.split("|").length !== 0) {
        project.split("|").map(item => {
          return item.split("**")[2] === "d3" ? dataKP.push({
            name: item.split("**")[0],
            kuota: item.split("**")[1],
            prodi: "D3"
          }) : dataPKL.push({
            name: item.split("**")[0],
            kuota: item.split("**")[1],
            prodi: "D4"
          })
        })
      } else {
        project.split("**")[2] === "d3" ? dataKP.push({
          name: project.split("**")[0],
          kuota: project.split("**")[1],
          prodi: "D3"
        }) : dataPKL.push({
          name: project.split("**")[0],
          kuota: project.split("**")[1],
          prodi: "D4"
        })
      }

      if (parseInt(localStorage.getItem("id_prodi")) === 0) {
        dataKP.map(item => {
          return data2.push(`${item.name} (${item.kuota} mahasiswa)`)
        })
      } else {
        dataPKL.map(item => {
          return data2.push(`${item.name} (${item.kuota} mahasiswa)`)
        })
      }
    }
    return data2;

  }
  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      <CCard className="mb-4" style={{ height: "2000px" }}>
        <CCardBody style={{ paddingLeft: "20px" }}>
          <CRow>
            <CCol sm={12}>
              <h6>Tabel data prerequisite perusahaan</h6>
              <Table
                columns={columns}
                pagination={false}
                dataSource={dataPrerequisite}
                rowKey="company_name"
                scroll={{ x: "max-content" }}
                bordered />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default TabelPrerequisite
