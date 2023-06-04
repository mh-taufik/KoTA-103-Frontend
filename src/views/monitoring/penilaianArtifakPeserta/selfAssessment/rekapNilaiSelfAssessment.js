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
  var idPeserta = useParams()
  const [isLoading, setIsLoading] = useState(true)
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [poinPenilaianSelfAssessment, setPoinPenilaianSelfAssessment] = useState([])
  const [dataSelfAssessmentNilaiDanKeterangan, setDataSelfAssessmentNilaiDanKeterangan] = useState(
    [],
  )
  const [newDat, setNewDat] = useState([])
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

  //   isLoading ? (
  //     <Spin indicator={antIcon} />
  //   ) :

  /** API */
  function tes() {
    console.log(dataSelfAssessmentNilaiDanKeterangan)
  }

  useEffect(() => {
    const getPoinPenilaianSelfAssessment = async () => {
      await axios
        .get(
          'http://localhost:1337/api/poinpenilaianselfassessments?filters[$or][0][status][$eq]=non active&filters[$or][1][status][$eq]=active',
        )
        .then((res) => {
          console.log(res.data.data)
          let temp = res.data.data
          let newTemp = []

          let funcTemp = function (obj) {
            for (var i in obj) {
              newTemp.push({
                id: obj[i].id,
                poinpenilaian: obj[i].attributes.poinpenilaian,
                tanggalmulaipengisian: obj[i].attributes.tanggalmulaipengisian,
              })
            }
          }

          funcTemp(temp)
          setPoinPenilaianSelfAssessment(newTemp)
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
            history.push('/500')
          }
        })
    }

    const getSelfAssessmentPeserta = async () => {
      await axios
        .get(
          'http://localhost:1337/api/selfassessments?populate=*&filters[peserta][username]=181524003',
        )
        .then((res) => {
          console.log('DATA SELF ASSESSMENT', res.data.data)
          let temp = res.data.data
          let dataTemp = []

          let funcTemp = function (data) {
            let b = 0
            for (var i in data) {
              let newTemp = []
              console.log(data[i].id, ']]]]]]')
              axios
                .get(
                  `http://localhost:1337/api/selfasspoins?populate=*&filters[selfassessment][id]=${data[i].id}&filters[poinpenilaianselfassessment][status][$eq]=active&filters[poinpenilaianselfassessment][status][$eq]=non active&sort[1]=[poinpenilaianselfassessment][id]`,
                )
                .then((result) => {
                  let temp = result.data.data
                  console.log('RES', temp)
                  let i = 0
                  let funcTemp = function (obj) {
                    for (var a in obj) {
                      newTemp[i] = {
                        nilai: obj[a].attributes.nilai,
                        id: obj[a].id,
                        keterangan: obj[a].attributes.keterangan,
                      }
                      i++
                    }
                  }

                  funcTemp(temp)
                })
              console.log('NEWTEMP', newTemp)
              dataTemp[b] = {
                newTemp,
                id: data[i].id,
              }
              newDat[b] = newTemp

              b++
            }
          }
          funcTemp(temp)
          setDataSelfAssessmentNilaiDanKeterangan(dataTemp)
          console.log('TEMP0', dataTemp[0])
          // for(const key of dataTemp[0].newTemp.keys()){
          //   console.log('key ==> ', key)
          // }
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
            history.push('/500')
          }
        })
    }

    getPoinPenilaianSelfAssessment()
    getSelfAssessmentPeserta()
  }, [history])

  const dataPoinPenilaian = [
    {
      id: 1,
      poinpenilaian: 'Apresiasi Perusahaan',
    },
    {
      id: 2,
      poinpenilaian: 'Lingkungan Perusahaan',
    },
    {
      id: 3,
      poinpenilaian: 'Karyawan Perusahaan',
    },
    {
      id: 4,
      poinpenilaian: 'Budaya Perusahaan',
    },
    {
      id: 5,
      poinpenilaian: 'Sikap Karyawan',
    },
    {
      id: 6,
      poinpenilaian: 'Aturan Kerja',
    },
  ]

  const dataPoinDanKeterangan = [
    {
      id: 1,
      tanggalmulai: '23 Mei 2023',
      data: [
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 1,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 2,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 3,
        },
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 4,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 5,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 6,
        },
      ],
    },
    {
      id: 1,
      tanggalmulai: '29 Mei 2023',
      data: [
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 1,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 2,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 3,
        },
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 4,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 5,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 6,
        },
      ],
    },
    {
      id: 1,
      tanggalmulai: '30 Mei 2023',
      data: [
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 1,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 2,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 3,
        },
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 4,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 5,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 6,
        },
      ],
    },
    {
      id: 1,
      tanggalmulai: '07 Juni 2023',
      data: [
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 1,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 2,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 3,
        },
        {
          nilai: 89,
          keterangan: 'Bagus banget',
          idpoin: 4,
        },
        {
          nilai: 90,
          keterangan: 'Bagus lah',
          idpoin: 5,
        },
        {
          nilai: 79,
          keterangan: 'Menurut aku sih yes',
          idpoin: 6,
        },
      ],
    },
  ]

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
      {rolePengguna !== '1' && (
        <Space
          className="spacetop"
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <Card title="Informasi Peserta" size="small" style={{ padding: 30 }}>
            <Row>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>Gina Anifah Choirunnisa</Col>
            </Row>
            <Row>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>201511009</Col>
            </Row>
          </Card>
        </Space>
      )}

      {title('REKAP PENILAIAN SELF ASSESSMENT PESERTA')}

      <div className="container2">
        {/* <button onClick={tes}>tes</button> */}

        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal Mulai</th>
              {dataPoinPenilaian.map((data, index) => (
                <th key={data.id}>{data.poinpenilaian}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {dataPoinDanKeterangan.map((sa, index) => (
              <tr key={sa.id}>
                <td>{index + 1}</td>
                <td>{sa.tanggalmulai}</td>
                {sa.data.map((nilaipoin, index) => (
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
          </tbody>
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
