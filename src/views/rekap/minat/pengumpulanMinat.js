import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
  CCard,
  CCardBody,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faPencil, faScroll } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, notification, Alert, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const PengumpulanMinat = () => {
  let history = useHistory();
  const [data, setData] = useState({});
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
  const updateMinat = () => {
    history.push("/pemilihanPerusahaan/updateMinat");
  }
  const detailMinat = () => {
    history.push("/pemilihanPerusahaan/detailMinat");
  }

  const refreshData = (index) => {
    axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/card`).then(function (response) {
      setData(response.data.data)
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    })
  }

  useEffect(() => {
    const getMinat = async () => {
      axios.defaults.withCredentials = true;
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/card`)
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
    getMinat();
  }, [history]);

  const handleMark = async (index) => {
    enterLoading(index)
    await axios.put(`${process.env.REACT_APP_API_GATEWAY_URL}participant/company-selection/mark-as-done`, {
    }).then((response) => {
      refreshData(index)
      notification.success({
        message: data && data.status_submission === false ? 'Tandai selesai berhasil!' : 'Tandai selesai telah dibatalkan!'
      });
    }).catch((error) => {
      notification.error({
        message: 'Proses perubahan gagal!'
      });
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    });
  }
  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      {data.status_update === false ? (
        <div style={{ paddingBottom: "20px" }}>
          <Alert
            message="Catatan"
            description="Formulir Data Pemilihan Perusahaan tidak dapat diisi atau diubah karena diluar waktu yang telah ditetapkan."
            type="info"
            showIcon
            closable />
        </div>
      ) : ""}
      <CCard className="mb-4" style={{overflowX: "scroll"}}>
        <CCardBody>
          <Row align='middle'>
            <Col span={2}>
              <FontAwesomeIcon icon={faScroll} style={{ width: "50px", height: "50px" }} />
            </Col>
            <Col span={data.status_update === true ? 7 : 19}>
              {localStorage.getItem("name") && localStorage.getItem("name")}
            </Col>
            {data.status_update === true ? (
              <Col span={5} style={{ textAlign: "center" }}>
                <Button
                  id={data && data.status_submission === false ? "selesai" : "batal"}
                  size="small"
                  shape="round"
                  loading={loadings[0]}
                  style={data && data.status_submission === false ? { color: "white", background: "#339900" } : { color: "white", background: "#CC0033" }}
                  onClick={() => handleMark(0)}
                >
                  <FontAwesomeIcon icon={faCheck} style={{ paddingRight: "5px" }} /> {data && data.status_submission === false ? "Tandai sebagai selesai" : "Batal tandai selesai"}
                </Button>
              </Col>
            ) : ""}
            <Col span={3} style={{ textAlign: "center" }}>
              <Button
                id="detail"
                size="small"
                shape="round"
                style={{ color: "black", background: "#FBB03B" }}
                onClick={detailMinat}
              >
                <FontAwesomeIcon icon={faEye} style={{ paddingRight: "5px" }} /> Detail
              </Button>
            </Col>
            {data.status_update === true ? (
              <Col span={3} style={{ textAlign: "center" }}>
                <Button
                  id="update"
                  size="small"
                  shape="round"
                  style={{ color: "black", background: "#FCEE21" }}
                  onClick={updateMinat}
                >
                  <FontAwesomeIcon icon={faPencil} style={{ paddingRight: "5px" }} /> Ubah Data Pemilihan Perusahaan
                </Button>
              </Col>
            ) : ""}
          </Row>
        </CCardBody>
      </CCard>
    </>
  )
}

export default PengumpulanMinat
