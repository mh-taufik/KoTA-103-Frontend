import React, {
  useEffect, useState
} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import Chart, {
  CommonSeriesSettings, Legend, SeriesTemplate, Animation, ArgumentAxis, Tick, Title, Tooltip, ValueAxis
} from 'devextreme-react/chart';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Table } from 'antd'
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Dashboard = () => {
  let history = useHistory();
  const [timeline, setTimeline] = useState([])
  const [date, setDate] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  axios.defaults.withCredentials = true;

  const getData = (data) => {
    for (var i = 0; i < data.length; i++) {
      data[i].start_date = new Date(data[i].start_date);
      data[i].end_date = new Date(data[i].end_date);
    }
    return data;
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: "center",
      render: (value, item, index) => {
        return index + 1
      }
    },
    {
      title: 'Nama Kegiatan',
      dataIndex: 'name',
      width: '40%'
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      align: "center"
    }];

  useEffect(() => {
    const getTimeline = async () => {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/timeline`)
        .then(function (response) {
          setTimeline(response.data.data)
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

    const getDates = (tanggal) => {
      let date = new Date(tanggal)
      return `${date.getDate()} ${date.toLocaleDateString('id-EN', { month: "long" })} ${date.getFullYear()}`
    }

    const getDate = async () => {
      let data = []
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/3`)
        .then(function (response) {
          data.push({
            id: 1,
            name: "Pengisian Prerequisite Perusahaan",
            tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
          })
          axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/11`)
            .then(function (response) {
              data.push({
                id: 2,
                name: "Pelaksanaan Kegiatan KP",
                tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
              })
              axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/12`)
                .then(function (response) {
                  data.push({
                    id: 3,
                    name: "Pelaksanaan Kegiatan PKL",
                    tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                  })
                  axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/5`)
                    .then(function (response) {
                      data.push({
                        id: 4,
                        name: "Evaluasi Peserta KP",
                        tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                      })
                      axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/6`)
                        .then(function (response) {
                          data.push({
                            id: 5,
                            name: "Evaluasi 1 Peserta PKL",
                            tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                          })
                          axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/7`)
                            .then(function (response) {
                              data.push({
                                id: 6,
                                name: "Evaluasi 2 Peserta PKL",
                                tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                              })
                              axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/8`)
                                .then(function (response) {
                                  data.push({
                                    id: 7,
                                    name: "Evaluasi 3 Peserta PKL",
                                    tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                                  })
                                  axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/9`)
                                    .then(function (response) {
                                      data.push({
                                        id: 8,
                                        name: response.data.data.name,
                                        tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                                      })
                                      axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}management-content/form-submit-time/10`)
                                        .then(function (response) {
                                          data.push({
                                            id: 9,
                                            name: response.data.data.name,
                                            tanggal: getDates(response.data.data.start_date) + " - " + getDates(response.data.data.end_date),
                                          })
                                          setDate(data)
                                          setIsLoading(false)
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
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

    if (localStorage.getItem("id_role") === "2") {
      getDate();
    } else {
      getTimeline();
    }

  }, [history]);

  const customizeTooltip = (arg) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var start_date = new Date(arg.point.data.start_date);
    var end_date = new Date(arg.point.data.end_date);
    return {
      text: `<b>${arg.point.data.description}</b> <br> ${start_date.toLocaleDateString("en-GB", options)} - ${end_date.toLocaleDateString("en-GB", options)}`,
    };
  }

  return isLoading ? (<Spin indicator={antIcon} />) : (
    <>
      {localStorage.getItem("id_role") === "2" ? (
        <>
          <CCard className="mb-4">
            <CCardHeader style={{ paddingLeft: "20px", textAlign: "center" }}>
              <h5><b>Selamat datang di aplikasi KP/PKL <br />Terimakasih telah bersedia menjadi mitra kami.</b></h5>
            </CCardHeader>
            <CCardBody style={{ paddingLeft: "20px" }}>
              <h6>Tabel jadwal penting kegiatan KP/PKL</h6>
              <Table columns={columns} dataSource={date} rowKey="id" pagination={false} bordered scroll={{x: "max-content"}}/>
            </CCardBody>
          </CCard>
        </>
      ) : (
        <>
          <div style={{ background: '#fff', padding: 24, minHeight: 700 }}>
            <div style={{ overflowX: "scroll" }}>
              <Chart id="chart" dataSource={(getData(timeline).sort((a, b) => a.start_date < b.start_date ? 1 : -1))} barGroupPadding={0.4} rotated={true}>
                <ArgumentAxis>
                  <Tick visible={false} />
                </ArgumentAxis>
                <ValueAxis>
                </ValueAxis>
                <Title horizontalAlignment={"left"} text={`Kegiatan ${localStorage.getItem("id_prodi") === "0" ? "Kerja Praktik" : "Praktik Kerja Lapangan"}`} />
                <CommonSeriesSettings
                  type="rangeBar"
                  argumentField="name"
                  rangeValue1Field="start_date"
                  rangeValue2Field="end_date"
                  barOverlapGroup="description"
                />
                <Legend visible={false} orientation="horizontal" verticalAlignment="bottom" horizontalAlignment="left" />
                <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
                <SeriesTemplate nameField="name" />
                <Animation enabled={true} />
              </Chart>
            </div>
          </div>
        </>)}
    </>
  )
}

export default Dashboard
