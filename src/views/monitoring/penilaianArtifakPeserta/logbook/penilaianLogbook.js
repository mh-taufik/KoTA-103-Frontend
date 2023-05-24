import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chart, {
  CommonSeriesSettings,
  Legend,
  SeriesTemplate,
  Animation,
  ArgumentAxis,
  Tick,
  Title,
  Tooltip,
  ValueAxis,
  Height,
} from 'devextreme-react/chart'
import { LoadingOutlined } from '@ant-design/icons'
import { Pagination, Spin } from 'antd'
import '../../pengisianDokumen/rpp/rpp.css'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import Table from 'react-bootstrap/Table'
import '../../penilaianArtifakPeserta/logbook/penilaianLogbook'
import ReactPaginate from 'react-paginate'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const PenilaianLogbook = () => {
  let history = useHistory()
  var params = useParams()
  var NIM_PESERTA = params.id

  const [timeline, setTimeline] = useState([])
  const [date, setDate] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(1)
  const [nextPage, setNextPage] = useState(0)
  const [listLogbook, setListLogbook] = useState([])
  const [pageCount, setpageCount] = useState(0)
  const [items, setItems] = useState([])
  axios.defaults.withCredentials = true

  const getData = (data) => {
    for (var i = 0; i < data.length; i++) {
      data[i].start_date = new Date(data[i].start_date)
      data[i].end_date = new Date(data[i].end_date)
    }
    return data
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'Nama Kegiatan',
      dataIndex: 'name',
      width: '40%',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      align: 'center',
    },
  ]

  const getTimeline = async () => {
    var obj = []
    var content = []

    await axios
      .get(`http://localhost:1337/api/jadwalpenyelesaiankeseluruhans`)
      .then((result) => {
        console.log('hasil', result.data.data)
        obj = result.data.data

        var findObjectByLabel = function (obj) {
          for (var i in obj) {
            console.log(obj[i])
            content.push({
              id: obj[i].id,
              name: obj[i].attributes.jenispekerjaan,
              description: obj[i].attributes.butirpekerjaan,
              start_date: obj[i].attributes.tanggalmulai,
              end_date: obj[i].attributes.tanggalselesai,
            })
          }
        }

        findObjectByLabel(obj)
        setTimeline(content)

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

    console.log('content', content)
    setTimeline(content)
  }

  const getLogbookPeserta = async () => {
    await axios.get('  http://localhost:1337/api/logbooks').then((response) => {
      console.log(response)
      setListLogbook(response.data.data)
      console.log('data logbook', response.data.data)
    })
  }

  useEffect(() => {
    getTimeline()
    getLogbookPeserta()
  }, [history])

  const customizeTooltip = (arg) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' }
    var start_date = new Date(arg.point.data.start_date)
    var end_date = new Date(arg.point.data.end_date)
    return {
      text: `<b>${arg.point.data.description}</b> <br> ${start_date.toLocaleDateString(
        'en-GB',
        options,
      )} - ${end_date.toLocaleDateString('en-GB', options)}`,
    }
  }

  const y = [
    {
      name: 'Mengerjakan UI di figma, melakukan implementasi ke lavarel',
      id: 1,
      description: 'mengerjakan prototype',
      start_date: '2023-04-10',
      end_date: '2023-04-14',
    },
    {
      name: 'adadad',
      id: 2,
      description: 'Makan Bakso',
      start_date: '2023-05-26',
      end_date: '2023-05-16',
    },
    {
      name: 'xxdsfdsf',
      id: 3,
      description: 'csdgfgfs',
      start_date: '2023-05-03',
      end_date: '2023-04-30',
    },
  ]

  const title = (judul) => {
    return (
      <div style={{ marginTop: 150 }}>
        <Box my={2} sx={{ width: '107.5%' }} ml={-5}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography
                className="title"
                align="center"
                variant="h6"
                color="inherit"
                component="div"
              >
                {judul}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
    )
  }

  const bull = (
    <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
      •
    </Box>
  )

  const onShowSizeChange = (current) => {
    setCurrentPage(current)
  }

  const colorTextStatusPengumpulan = (teks) => {
    if (teks === 'terlambat') {
      return <text style={{ color: '#a8071a' }}>{teks}</text>
    } else if (teks === 'tepat waktu') {
      return <text style={{ color: '#237804' }}>{teks}</text>
    }
  }

  const indexOfLastPost = currentPage * postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage
  const currentPost = listLogbook.slice(indexOfFirstPost, indexOfLastPost)

  const PaginationLogbook = (postpperpage, totalpost, paginate) => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalpost / postpperpage); i++) {
      pageNumbers.push(i)
    }
    return (
      <div>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  return (
    <>
      <>
        <div className="container2">
          <div>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Word of the Day
                </Typography>
                <Typography variant="h5" component="div">
                  be{bull}nev{bull}o{bull}lent
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  adjective
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
            </Card>
          </div>
          {title('RENCANA PENGERJAAN PROYEK ( RPP )')}
          <div style={{ padding: 10 }}>
            <div style={{ background: '#fff', padding: 24 }}>
              <div style={{ overflowX: 'scroll' }}>
                <Chart
                  id="chart"
                  dataSource={getData(timeline)}
                  barGroupPadding={0}
                  barPadding={0}
                  rotated={true}
                >
                  <ArgumentAxis>
                    <Tick visible={false} />
                  </ArgumentAxis>
                  <ValueAxis></ValueAxis>
                  <Title
                    horizontalAlignment={'left'}
                    text="Timeline Rencana Pengerjaan Proyek Peserta"
                  />
                  <CommonSeriesSettings
                    type="rangeBar"
                    argumentField="name"
                    rangeValue1Field="end_date"
                    rangeValue2Field="start_date"
                    barOverlapGroup="description"
                    barWidth="25"
                    barPadding={0}
                  />
                  <Legend
                    visible={false}
                    orientation="horizontal"
                    verticalAlignment="bottom"
                    horizontalAlignment="left"
                  />
                  <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
                  <SeriesTemplate nameField="name" />
                  <Animation enabled={true} />
                </Chart>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 150 }}>
            {title('LOGBOOK')}
            <ul className="list-group mb-4">
              {currentPost.map((logbook) => {
                return (
                  <div key={logbook.id}>
                    <div>
                      <table>
                        <tr>
                          <td>Status Pengumpulan</td>
                          <td>:</td>
                          <td>
                            <b>
                              {colorTextStatusPengumpulan(logbook.attributes.statuspengumpulan)}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Penilaian</td>
                          <td>:</td>
                          <td>{logbook.attributes.penilaian}</td>
                        </tr>
                        <tr>
                          <td>Tanggal Logbook</td>
                          <td>:</td>
                          <td>{logbook.attributes.tanggallogbook}</td>
                        </tr>
                      </table>
                      <div className="spacetop"></div>
                      <Table striped="columns">
                        <tbody>
                          <tr>
                            <td>
                              <b>Tanggal</b>
                            </td>
                            <td>{logbook.attributes.tanggallogbook}</td>
                          </tr>

                          <tr>
                            <td>
                              <b>Nama Proyek</b>
                            </td>
                            <td>{logbook.attributes.namaproyek}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Proyek Manager</b>
                            </td>
                            <td>{logbook.attributes.projectmanager}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Technical leader</b>
                            </td>
                            <td>{logbook.attributes.technicalleader}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Tugas</b>
                            </td>
                            <td>{logbook.attributes.tugas}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Waktu dan Kegiatan Harian</b>
                            </td>
                            <td>{logbook.attributes.waktudankegiatan}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Tools yang digunakan</b>
                            </td>
                            <td>{logbook.attributes.tools}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Hasil Kerja</b>
                            </td>
                            <td>{logbook.attributes.hasilkerja}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Keterangan</b>
                            </td>
                            <td>{logbook.attributes.keterangan}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <Button onClick={()=> alert(logbook.id)} color='secondary' variant="contained">Nilai</Button>
                  </div>
                )
              })}
            </ul>
            {PaginationLogbook(postPerPage, listLogbook.length, paginate)}
          </div>
          <div style={{ marginTop: 150 }}>{title('SELF ASSESSMENT')}
          
          </div>
        </div>
      </>
    </>
  )
}

export default PenilaianLogbook
