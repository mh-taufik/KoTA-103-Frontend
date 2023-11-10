import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../../pengisianDokumen/rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Row, Col, Space, Card, Tag, FloatButton, Spin, Progress, Result } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined, FileExclamationOutlined } from '@ant-design/icons'
import { Box } from '@mui/material'
import { Table } from 'reactstrap'

const RekapPenilaianLogbook = () => {
  var params = useParams() //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const history = useHistory()
  axios.defaults.withCredentials = true
  const [isLoading, setIsLoading] = useState(true)
  const ID_PARTICIPANT = params.id
  const [dataPeserta, setDataPeserta] = useState([])
  const [dataNilaiLogbookPeserta, setDataNilaiLogbookPeserta] = useState([])
  const [dataStatistikPeserta, setDataStatistikPeserta] = useState([])
  const [isPesertaHaveLogbook, setIsPesertaHaveLogbook] = useState()
  const usernamePengguna = localStorage.username
  let rolePengguna = localStorage.id_role
  const title = (judul) => {
    return (
      <>
        <div>
          <Row style={{ backgroundColor: '#00474f', padding: 3, borderRadius: 2 }}>
            <Col span={24}>
              <b>
                <h5 style={{ color: '#f6ffed', marginLeft: 30, marginTop: 6 }}>{judul}</h5>
              </b>
            </Col>
          </Row>
        </div>
      </>
    )
  }

  useEffect(() => {
    async function getDataInformasiPeserta() {
      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-by-id`, {
          id: [ID_PARTICIPANT],
        })
        .then((result) => {
          setDataPeserta(result.data.data[0])
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
    const getDataLogbookPeserta = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/logbook/get-all/${ID_PARTICIPANT}`)
        .then((result) => {
        
          if (result.data.data.length > 0) {
            setIsPesertaHaveLogbook(true)
            console.log(result.data.data)
            var temp = result.data.data
            var temp_res = []
            const convertDate = (date) => {
              let temp_date_split = date.split('-')
              const month = [
                'Januari',
                'Februari',
                'Maret',
                'April',
                'Mei',
                'Juni',
                'Juli',
                'Agustus',
                'September',
                'Oktober',
                'November',
                'Desember',
              ]
              let date_month = temp_date_split[1]
              let month_of_date = month[parseInt(date_month) - 1]
              return date
                ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
                : null
            }

            function setKeyIfNull(index, id) {
              return id ? id : index
            }

            function setProjectNameIfNull(project_name) {
              return project_name ? project_name : '-'
            }

            let getTempRes = function (obj) {
              for (var i in obj) {
                temp_res.push({
                  id: setKeyIfNull(parseInt(i), obj[i].id),
                  date: convertDate(obj[i].date),
                  grade: obj[i].grade,
                  status: obj[i].status,
                  project_name: setProjectNameIfNull(obj[i].project_name),
                })
              }
            }

            getTempRes(temp)
            setDataNilaiLogbookPeserta(temp_res)
          } else {
            setDataNilaiLogbookPeserta(undefined)
          }

          axios
            .get(
              `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/statistic/${ID_PARTICIPANT}`,
            )
            .then((res) => {
              setDataStatistikPeserta(res.data.data)
              setIsLoading(false)
            })
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            setIsPesertaHaveLogbook(false)
            setIsLoading(false)
          }
        })
    }

    getDataInformasiPeserta()
    getDataLogbookPeserta()
  }, [history])

  const tagColorStatusHandling = (status) => {
    if (status === 'terlambat') {
      return 'warning'
    } else if (status === 'tepat waktu') {
      return 'success'
    } else if (status === 'belum mengumpulkan') {
      return 'default'
    }
  }

  const tagColorLogbookGradeHandling = (status) => {
    if (status === 'sudah dinilai') {
      return 'green'
    } else if (status === 'belum dinilai') {
      return 'cyan'
    }
  }

  const tagColorPenilaianLogbook = (nilai) => {
    let color
    if (nilai === 'SANGAT BAIK') {
      return 'green'
    } else if (nilai === 'BAIK') {
      return 'cyan'
    } else if (nilai === 'CUKUP') {
      return 'warning'
    } else if (nilai === 'KURANG') {
      return 'magenta'
    } else if (nilai === 'BELUM DINILAI') {
      return 'default'
    }
  }
  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      

      <div>
        <Space
          className="spacebottom"
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <Card title="Informasi Peserta" size="small" style={{ padding: 30 }}>
            <Row style={{ padding: 5 }}>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.name}</Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.nim}</Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={4}>Sistem Kerja</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.work_system}</Col>
            </Row>
            <Row style={{ padding: 5 }}>
              <Col span={4}>Angkatan</Col>
              <Col span={2}>:</Col>
              <Col span={8}>{dataPeserta.year}</Col>
            </Row>
          </Card>
        </Space>
      </div>
      {title('REKAP PENILAIAN LOGBOOK')}
      {isPesertaHaveLogbook && (
        <div className="container2">
          <div>
            <Row style={{ padding: 6 }}>
              <Col span={4}>Logbook Dikumpulkan</Col>
              <Col span={4}>
                <Progress
                  status="active"
                  percent={dataStatistikPeserta.logbook_submitted.percent}
                />
              </Col>
              <Col span={2}>&nbsp;&nbsp;{dataStatistikPeserta.logbook_submitted.count} Dokumen</Col>
              <Col span={2}></Col>
              <Col span={4}>Logbook Tidak Dikumpulkan</Col>
              <Col span={4}>
                <Progress
                  status="exception active"
                  percent={dataStatistikPeserta.logbook_missing.percent}
                />
              </Col>
              <Col span={2}>&nbsp;&nbsp;{dataStatistikPeserta.logbook_missing.count} Dokumen</Col>
            </Row>

            <Row style={{ padding: 6 }}>
              <Col span={4}>Logbook Tepat Waktu</Col>
              <Col span={4}>
                <Progress status="active" percent={dataStatistikPeserta.logbook_on_time.percent} />
              </Col>
              <Col span={2}>&nbsp;&nbsp;{dataStatistikPeserta.logbook_on_time.count} Dokumen</Col>
              <Col span={2}></Col>
              <Col span={4}>Logbook Terlambat</Col>
              <Col span={4}>
                <Progress
                  status="exception active"
                  percent={dataStatistikPeserta.logbook_late.percent}
                />
              </Col>
              <Col span={2}>&nbsp;&nbsp;{dataStatistikPeserta.logbook_late.count} Dokumen</Col>
            </Row>
            <b className="spacetop">Penilaian</b>
            <Row style={{ padding: 6 }}>
              <Col span={4}>Sangat Baik</Col>
              <Col span={4}>
                <Progress
                  status="active"
                  percent={dataStatistikPeserta.logbook_nilai_sangat_baik.percent}
                />
              </Col>
              <Col span={2}>
                &nbsp;&nbsp;{dataStatistikPeserta.logbook_nilai_sangat_baik.count} Dokumen
              </Col>
              <Col span={2}></Col>
            </Row>
            <Row style={{ padding: 6 }}>
              <Col span={4}>Baik</Col>
              <Col span={4}>
                <Progress
                  status="active"
                  percent={dataStatistikPeserta.logbook_nilai_baik.percent}
                />
              </Col>
              <Col span={2}>
                &nbsp;&nbsp;{dataStatistikPeserta.logbook_nilai_baik.count} Dokumen
              </Col>
              <Col span={2}></Col>
            </Row>
            <Row style={{ padding: 6 }}>
              <Col span={4}>Cukup</Col>
              <Col span={4}>
                <Progress
                  status="active"
                  percent={dataStatistikPeserta.logbook_nilai_cukup.percent}
                />
              </Col>
              <Col span={2}>
                &nbsp;&nbsp;{dataStatistikPeserta.logbook_nilai_cukup.count} Dokumen
              </Col>
              <Col span={2}></Col>
            </Row>
            <Row style={{ padding: 6 }}>
              <Col span={4}>Kurang</Col>
              <Col span={4}>
                <Progress
                  status="active"
                  percent={dataStatistikPeserta.logbook_nilai_kurang.percent}
                />
              </Col>
              <Col span={2}>
                &nbsp;&nbsp;{dataStatistikPeserta.logbook_nilai_kurang.count} Dokumen
              </Col>
              <Col span={2}></Col>
            </Row>
            <Row style={{ padding: 6 }}>
              <Col span={4}>Belum Dinilai</Col>
              <Col span={4}>
                <Progress
                  status="active"
                  percent={dataStatistikPeserta.logbook_nilai_belum_dinilai.percent}
                />
              </Col>
              <Col span={2}>
                &nbsp;&nbsp;{dataStatistikPeserta.logbook_nilai_belum_dinilai.count} Dokumen
              </Col>
              <Col span={2}></Col>
            </Row>
          </div>
          <div className="spacebottom"></div>
          <hr />

          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tanggal Logbook</th>
                <th>Nama Proyek</th>
                <th>Status Pengumpulan</th>
                <th>Penilaian</th>
              </tr>
            </thead>
            <tbody>
              {dataNilaiLogbookPeserta.map((data, idx) => {
                return (
                  <tr key={data.id}>
                    <td>{idx + 1}</td>
                    <td>{data.date}</td>
                    <td>{data.project_name}</td>
                    <td>
                      <Tag color={tagColorLogbookGradeHandling(data.status)}>{data.status}</Tag>
                    </td>
                    <td>
                      <Tag color={tagColorPenilaianLogbook(data.grade)}>{data.grade}</Tag>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}

      {!isPesertaHaveLogbook && (
        <div className="container2">
          <Result
            title="Peserta Belum Memiliki Logbook"
            icon={<FileExclamationOutlined />}
            subTitle="Belum ada rekap nilai apapun"
          />
        </div>
      )}
      <FloatButton
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          history.push(`/rekapPenilaianPeserta`)
        }}
        tooltip={<div>Kembali ke Rekap Penilaian Peserta</div>}
      />
    </>
  )
}

export default RekapPenilaianLogbook
