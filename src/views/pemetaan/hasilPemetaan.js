import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Table, Button, Input, Space, Alert, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import _ from "lodash";

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'

import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const HasilPemetaan = () => {
  let searchInput;
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  const [dataPemetaan, setDataPemetaan] = useState([])
  const [loadings, setLoadings] = useState([]);
  const [dataP, setDataP] = useState([])
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true)
  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function getDataMapping() {
      let data = {
        is_final: "",
        final_mapping: []
      }
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final`)
        .then(result => {
          result.data.data.final_mapping.map(item => {
            return item.participant.map(item2 => {
              return data.final_mapping.push({
                id: item.company.company_name + item2.name,
                company: item.company,
                participant: item2
              })
            })
          })
          data.is_final = result.data.data.is_final
          setDataPemetaan(data)
          setDataP(data)
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
    getDataMapping()
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
    let data = {
      is_final: "",
      final_mapping: []
    }
    axios.defaults.withCredentials = true;
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final`)
      .then(result1 => {
        result1.data.data.final_mapping.map(item => {
          return item.participant.map(item2 => {
            return data.final_mapping.push({
              id: item.company.company_name + item2.name,
              company: item.company,
              participant: item2
            })
          })
        })
        data.is_final = result1.data.data.is_final
        if (selectedKeys[0] === undefined) {
          setDataPemetaan(data)
        } else {
          setDataPemetaan({
            final_mapping: data.final_mapping.filter(item => item.participant.name.includes(selectedKeys[0])),
            is_final: data.is_final
          })
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
    setState({ searchText: '' });
    handleSearch(selectedKeys, confirm, dataIndex, index)
  };

  const createNewArr = (data) => {
    return data.reduce((result, item) => {
      //First, take the name field as a new array result
      if (result.indexOf(item.company) < 0) {
        result.push(item.company)
      }
      return result
    }, []).reduce((result, name) => {
      //Take the data with the same name as a new array, and add a new field * * rowSpan inside it**
      const children = data.filter(item => item.company === name);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0,//Add the first row of data to the rowSpan field
        }))
      )
      return result;
    }, [])
  }

  const getColumns = () => {
    return [{
      title: 'Nama Perusahaan',
      dataIndex: 'company.name',
      align: 'center',
      width: '40%',
      onCell: (record) => { return { rowSpan: record.rowSpan } },
      render(_, row) {
        return <>{row.company.name}</>
      },
      filterSearch: true,
      filterMode: 'tree',
      filters: dataPemetaan && _.uniqWith(filterData(dataPemetaan.final_mapping)(i => i.company.name), _.isEqual),
      onFilter: (value, record) => record.company.name.includes(value)
    },
    {
      title: 'Kuota',
      dataIndex: 'company.quota',
      width: '10%',
      align: "center",
      onCell: (record) => { return { rowSpan: record.rowSpan } },
      render: (_, record) => { return record.company.quota }
    },
    {
      title: 'Nama Mahasiswa',
      dataIndex: 'participant.name',
      width: '30%',
      ...getColumnSearchProps('participant.name', 'nama mahasiswa'),
      render: (item, record) =>
        <>{record.participant.name}</>
    }]
  }
  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      {dataPemetaan.final_mapping.length > 0 || dataP.final_mapping.length > 0 ?
        <>
          {localStorage.getItem("id_role") === "1" ?
            <>
              {dataPemetaan.is_final === 1 ?
                <>
                  <CCard className="mb-4">
                    <CCardBody style={{ paddingLeft: "20px" }}>
                      <CRow>
                        <CCol sm={12}>
                          <Table rowKey="id" columns={dataPemetaan && getColumns()} dataSource={createNewArr(dataPemetaan.final_mapping)} pagination={false} scroll={{ y: 300, x: "max-content" }} bordered />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </> :
                <>
                  <Alert
                    message="Catatan"
                    description="Pemetaan mahasiswa belum dilakukan."
                    type="info"
                    showIcon
                    closable />
                </>}
            </> :
            <>
              <CCard className="mb-4">
                <CCardBody style={{ paddingLeft: "20px" }}>
                  <CRow>
                    <CCol sm={12}>
                      <h6>Tabel hasil pemetaan mahasiswa dengan perusahaan</h6>
                      <Table rowKey="id" columns={dataPemetaan && getColumns()} dataSource={createNewArr(dataPemetaan.final_mapping)} pagination={false} scroll={{ y: 300, x: "max-content" }} bordered />
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </>}

        </> :
        <>
          <Alert
            message="Catatan"
            description="Pemetaan mahasiswa belum dilakukan."
            type="info"
            showIcon
            closable />
        </>}

    </>
  )
}

export default HasilPemetaan
