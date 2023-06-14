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
  const [dataPeserta, setDataPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [komponenPenilaianSelfAssessment, setKomponenPenilaianSelfAssessment] = useState([])
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  axios.defaults.withCredentials = true
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [isNotNullDataSelfAssessment, setIsNotNullDataSelfAssessment] = useState()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const contoller_abort = new AbortController();
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
    async function getSelfAssessmentAspect() {
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/aspect/get`,
        )
        .then((result) => {
          console.log('komponen', result.data.data)

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
        return () => contoller_abort.abort();
    }

    getSelfAssessmentAspect()

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

    const getSelfAssessmentPeserta = async (index) => {
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get-all/${ID_PARTICIPANT}`,
        )
        .then((result) => {
          console.log('sa', result.data.data.length)
          if(result.data.data !== null){
            
          let temp = result.data.data
          let temp1 = []
          let last_index_data = temp.length - 1

          let getTempData = function (obj) {
            for (var i in obj) {
              console.log(i, last_index_data)
              if (last_index_data === parseInt(i)) {
                 break
              } else {
                temp1.push({
                  finish_date: obj[i].finish_date,
                  start_date: obj[i].start_date,
                  grade: obj[i].grade,
                  self_assessment_id: obj[i].self_assessment_id,
                })
              }
            }
          } 

          getTempData(result.data.data)
          setIsNotNullDataSelfAssessment(true)
          setSelfAssessmentPeserta(temp1)
          }else{
            setIsNotNullDataSelfAssessment(false)
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
    getSelfAssessmentPeserta()
    return () => contoller_abort.abort();
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



  const getRowGradeaDesc = (data) => {
    return data.map((nilaipoin, index) => (
      <td key={nilaipoin.grade_id}>
        <Tooltip title={nilaipoin.description}>{nilaipoin.grade}</Tooltip>
      </td>
    ))
  }

  return (
    <>
   
     {isNotNullDataSelfAssessment && (
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

      {title('REKAP PENILAIAN SELF ASSESSMENT PESERTA')}

      <div className="container2">
        {/* <button onClick={tes}>tes</button> */}

        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal Mulai</th>
              {komponenPenilaianSelfAssessment.map((data, index) => (
                <th key={data.aspect_id}>{data.aspect_name}</th>
              ))}
              {/* <th>Total</th> */}
            </tr>
          </thead>
          <tbody>
            {selfAssessmentPeserta.map((sa, index) => (
              <tr key={sa.self_assessment_id}>
                <td>{index + 1}</td>
                <td>{sa.start_date}</td>
                {getRowGradeaDesc(sa.grade)}
              </tr>
            ))}
          </tbody>
        </Table>
        {/* <Popover
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
        </Popover> */}
      </div>
      </>
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

export default RekapSelfAssessment
