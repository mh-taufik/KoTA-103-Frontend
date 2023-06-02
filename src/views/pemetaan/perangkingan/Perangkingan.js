import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Table, Button, Input, Space, notification, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import _ from "lodash";

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const FileDownload = require('js-file-download');

const Perangkingan = () => {
  let searchInput;
  const [data, setData] = useState([])
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([]);
  axios.defaults.withCredentials = true;

  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  const [state, setState] = useState({ searchText: '', searchedColumn: '', })

  const refreshData = async (index) => {
    let d = {
      rangking: [],
      date: null
    };
    let rank = 0;
    let count = 0;
    let nilai = 0;
    await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/get-rank`).then(response => {
      response.data.data.ranking_list.map((item) => {
        rank = 0;
        count = 0;
        nilai = null;
        return item.participants.sort((a, b) => b.result - a.result).forEach((i) => {
          count = count + 1
          if (nilai === null || nilai !== i.result) {
            rank = count
          }
          d.rangking.push({
            id: item.company_name + i.participant_name,
            company_name: item.company_name,
            quota: item.quota,
            participant_name: i.participant_name,
            rangking: rank,
            result: i.result
          })
          nilai = i.result
        })
      })
      d.date = response.data.data.date
      setData(d)
      response.data.data && d && setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    })
  }

  const generatePerangkingan = async (index) => {
    enterLoading(index)
    await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/generate-rank`)
      .then(function (response) {
        refreshData(index)
        notification.success({
          message: 'Generate perangkingan berhasil'
        });
      })
      .catch(function (error) {
        notification.error({
          message: 'Generate perangkingan gagal!'
        });
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      });
  }

  const eksporPerangkingan = async (index) => {
    enterLoading(index)
    axios.defaults.withCredentials = true;
    await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/export-mapping`, {
      responseType: 'blob',
    })
      .then(function (response) {
        notification.success({
          message: 'Ekspor perangkingan berhasil'
        });
        FileDownload(response.data, 'Data pendukung.xlsx');
        response && setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      })
      .catch(function (error) {
        notification.error({
          message: 'Ekspor perangkingan gagal!'
        });
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      });
  }

  useEffect(() => {
    const getRangking = async () => {
      let d = {
        rangking: [],
        date: null
      };
      let count = 0;
      let rank = 0;
      let nilai = 0;
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/get-rank`)
        .then(function (response) {
          response.data.data.ranking_list ? response.data.data.ranking_list.map((item) => {
            rank = 0
            count = 0
            nilai = null
            return item.participants.sort((a, b) => b.result - a.result).forEach((i) => {
              count = count + 1
              if (nilai === null || nilai !== i.result) {
                rank = count
              }
              d.rangking.push({
                id: item.company_name + i.participant_name,
                company_name: item.company_name,
                quota: item.quota,
                participant_name: i.participant_name,
                rangking: rank,
                result: i.result
              })
              nilai = i.result
            })
          }) : d.rangking = []
          d.date = response.data.data.date
          setData(d)
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
    getRangking();
  }, [history]);

  const filterData = data => formatter => data.map(item => ({
    text: formatter(item),
    value: formatter(item)
  }));

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
          <Button loading={loadings[`reset`]} onClick={() => handleReset(clearFilters, "", confirm, dataIndex, `reset`)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text, record) =>
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

  const handleSearch = (selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    let d = {
      rangking: [],
      date: null
    };
    let rank = 0;
    let count = 0;
    let nilai = 0;
    axios.defaults.withCredentials = true;
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/get-rank`)
      .then(function (response) {
        response.data.data.ranking_list ? response.data.data.ranking_list.map((item) => {
          rank = 0;
          count = 0;
          nilai = null;
          return item.participants.sort((a, b) => b.result - a.result).forEach((i) => {
            count = count + 1
            if (nilai === null || nilai !== i.result) {
              rank = count
            }
            d.rangking.push({
              id: item.company_name + i.participant_name,
              company_name: item.company_name,
              quota: item.quota,
              participant_name: i.participant_name,
              rangking: rank,
              result: i.result
            })
            nilai = i.result
          })
        }) : d.rangking = []

        if (selectedKeys[0] === undefined) {
          d.date = response.data.data.date
          setData(d)
        } else {
          d.date = response.data.data.date
          d.rangking = d.rangking.filter(item => item.participant_name.includes(selectedKeys[0]))
          setData(d)
        }
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      })
  };

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    clearFilters();
    refreshData(index)
    setState({ searchText: '' });
    handleSearch(selectedKeys, confirm, dataIndex, index)
  };

  const createNewArr = (data) => {
    return data.reduce((result, item) => {
      //First, take the name field as a new array result
      if (result.indexOf(item.company_name) < 0) {
        result.push(item.company_name)
      }
      return result
    }, []).reduce((result, company_name) => {
      //Take the data with the same company_name as a new array, and add a new field * * rowSpan inside it**
      const children = data.filter(item => item.company_name === company_name);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0,//Add the first row of data to the rowSpan field
        }))
      )
      return result;
    }, [])
  }

  const columns = [
    {
      title: 'Nama Perusahaan',
      dataIndex: 'company_name',
      width: '45%',
      onCell: (record) => { return { rowSpan: record.rowSpan } },
      render(_, row) {
        return <>{row.company_name}</>
      },
      filterSearch: true,
      filterMode: 'tree',
      filters: _.uniqWith(filterData(data.rangking === undefined ? [] : data.rangking)(i => i.company_name), _.isEqual),
      onFilter: (value, record) => record.company_name.includes(value)
    },
    {
      title: 'Kuota',
      dataIndex: 'quota',
      width: '10%',
      align: 'center',
      onCell: (record) => { return { rowSpan: record.rowSpan } },
      render(_, row) {
        return <>{row.quota}</>
      },
    },
    {
      title: 'Nama Mahasiswa',
      dataIndex: 'participant_name',
      width: '25%',
      ...getColumnSearchProps('participant_name', 'nama mahasiswa'),
    },
    {
      title: 'Hasil Akhir',
      dataIndex: 'result',
      width: '10%',
      align: 'center',
      render: (item, record) =>
        <>{record.result.toFixed(4)}</>
    },
    {
      title: 'Rangking',
      dataIndex: 'rangking',
      width: '10%',
      align: 'center'
    }];

  const getDate = (datetime) => {
    let tanggal = new Date(datetime);
    let day = tanggal.toLocaleDateString("id-ID", { day: 'numeric' })
    let month = tanggal.toLocaleDateString("id-ID", { month: 'long' })
    let year = tanggal.toLocaleDateString("id-ID", { year: 'numeric' })
    let waktu = tanggal.toLocaleTimeString("en-US")
    return `${day} ${month} ${year} pada pukul ${waktu}`
  }

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      {data.rangking.length !== 0 && (
        <div style={{ paddingBottom: "20px" }}>
          <Alert
            message="Catatan"
            description={`Generate perangkingan terakhir dilakukan pada tanggal ${getDate(data.date)}.`}
            type="info"
            showIcon
            closable />
        </div>
      )}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6} style={{ padding: "10px" }}>
              <Button loading={loadings[1]} onClick={() => generatePerangkingan(1)} type="primary" htmlType="submit" className="px-3" id="generate" style={{ backgroundColor: "#339900", borderColor: "#339900" }}>
                Generate Perangkingan
              </Button>
            </CCol>
            <CCol sm={6} style={{ textAlign: "right", padding: "10px" }}>
              <Button loading={loadings[2]} onClick={() => eksporPerangkingan(2)} type="primary" htmlType="submit" className="px-3">
                Ekspor Data Pendukung
              </Button>
            </CCol>
            <h6>Tabel perangkingan kecocokan mahasiswa dengan perusahaan</h6>
            <Table rowKey={"id"} columns={columns} dataSource={createNewArr(data.rangking === undefined ? [] : data.rangking)} bordered pagination={false} scroll={{ y: 300, x: "max-content" }} />
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Perangkingan
