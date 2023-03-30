import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
  CCard,
  CCardBody,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileDownload, faScroll } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Alert, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const FileDownload = require('js-file-download');
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const DataMahasiswa = () => {
  const history = useHistory();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true)
  const [loadings, setLoadings] = useState([])

  const detailCV = (id_cv) => {
    history.push(`/dataMahasiswa/detailCV/${id_cv}`);
  }
  const enterLoading = index => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  }
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getCV = async () => {
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv-by-company`)
        .then(function (response) {
          setData(response.data.data)
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
    getCV();
  }, [history]);

  const exportPDF = async (item, index) => {
    enterLoading(index)
    axios.defaults.withCredentials = true;
    await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/cv/${item.id_cv}/export`, {
      responseType: 'blob',
    })
      .then((response) => {
        // notification.success({
        //   message: 'Ekspor CV berhasil',
        // });
        FileDownload(response.data, `Data CV ${item.name}`);
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }).catch((error) => {
        // notification.error({
        //   message: 'Ekspor CV gagal'
        // });
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      });
  }

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      {data.length === 0 && (
        <>
          <Alert
            message="Catatan"
            description="Pemetaan mahasiswa belum dilakukan atau tidak ada peserta yang dialokasikan ke perusahaan Anda."
            type="info"
            showIcon
            closable />
        </>
      )}
      {data ?
        <>
          {data.map((item, i) => (
            <CCard className="mb-4" key={i} style={{overflowX: "scroll"}}>
              <CCardBody>
                <Row align='middle'>
                  <Col span={2}>
                    <FontAwesomeIcon icon={faScroll} style={{ width: "50px", height: "50px" }} />
                  </Col>
                  <Col span={16}>
                    {item.name}
                  </Col>
                  <Col span={3} style={{ textAlign: "center" }}>
                    <Button
                      id="detail"
                      size="small"
                      shape="round"
                      style={{ color: "black", background: "#FBB03B" }}
                      onClick={() => detailCV(item.id_cv)}
                    >
                      <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
                    </Button>
                  </Col>
                  <Col span={3} style={{ textAlign: "center" }}>
                    <Button
                      id="download"
                      size="small"
                      shape="round"
                      loading={loadings[`cv-${item.id_cv}`]}
                      style={{ color: "white", background: "#3399FF" }}
                      onClick={() => exportPDF(item, `cv-${item.id_cv}`)}
                    >
                      <FontAwesomeIcon icon={faFileDownload} style={{ paddingRight: "5px" }} /> Export
                    </Button>
                  </Col>
                </Row>
              </CCardBody>
            </CCard>
          ))}
        </> :
        <>
          <CCard>
            <CCardBody>
              <Row align="middle" justify="space-around">
                <Col><h3 style={{ paddingTop: "10px" }}>Pemetaan Belum dilakukan</h3></Col>
              </Row>
            </CCardBody>
          </CCard>
        </>}
    </>
  )
}

export default DataMahasiswa
