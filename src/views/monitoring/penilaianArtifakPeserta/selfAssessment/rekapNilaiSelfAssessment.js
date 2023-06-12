import React, { useState, useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import '../../pengisianDokumen/rpp/rpp.css'
import { Table } from 'react-bootstrap'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { Card, Col, FloatButton, Progress, Row, Space, Tooltip } from 'antd'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapSelfAssessment = () => {
  const params = useParams()
  const ID_PARTICIPANT = params.id
  const [dataPeserta, setDataPeserta]=useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [komponenPenilaianSelfAssessment, setKomponenPenilaianSelfAssessment] = useState([])
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
 
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [data, setData] = React.useState()
  const handlePopoverOpen = (event, data) => {
    setAnchorEl(event.currentTarget)
    setData(data)
    // console.log(data)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handlePopOverData = () => {
    return <Typography sx={{ p: 1 }}>{data}</Typography>
  }

  const open = Boolean(anchorEl)


  useEffect(() => {

    async function getSelfAssessmentAspect (){
      await axios
      .get(
        `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/get?type=active`,
      )
      .then((result) => {
        console.log(result.data.data)

        setKomponenPenilaianSelfAssessment(result.data.data)
        setIsLoading(false)
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

    const getSelfAssessment = async (index) => {
   
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get-all/${ID_PARTICIPANT}`,
        )
        .then((result) => {
          console.log(result.data.data)

          let temp = []
          const len = result.data.data.length
          const temp1 = JSON.parse(JSON.stringify(result.data.data))

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
            console.log(month_of_date, 'isi date monts', month_of_date)
            return `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}`
          }

          if (result.data.data.length > 0) {
            console.log('RESY')
            var getTempSelfAssessment = function (obj) {
              for (var i in obj) {
                // console.log(i, len-1, '==', parseInt(i)===(len-1))
                if (parseInt(i) === len - 1) {
                  break
                }
                temp.push({
                  start_date: convertDate(obj[i].start_date),
                  finish_date: convertDate(obj[i].finish_date),
                  self_assessment_id: obj[i].self_assessment_id,
                  participant_id: obj[i].participant_id,
                  grade : obj[i].grade
                })
              }
            }

            getTempSelfAssessment(temp1)
            setSelfAssessmentPeserta(temp)
            setIsLoading(false)
            return
          } else {
            setSelfAssessmentPeserta(result.data.data)
            setIsLoading(false)
            return
          }
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
          } else if (error.toJSON().status > 500 && error.toJSON().status <= 599) {
            history.push('/500')
          } else if (error.toJSON().status === 500) {
            setSelfAssessmentPeserta(undefined)
            setIsLoading(false)
          }
        })
    }


    getDataInformasiPeserta() 
 
  }, [history])

 

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

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="INFORMASI SELF ASSESSMENT " size="small">
          <Row style={{ padding: 10 }}>
            <Col span={8}>
              <b>Hasil Penilaian Self Assessment</b>
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col>&nbsp;&nbsp;</Col>
            <Col span={4}>Sangat Baik (84-100) </Col>
            <Col span={8}>
              {' '}
              <Progress
                percent={99.9}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col>&nbsp;&nbsp;</Col>
            <Col span={4}>Baik (74-83) </Col>
            <Col span={8}>
              {' '}
              <Progress
                percent={99.9}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col>&nbsp;&nbsp;</Col>
            <Col span={4}>Cukup (60-73) </Col>
            <Col span={8}>
              {' '}
              <Progress
                percent={99.9}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col>&nbsp;&nbsp;</Col>
            <Col span={4}>Kurang (0-59) </Col>
            <Col span={8}>
              {' '}
              <Progress
                percent={99.9}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Col>
          </Row>
        </Card>
      </Space>
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
   
      {title('REKAP PENILAIAN SELF ASSESSMENT PESERTA')}

      <div className="container2">
        {/* <button onClick={tes}>tes</button> */}

        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal Mulai</th>
              {selfAssessmentPeserta.map((data, index) => (
                <th key={data.id}>{data.aspect_name}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          {/* <tbody>
            {selfAssessmentPeserta.map((sa, index) => (
              <tr key={sa.id}>
                <td>{index + 1}</td>
                <td>{sa.tanggalmulai}</td>
                {sa.grade.map((nilaipoin, index) => (
                  <td key={nilaipoin.id}>
                    {' '}
                    <Tooltip title={nilaipoin.keterangan}>{nilaipoin.nilai}</Tooltip>
                  </td>
                ))}
                <td>
                  {' '}
                  <Tooltip >89</Tooltip>
                </td>
              </tr>
            ))}
            <tr>
              <td>#</td>
              <td>Performansi Terbaik</td>
              <td>
              <Tooltip >89</Tooltip>
              </td>
              <td>
                 <Tooltip >89</Tooltip>
              </td>
              <td>
                 <Tooltip >89</Tooltip>
              </td>
              <td>
                 <Tooltip >89</Tooltip>
              </td>
              <td>
                 <Tooltip >89</Tooltip>
              </td>
              <td>
                 <Tooltip >89</Tooltip>
              </td>
              <td>
                 <Tooltip >89</Tooltip>
              </td>
            </tr>
            <tr>
              <td colSpan={6}>
                <b>NILAI AKHIR SELF ASSESSMENT</b>
              </td>
              <td colSpan={3}>
                <b>88</b>
              </td>
            </tr>
          </tbody> */}
        </Table>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          {handlePopOverData()}
        </Popover>
      </div>
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

export default RekapSelfAssessment
