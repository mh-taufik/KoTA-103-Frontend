import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Table, Button, Form, Select, Input, Space, Row, Col, Tooltip, notification, Alert, Spin, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import _ from "lodash";
import axios from 'axios';

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import { useHistory } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Finalisasi = () => {
  let searchInput;
  let history = useHistory();
  const [form] = Form.useForm();
  const [state, setState] = useState({ searchText: '', searchedColumn: '', })
  const [perusahaan, setPerusahaan] = useState("");
  const [mahasiswa, setMahasiswa] = useState("");
  const [dataRankPeserta, setDataRankPeserta] = useState([]);
  const [dataPerusahaan, setDataPerusahaan] = useState([]);
  const [dataMahasiswa, setDataMahasiswa] = useState([]);
  const [dataPemetaan, setDataPemetaan] = useState({});
  const [dataP, setDataP] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([]);
  const [isCompanySelected, setIsCompanySelected] = useState(false);
  axios.defaults.withCredentials = true;

  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }

  const refreshData = (index) => {
    let data = {
      is_final: "",
      final_mapping: [],
      publish_date: "",
      final_date: "",
    }
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final`).then(result => {
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
      data.is_publish = result.data.data.is_publish
      data.publish_date = result.data.data.publish_date
      data.final_date = result.data.data.final_date
      setDataPemetaan(data)
      setDataP(data)
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    })
  }

  useEffect(() => {
    async function getDataMapping() {
      let data = {
        is_final: "",
        final_mapping: [],
        publish_date: "",
        final_date: "",
      }
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final`)
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
          data.is_publish = result1.data.data.is_publish
          data.publish_date = result1.data.data.publish_date
          data.final_date = result1.data.data.final_date
          setDataPemetaan(data)
          setDataP(data)
          axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}company/get-all?type=dropdown`)
            .then(result2 => {
              setDataPerusahaan(result2.data.data)
              axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-all?type=dropdown`)
                .then(result3 => {
                  setDataMahasiswa(result3.data.data)
                  setIsLoading(false)
                })
            })
        })
        .catch(function (error) {
          // if (error.toJSON().status >= 300 && error.toJSON().status <= 399) {
          //   history.push({
          //     pathname: "/login",
          //     state: {
          //       session: true,
          //     }
          //   });
          // } else if (error.toJSON().status >= 400 && error.toJSON().status <= 499) {
          //   history.push("/404");
          // } else if (error.toJSON().status >= 500 && error.toJSON().status <= 599) {
          //   history.push("/500");
          // }
        });
    }
    getDataMapping()
  }, [history]);

  const filterPerusahaan = data => {
    const result = [];
    let jumlah;
    data.forEach((item, i) => {
      jumlah = dataPemetaan.final_mapping.filter(itemPemetaan => itemPemetaan.company.name === item.name).length;
      if (jumlah !== item.quota || jumlah === 0) {
        result.push({
          id: item.id,
          name: item.name,
          quota: item.quota,
          pemetaan: jumlah
        })
      }
    })
    return result;
  }

  // const filterMahasiswa = data => {
  //   const result = [];
  //   data.forEach((item, i) => {
  //     if (dataPemetaan.final_mapping.filter(itemPemetaan => itemPemetaan.participant.name === item.name).length === 0) {
  //       result.push(item)
  //     }
  //   })
  //   return result;
  // }

  const addPemetaan = async (index) => {
    enterLoading(index)
    setIsCompanySelected(false)
    if (dataPemetaan.is_final === 0) {
      await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final/create`, {
        company_id: perusahaan,
        participant_id: mahasiswa
      }).then((response) => {
        refreshData(index);
        notification.success({
          message: 'Peserta berhasil dipetakan'
        });
        form.resetFields();
        setDataRankPeserta([]);
      }).catch((error) => {
        form.resetFields();
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        notification.error({
          message: 'Peserta gagal dipetakan!'
        });
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      });
    } else {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.warning({
        message: 'Tidak dapat mengubah data pemetaan, dikarenakan pemetaan telah difinalisasi'
      });
    }

  }

  const showDelete = (data, index) => {
    Modal.confirm({
      title: "Konfirmasi hapus peserta yang dialokasikan",
      okText: "Ya",
      onOk: () => {
        deletePemetaan(data, index)
      }
    })
  }

  const deletePemetaan = async (data, index) => {
    enterLoading(index)
    if (dataPemetaan.is_final === 0) {
      await axios.delete(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final/delete/${data.participant.id}`)
        .then((response) => {
          refreshData(index);
          notification.success({
            message: 'Peserta berhasil dihapus'
          });
          form.resetFields();
        }).catch((error) => {
          form.resetFields();
          setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
          });
          notification.error({
            message: 'Peserta gagal dihapu!'
          });
        });
    } else {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      notification.warning({
        message: 'Tidak dapat mengubah data pemetaan, dikarenakan pemetaan telah difinalisasi'
      });
    }
  }

  const handleOkCreate = async (status, index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final/submit`)
      .then((response) => {
        refreshData(index);
        notification.success({
          message: status === 0 ? 'Pemetaan berhasil difinalisasi' : 'Finalisasi berhasil dibatalkan'
        });
        form.resetFields();
      }).catch((error) => {
        form.resetFields();
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        notification.error({
          message: 'Status finalisasi gagal diubah!'
        });
      });
  }

  const finalisasi = (status, index) => {
    if (dataPemetaan.final_mapping.length === dataMahasiswa.length) {
      if (status === 0) {
        Modal.confirm({
          title: "Setelah difinalisasi, peserta dapat melihat hasil pemetaan yang telah dilakukan!",
          content: "Pastikan semua isian data sudah benar, Finalisasi data pemetaan mahasiswa?",
          okText: "Ya",
          onOk: () => {
            handleOkCreate(status, index)
          }
        })
      } else {
        Modal.confirm({
          title: "Setelah dibatalkan, peserta tidak dapat melihat hasil pemetaan yang telah dilakukan!",
          content: "Apakah anda yakin ingin membatalkan finalisasi data pemetaan mahasiswa?",
          okText: "Ya",
          onOk: () => {
            handleOkCreate(status, index)
          }
        })
      }
    } else {
      notification.error({
        message: "Pemetaan tidak dapat difinalisasi sebelum seluruh mahasiswa sudah teralokasikan!"
      });
    }
  }

  const publish = (index) => {
    if (dataPemetaan.is_final === 1) {
      Modal.confirm({
        title: "Setelah diumumkan, perusahaan dapat melihat mahasiswa yang dialokasikan pada perusahaannya!",
        content: "Pastikan semua isian data sudah benar, umumkan data pemetaan pada perusahaan?",
        okText: "Ya",
        onOk: () => {
          handleOkPublish(index)
        }
      })
    } else {
      notification.error({
        message: "Pemetaan tidak dapat diumumkan ke perusahaan sebelum dilakukan finalisasi!"
      });
    }
  }

  const handleOkPublish = async (index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/final/publish`)
      .then((response) => {
        refreshData(index);
        notification.success({
          message: "Hasil pemetaan telah berhasil diumumkan ke perusahaan"
        });
        form.resetFields();
      }).catch((error) => {
        form.resetFields();
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        notification.error({
          message: 'Status finalisasi gagal diubah!'
        });
      });
  }

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

  const handleSearch = (selectedKeys, confirm, dataIndex, index) => {
    enterLoading(index)
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    let data = {
      is_final: "",
      final_mapping: [],
      publish_date: "",
      final_date: "",
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
        data.is_publish = result1.data.data.is_publish
        data.publish_date = result1.data.data.publish_date
        data.final_date = result1.data.data.final_date
        if (selectedKeys[0] === undefined) {
          setDataPemetaan(data)
        } else {
          setDataPemetaan({
            final_mapping: data.final_mapping.filter(item => item.participant.name.includes(selectedKeys[0])),
            is_final: data.is_final,
            is_publish: data.is_publish
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
    refreshData(index)
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
    let kolom = [{
      title: 'Nama Perusahaan',
      dataIndex: 'company.name',
      align: 'center',
      width: '40%',
      onCell: (record) => { return { rowSpan: record.rowSpan } },
      render(_, row) {
        return <>
          <Row align="middle">
            <Col >
              {row.company.name}
            </Col>
            <Col style={{ paddingLeft: "10px" }}>
              {dataP && dataP.final_mapping.filter(item => item.company.name === row.company.name).length === dataPerusahaan.find(item => item.name === row.company.name).quota ?
                <Tooltip placement="right" title="Kuota terpenuhi">
                  <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white", fontSize: "11px" }}>
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                </Tooltip>
                :
                <Tooltip placement="right" title="Kuota belum terpenuhi">
                  <Button type="primary" shape="circle" size="small" style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white", fontSize: "11px" }}>
                    !
                  </Button>
                </Tooltip>
              }
            </Col>
          </Row>
        </>
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
      render: (_, record) => { return dataPerusahaan.find(item => item.name === record.company.name).quota }
    },
    {
      title: 'Nama Mahasiswa',
      dataIndex: 'participant.name',
      width: '30%',
      ...getColumnSearchProps('participant.name', 'nama mahasiswa'),
      render: (item, record) =>
        <>{record.participant.name}</>
    }]

    if (dataPemetaan.is_publish === 0) {
      kolom.push({
        title: 'Aksi',
        dataIndex: 'action',
        width: '20%',
        align: "center",
        render: (value, item, index) =>
          <>
            <Button
              type="primary"
              shape="circle"
              size="small"
              disabled={dataPemetaan.is_final === 1}
              loading={loadings[`delete-${index + 2}`]}
              style={{ backgroundColor: "#CC0033", borderColor: "#CC0033", color: "white", fontSize: "11px" }}
              onClick={() => showDelete(item, `delete-${index + 2}`)}>
              {loadings[`delete-${index + 2}`] === false || loadings[`delete-${index + 2}`] === undefined ? <FontAwesomeIcon icon={faX} /> : ""}
            </Button>
          </>
      })
    }
    return kolom
  }

  const getAllKuota = () => {
    let total = 0
    dataPerusahaan.map((item) => {
      return total += parseInt(item.quota)
    })

    return total
  }

  const getNeedKuota = () => {
    let total = dataMahasiswa.length - getAllKuota()
    return total
  }

  const changeCompany = async (value) => {
    setPerusahaan(value)
    setIsCompanySelected(true)
    setDataRankPeserta([])
    let data = [];
    axios.defaults.withCredentials = true;
    let no = 0;
    await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}mapping/get-participant-by-company/${value}`)
      .then(result => {
        result.data.data.map(item => {
          no = no + 1
          return data.push({
            id: item.id,
            name: `${item.name} ${item.value !== 0 ? `(${(item.value * 100).toFixed(2)}%${no === 1 ? " direkomendasikan" : ""})` : ""}`
          })

        })
        setDataRankPeserta(data)
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
      {getNeedKuota() > 0 && (
        <div style={{ paddingBottom: "20px" }}>
          <Alert
            message="Catatan"
            description={<>Jumlah kuota seluruh perusahaan belum memenuhi jumlah seluruh mahasiswa. Dibutuhkan <b>{getNeedKuota()} kuota</b> untuk memenuhi jumlah seluruh mahasiswa</>}
            type="error"
            showIcon
            closable />
        </div>
      )}

      {dataPemetaan.is_final === 0 && (
        <div style={{ paddingBottom: "20px" }}>
          <Alert
            message="Catatan"
            description="Pilih perusahaan terlebih dahulu, lalu pilih mahasiswa."
            type="info"
            showIcon
            closable />
        </div>
      )}
      {dataPemetaan.is_final === 1 && (
        <div style={{ paddingBottom: "20px" }}>
          <Alert
            message="Catatan"
            description={<>
              <>1. Finalisasi pemetaan terakhir dilakukan pada tanggal {getDate(dataPemetaan.final_date)}.</><br />
              {dataPemetaan.is_publish === 1 && <>2. Umumkan ke perusahaan terakhir dilakukan pada tanggal {getDate(dataPemetaan.publish_date)}.</>}
            </>}
            type="info"
            showIcon
            closable />
        </div>
      )}

      <Row justify="end">
        <Col style={{ textAlign: "center", paddingBottom: "15px", paddingRight: "15px" }}>
          {dataPemetaan.is_final === 0 ? (
            <Tooltip placement="top" title="Pemetaan belum di finalisasi">
              <Button
                type="primary"
                htmlType="submit"
                className="px-3"
                disabled={true}
                style={{ color: "black", background: "#BBB11A", borderColor: "#BBB11A" }}>
                Umumkan ke perusahaan
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              className="px-3"
              id={dataPemetaan.is_publish === 0 ? "publish" : "false"}
              disabled={dataPemetaan.is_publish === 1 ? true : false}
              loading={loadings[5]}
              style={dataPemetaan.is_publish === 0 ? { color: "black", background: "#FCEE21", borderColor: "#FCEE21" } : { color: "black", background: "#BBB11A", borderColor: "#BBB11A" }}
              onClick={() => publish(5)}>
              Umumkan ke perusahaan
            </Button>
          )}

        </Col>
        <Col style={{ textAlign: "center", paddingBottom: "15px" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="px-3"
            loading={loadings[0]}
            id={dataPemetaan && dataPemetaan.is_final === 0 ? "finalisasi" : "batalFinalisasi"}
            disabled={dataPemetaan.is_publish === 1 ? true : false}
            style={dataPemetaan && dataPemetaan.is_final === 0 ? { backgroundColor: "#00AF8F", borderColor: "#00AF8F" } : dataPemetaan.is_publish === 1 ? { color: "white", background: "#900427", borderColor: "#900427" } : { color: "white", background: "#CC0033", borderColor: "#CC0033" }}
            onClick={() => finalisasi(dataPemetaan.is_final, 0)}>
            {dataPemetaan && dataPemetaan.is_final === 0 ? "Finalisasi" : "Batal Finalisasi"}
          </Button>
        </Col>
      </Row>

      <CCard className="mb-4">
        <CCardBody>
          <Form
            form={form}
            name="basic"
            wrapperCol={{ span: 24 }}
            onFinish={() => addPemetaan(1)}
            autoComplete="on"
          >
            <CRow>
              <CCol sm={5} style={{ padding: "10px" }}>
                Nama perusahaan yang bisa dialokasikan
                <Form.Item
                  name="perusahaan"
                  rules={[{ required: true, message: 'Nama perusahaan tidak boleh kosong!' }]}
                >
                  <Select disabled={dataPemetaan.is_final === 1} onSelect={(value) => changeCompany(value)}>
                    {filterPerusahaan(dataPerusahaan).map((item, i) =>
                      <Select.Option key={i} value={item.id}>
                        <>
                          {item.name}{item.pemetaan === 0 ? <span style={{ color: "red" }}> *belum dialokasikan sama sekali</span> : ` (tersisa ${item.quota - item.pemetaan} kuota)`}
                        </>
                      </Select.Option>)}
                  </Select>
                </Form.Item>
              </CCol>
              {dataPemetaan.final_mapping.length < dataMahasiswa.length ? (
                <CCol sm={5} style={{ padding: "10px" }}>
                  Nama mahasiswa yang belum dialokasikan
                  <Form.Item
                    name="mahasiswa"
                    rules={[{ required: true, message: 'Nama Mahasiswa tidak boleh kosong!' }]}
                  >
                    <Select
                      onSelect={(value) => setMahasiswa(value)}
                      notFoundContent={!(dataRankPeserta && dataRankPeserta.length > 0) ? <Spin size="small" /> : ""}
                      disabled={dataPemetaan.is_final === 1 ? true : (dataRankPeserta && isCompanySelected) ? false : true}
                    >
                      {dataRankPeserta && dataRankPeserta.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </CCol>
              ) : (
                <CCol sm={5} style={{ padding: "10px" }}>
                  Nama mahasiswa yang belum dialokasikan
                  <Form.Item
                    name="mahasiswa"
                    rules={[{ required: true, message: 'Nama Mahasiswa tidak boleh kosong!' }]}
                  >
                    <Tooltip placement="top" title="Semua mahasiswa sudah teralokasikan">
                      <Select
                        onSelect={(value) => setMahasiswa(value)}
                        disabled={true}
                      >
                        {dataRankPeserta && dataRankPeserta.map((item, i) => <Select.Option key={i} value={item.id}>{item.name}</Select.Option>)}
                      </Select>
                    </Tooltip>
                  </Form.Item>
                </CCol>
              )}

              <CCol sm={2} style={{ textAlign: "center", padding: "10px" }}>
                <br></br>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="px-4"
                  id="generate"
                  disabled={dataPemetaan.is_final === 1}
                  loading={loadings[1]}
                  style={{ backgroundColor: "#339900", borderColor: "#339900", color: "white" }}>
                  {loadings[1] === false || loadings[1] === undefined ? "+" : ""}
                </Button>
              </CCol>
            </CRow>
          </Form>
          <CRow>
            <h6>Tabel pemetaan mahasiswa dengan perusahaan</h6>
            <Table scroll={{ x: "max-content" }} rowKey="id" columns={dataPemetaan && getColumns()} dataSource={createNewArr(dataPemetaan.final_mapping)} pagination={false} bordered />
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Finalisasi
