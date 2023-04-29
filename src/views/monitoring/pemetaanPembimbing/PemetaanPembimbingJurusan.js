import React, { useEffect, useState } from 'react';
  import 'antd/dist/antd.css';
  import {
    CCard,
    CCardBody,
    CCol,
    CRow,
  } from '@coreui/react';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import {
    faPencil,
    faLock,
    faTrashCan,
    faEdit,
    faPen,
  } from '@fortawesome/free-solid-svg-icons'
  import { Tabs, Table, Button, Row, Col, Form, Input, Modal, notification, Radio, Space, Spin } from 'antd';
  import axios from 'axios';
  import { useHistory } from 'react-router-dom';
  import { SearchOutlined } from '@ant-design/icons';
  import Highlighter from 'react-highlight-words';
  import { LoadingOutlined } from '@ant-design/icons';
  
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const { TabPane } = Tabs;
  
  const PemetaanPembimbingJurusan= () => {
    let searchInput;
    const [state, setState] = useState({ searchText: '', searchedColumn: '', })
    const [isLoading, setIsLoading] = useState(true)
    const [key, setKey] = useState("1")
    const [isModaleditVisible, setIsModalEditVisible] = useState(false)
    const [choose, setChoose] = useState([])
    let history = useHistory();
    const [loadings, setLoadings] = useState([]);
    axios.defaults.withCredentials = true;
    const [perusahaan, setPerusahaan] = useState([]);
    const [perusahaanEdit, setPerusahaanEdit] = useState([]);

  
    const enterLoading = index => {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
    }

  
  
    const showModalEdit = (record) => {
      setIsModalEditVisible(true);
      setChoose(record)
  };

  const refreshData = (index) => {

  }

  async function getDataPerPerusahaan (record,index){
    await axios.get(`http://localhost:1337/api/perusahaans/${record}?populate=*`).then(res => {
      console.log(res.data.data)
    }).catch(function(error){
      if(error.toJSON().status >=300 && error.toJSON().status <= 399){
        history.push({
          pathname : "/login",
          state : {
            session:true,
          }
        });
      }else if(error.toJSON().status >=400 && error.toJSON().status <= 499){
        history.push("/404");
      }else if(error.toJSON().status >=500 && error.toJSON().status <= 500){
        history.push("/500");
      }
    })
};


  
    useEffect(() => {
      async function getDataPemetaanPerusahaan() {
        await axios.get('http://localhost:1337/api/perusahaans?populate=*')
          .then(result => {
            setPerusahaan(result.data.data)
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
      getDataPemetaanPerusahaan()
    }, [history]);
  

  
    const columns = [{
      title: 'Nama Perusahaan',
      dataIndex: ['attributes', 'namaperusahaan'],
      width: '40%',
    },
    {
      title: 'Nama Pembimbing Jurusan',
      dataIndex:['attributes', 'pembimbingjurusan', 'data','attributes','nama'],
      width: '30%',
    },
    {
      title: 'id',
      dataIndex:'id',
      width: '30%',
    },
    {
      title: 'Aksi',
      dataIndex: 'action',
      align: 'center', 
      render : (text,record) => (
        <>
        <Row>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Button
              id="button-pencil"
              htmlType="submit"
              shape="circle"
              style={{ backgroundColor: '#FCEE21', borderColor: '#FCEE21' }}
              onClick={() => {
                showModalEdit(record)
                console.log(record)
              }}
            >
              <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
            </Button>
          </Col>

        </Row>
      </>
      )
    
    }];
  
    const onChange = (activeKey) => {
      setKey(activeKey)
    }
    // isLoading ? (<Spin indicator={antIcon} />) : (
    return(
      <>
        <CCard className="mb-4">
          <CCardBody>
            {localStorage.getItem("id_role") === "3" && key === "1" && (
              <>
              
              </>)}
            <CRow>
              <CCol sm={12}>
                
                <Tabs type="card" onChange={onChange}>
                {perusahaan.length > 0 && (<>
                    <TabPane tab="Prodi D3" key="1">
                      <h6>Tabel Pemetaan Perusahaan Prodi D3 </h6>
                      <Table scroll={{x: "max-content"}} columns={columns} dataSource={perusahaan} rowKey="id" bordered />
                    </TabPane>
                  </>)}
                  
                {perusahaan.length > 0 && (<>
                    <TabPane tab="Prodi D4" key="2">
                      <h6>Tabel Pemetaan Perusahaan Prodi D4 </h6>
                      <Table scroll={{x: "max-content"}} columns={columns} dataSource={perusahaan} rowKey="perusahaan." bordered />
                    </TabPane>
                  </>)}
                </Tabs>
              </CCol>
            </CRow>
  
          </CCardBody>
        </CCard>

     
      
      </>
 
    )
  }
  
  export default PemetaanPembimbingJurusan