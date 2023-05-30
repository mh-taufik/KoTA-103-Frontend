import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow } from '@coreui/react'
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
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Popover,
  Row,
  Select,
  Space,
  Spin,
  notification,
} from 'antd'
import '../../pengisianDokumen/rpp/rpp.css'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'

import { useMemo } from 'react'
import { Table } from 'react-bootstrap'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

const PenilaianSelfAssessment = () => {
  let history = useHistory()
  var params = useParams()
  let NIM_PESERTA = params.nim //untuk pembimbing
  let ID_SELFASSESSMENT = params.id //untuk pembimbing

  const [timeline, setTimeline] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const [postPerPage, setPostPerPage] = useState(1)
  const [listLogbook, setListLogbook] = useState([])
  let rolePengguna = localStorage.id_role
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
  var idPeserta = useParams()
  const [infoDataPeserta, setInfoDataPeserta] = useState([])
  const [logbookCurrent, setLogbookCurrent] = useState([])
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [isModaleditVisible, setIsModalEditVisible] = useState(false)
  const [choose, setChoose] = useState([])
  const [loadings, setLoadings] = useState([])
  const [logbookCurrentComplete, setLogbookCurrentComplete] = useState([])
  const [showArrow, setShowArrow] = useState(true)
  const [arrowAtCenter, setArrowAtCenter] = useState(false)
  const [penilaianBefore, setPenilaianBefore] = useState()
  const [idLogbookChoosen, setIdLogbookChoosen] = useState()
  const [nilai, setNilai] = useState()
  const [selfAssessmentPeserta, setSelfAssessmentPeserta] = useState([])
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [nilaiSelfAssessment, setNilaiSelfAssessment] = useState([])
  const [pages, setPages] = useState(1)
  const [currentLogbook, setCurrentLogbook] = useState(0)
  const [pagesSelfAssessment, setPagesSelfAssessment] = useState()
  const [currentSelfAssessment, setCurrentSelfAssessment] = useState()
  const [allIdSelfAssessmentPeserta, setAllIdSelfAssessmentPeserta] = useState([])

  /** PAGINATION LOGBOOK */
  const handleChange = (value) => {
    var page = value - 1
    setCurrentLogbook(page)
    console.log('page', value)
    setPages(value)
  }

  const handleChangeSelfAssessmentPages = (value) => {
    var page = value - 1
    setCurrentSelfAssessment(page)
    console.log('page', value)
    setPagesSelfAssessment(value)
  }

  /** HANDLE SAAT NILAI SA DI UBAH */
  const handleChangeNilaiSelfAssessment = (idS, index, nilaiS, keyData) => {
    if (nilaiSelfAssessment[index]) {
      console.log('ya')
      nilaiSelfAssessment[index][keyData] = nilaiS
    } else {
      console.log('no')
      nilaiSelfAssessment[index] = {
        id: idS,
        [keyData]: nilaiS,
      }

      setNilaiSelfAssessment(nilaiSelfAssessment)
    }
  }

  useEffect(() => {
    console.log('nilai self assessment', nilaiSelfAssessment)
  }, [nilaiSelfAssessment])

  const tes = () => {
    console.log('nilai self assessment', nilaiSelfAssessment)
  }

  /** HANDLE CANCEL EDIT MODAL */
  const handleCancelEdit = () => {
    setIsModalEditVisible(false)
  }

  axios.defaults.withCredentials = true

  const getData = (data) => {
    for (var i = 0; i < data.length; i++) {
      data[i].start_date = new Date(data[i].start_date)
      data[i].end_date = new Date(data[i].end_date)
    }
    return data
  }

  const GetDataInfoPeserta = async (index) => {
    var PESERTA
    if (rolePengguna === '1') {
      PESERTA = idPengguna
    } else {
      PESERTA = idPeserta.id
    }
    await axios
      .get(`http://localhost:1337/api/pesertas?filters[username][$eq]=${PESERTA}`)
      .then((result) => {
        setInfoDataPeserta(result.data.data[0].attributes)
        console.log('res', result)
        console.log('data peserta', result.data.data[0].attributes)
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


  /** SHOW EDIT PENILAIAN LOGBOOK */
  const showModalEdit = (record) => {
    setIsModalEditVisible(true)
    setChoose(record)
    setIdLogbookChoosen(record.id)
    setNilai(record.nilai)
    if (record.nilai === null) {
      setPenilaianBefore('Belum Diberi Penilaian')
    } else {
      setPenilaianBefore(record.nilai)
    }
  }

  /** MENGAMBIL DATA TIMELINE */
  const getTimeline = async () => {
    var obj = []
    var content = []

    await axios
      .get(`http://localhost:1337/api/jadwalpenyelesaiankeseluruhans`)
      .then((result) => {
        console.log('HASIL PENYELESAIAN KESELURUHAN', result.data.data)
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

  /** MENGAMBIL DATA LOGBOOK PESERTA */
  const getLogbook = async () => {
    await axios
      .get('http://localhost:1337/api/logbooks')
      .then((response) => {
        console.log(response)
        console.log('data logbook', response.data.data)
        var temp = []
        var temp1 = response.data.data
        var getDataTemp = function (obj) {
          for (var i in obj) {
            temp.push({
              id: obj[i].id,
              waktudankegiatan: obj[i].attributes.waktudankegiatan,
              namaproyek: obj[i].attributes.namaproyek,
              projectmanager: obj[i].attributes.projectmanager,
              hasilkerja: obj[i].attributes.hasilkerja,
              keterangan: obj[i].attributes.keterangan,
              nilai: obj[i].attributes.nilai,
              statuspengecekan: obj[i].attributes.statuspengecekan,
              statuspengumpulan: obj[i].attributes.statuspengumpulan,
              tanggallogbook: obj[i].attributes.tanggallogbook,
              technicalleader: obj[i].attributes.technicalleader,
              tools: obj[i].attributes.tools,
              tugas: obj[i].attributes.tugas,
            })
          }
        }
        getDataTemp(temp1)
        setLogbookPeserta(temp)
        console.log('temp1', temp)
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

 /** POST DATA PENILAIAN LOGBOOK PESERTA */
  const AksiPenilaianPeserta = async (idLogbook, index) => {
    await axios
      .put(`http://localhost:1337/api/logbooks/${idLogbook}`, {
        data: {
          nilai: nilai,
          statuspengecekan:true
        },
      })
      .then((response) => {
        console.log(response)
        setIsModalEditVisible(false)
        notification.success({
          message: 'Penilaian Logbook Berhasil Diubah',
        })

        refreshDataLogbook(idLogbook, index)
      })
      .catch((error) => {
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

  /** GET DATA SELF ASSESSMENT */
  const getDataSelfAssessmentTerkait = async (index) => {
    await axios
      .get(`http://localhost:1337/api/pesertas?populate=*&filters[username][$eq]=${NIM_PESERTA}`)
      .then((response) => {
        console.log('data self', response.data.data)
        setAllIdSelfAssessmentPeserta(response.data.data[0].attributes.selfassessments.data)
      })
      .catch((error) => {
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

    // console.log('data SA', allIdSelfAssessmentPeserta)
  }

  /** HANDLING PERUBAHAN NILAI SELF ASSESSMENT */
  const putNilaiSelfAssessment = async (idx) => {
    let data = nilaiSelfAssessment
    for (var i in data){
     console.log(i, ' ', data[i])
     await axios.put(`http://localhost:1337/api/selfasspoins/${data[i].id}`,{
      'data' :{
        'nilai' : data[i].nilai
      }
     
     }).then((res)=>{
      console.log(res)
      notification.success({
        message:'Penilaian self assessment berhasil diubah'
      })

      refreshDataSelfAssessment(allIdSelfAssessmentPeserta,idx)
     })
    }
  }


/**REFRESH SELF ASSESSMENT AFTER CHANGE NILAI */
  const refreshDataSelfAssessment = async(data,idx) =>{
    // console.log('idnyak',data)
    let tempDataSelfAssessmentDetail = []

 
    for (let i in data) {
      console.log('id NYA', typeof(data[i].id), typeof(parseInt(ID_SELFASSESSMENT)))

      await axios.get(`http://localhost:1337/api/selfasspoins?populate=*&filters[selfassessment][id]=${data[i].id}`)
        .then((res) => {
          console.log('[', data[i].id, ']', res.data.data)

          tempDataSelfAssessmentDetail.push({
            id_self_assessment: data[i].id,
            data: res.data.data,
          })
        })
       
    }

   let tempPage = idx+1
    setPagesSelfAssessment(tempPage)
    setCurrentSelfAssessment(idx)
    console.log('resultssssss', tempDataSelfAssessmentDetail)
 
    setSelfAssessmentPeserta(tempDataSelfAssessmentDetail)
  }

  useEffect(() => {
    console.log('data SA', allIdSelfAssessmentPeserta)
    getNilaiKeteranganPoinPenilaianSelfAssessment(allIdSelfAssessmentPeserta)
  }, [allIdSelfAssessmentPeserta])

  /** GET NILAI DAN KETERANGAN DARI PENILAIAN SELF ASSESSMENT */
  const getNilaiKeteranganPoinPenilaianSelfAssessment = async (data) => {
    // console.log('idnyak',data)
    let tempDataSelfAssessmentDetail = []

    let a = 0
    let b = 1
    let curr 
    let pgs
    for (let i in data) {
      console.log('id NYA', typeof(data[i].id), typeof(parseInt(ID_SELFASSESSMENT)))
      if(data[i].id === (parseInt(ID_SELFASSESSMENT))){
        curr = a
        pgs = b
      }
      await axios.get(`http://localhost:1337/api/selfasspoins?populate=*&filters[selfassessment][id]=${data[i].id}`)
        .then((res) => {
          console.log('[', data[i].id, ']', res.data.data)

          tempDataSelfAssessmentDetail.push({
            id_self_assessment: data[i].id,
            data: res.data.data,
          })
        })
        a++
        b++
    }

    console.log('PGS',pgs)
    console.log('CURR',curr)
    setPagesSelfAssessment(pgs)
    setCurrentSelfAssessment(curr)
    console.log('resultssssss', tempDataSelfAssessmentDetail)
 
    setSelfAssessmentPeserta(tempDataSelfAssessmentDetail)
  }

  /** USE EFFECT */
  useEffect(() => {
    getTimeline()
    getLogbook()
    getDataSelfAssessmentTerkait()
  }, [history])

  /** HANDLING TIMELINE */
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

  /** JUDUL  */
  const title = (judul) => {
    return (
      <>
        <div>
          <Row style={{ backgroundColor: '#00474f', padding: 5, borderRadius:2 }}>
            <Col span={24}>
              <b>
                <h4 style={{color:'#f6ffed', marginLeft:30, marginTop:6}}>{judul}</h4>
              </b>
            </Col>
          </Row>
        </div>
        <div className="spacebottom"></div>
      </>
    )
  }



 /** PENYESUAIAN WARNA TEKS PADA STATUS PENGUMPULAN */
  const colorTextStatusPengumpulan = (teks) => {
    if (teks === 'terlambat') {
      return <text style={{ color: '#a8071a' }}>{teks}</text>
    } else if (teks === 'tepat waktu') {
      return <text style={{ color: '#237804' }}>{teks}</text>
    }
  }

  /** HOVER STATUS PENILAIAN DAN DETAIL PENILAIAN DARI LOGBOOK */
  const textSangatBaik = <text>Deskripsi Penilaian</text>

  const contentPenilaianSangatBaik = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit tepat waktu</li>
        <li>Kelengkapan semua data logbook</li>
        <li>Isi konten logbook yang dinilai baik</li>
        <li>Sesuai dengan perencanaan RPP</li>
        <li>Tidak copy paste dari logbook sebelumnya</li>
      </ul>
    </div>
  )

  const contentPenilaianBaik = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit tepat waktu / terlambat maksimal 5 hari </li>
        <li>Kelengkapan semua data logbook</li>
        <li>Isi konten logbook yang dinilai baik</li>
        <li>Sesuai dengan perencanaan RPP</li>
        <li>Tidak copy paste dari logbook sebelumnya</li>
      </ul>
    </div>
  )

  const contentPenilaianCukup = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit terlambat lebih dari 7 hari dan kurang dari 10 hari</li>
        <li>Isi data logbook yang kurang lengkap</li>
        <li>Isi konten logbook yang dinilai cukup</li>
        <li>Waktu perencanaan dan isi konten yang tidak sesuai</li>
      </ul>
    </div>
  )

  const contentPenilaianKurang = (
    <div>
      <p>Penilaian Diberikan Apabila</p>
      <ul>
        <li>Peserta submit terlambat lebih dari 10 hari</li>
        <li>Tidak copy paste dari logbook sebelumnya</li>
      </ul>
    </div>
  )

  const mergedArrow = useMemo(() => {
    if (arrowAtCenter) return { pointAtCenter: true }
    return showArrow
  }, [showArrow, arrowAtCenter])

  /** REFRESH DATA LOGBOOK SETELAH DI UPDATE PENILAIAN */
  const refreshDataLogbook = async(id, index) => {
    await axios
    .get('http://localhost:1337/api/logbooks')
    .then((response) => {
      var temp = []
      var temp1 = response.data.data
      var pgs
      var curr
      var a = 0
      var getDataTemp = function (obj) {
        for (var i in obj) {
          if (obj[i].id === id) {
            //pages dimulai dari 1
            pgs = a + 1
            curr = a
          }

          temp.push({
            id: obj[i].id,
            waktudankegiatan: obj[i].attributes.waktudankegiatan,
            namaproyek: obj[i].attributes.namaproyek,
            projectmanager: obj[i].attributes.projectmanager,
            hasilkerja: obj[i].attributes.hasilkerja,
            keterangan: obj[i].attributes.keterangan,
            nilai: obj[i].attributes.nilai,
            statuspengecekan: obj[i].attributes.statuspengecekan,
            statuspengumpulan: obj[i].attributes.statuspengumpulan,
            tanggallogbook: obj[i].attributes.tanggallogbook,
            technicalleader: obj[i].attributes.technicalleader,
            tools: obj[i].attributes.tools,
            tugas: obj[i].attributes.tugas,
          })
          a++
        }
      }

      getDataTemp(temp1)
      setPages(pgs)
      setCurrentLogbook(curr)
      setLogbookPeserta(temp)
  
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    })
  }

  /** HANDLE BUTTON */
  const btnKembali = () => {
    history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${NIM_PESERTA}`)
  }

  return (
    <>
      <>
        <div className="container2">
        <Popover content={<div>Kembali ke rekap Self Assessment</div>}>
        <Button type="primary" size='medium' className="spacebottom" onClick={btnKembali}>
            Kembali
          </Button>
        </Popover>

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

            <div>
              {logbookPeserta.map((currElement, index) => {
                if (index === currentLogbook) {
                  return (
                    <>
                      <table>
                        <tr>
                          <td>Status Pengumpulan</td>
                          <td>:</td>
                          <td>
                            <b>
                              {colorTextStatusPengumpulan(
                                logbookPeserta[currentLogbook].statuspengumpulan,
                              )}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Penilaian</td>
                          <td>:</td>
                          <td>{logbookPeserta[currentLogbook].nilai}</td>
                        </tr>
                        <tr>
                          <td>Tanggal Logbook</td>
                          <td>:</td>
                          <td>{logbookPeserta[currentLogbook].tanggallogbook}</td>
                        </tr>
                      </table>
                      <div className="spacetop"></div>
                      <Table striped="columns">
                        <tbody>
                          <tr>
                            <td>
                              <b>Tanggal</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].tanggallogbook}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Nama Proyek</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].namaproyek}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Proyek Manager</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].projectmanager}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Technical leader</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].technicalleader}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Tugas</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].tugas}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Waktu dan Kegiatan Harian</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].waktudankegiatan}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Tools yang digunakan</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].tools}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Hasil Kerja</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].hasilkerja}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Keterangan</b>
                            </td>
                            <td>{logbookPeserta[currentLogbook].keterangan}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <br />
                      <br />
                      <Button
                        type="primary"
                        onClick={() => showModalEdit(logbookPeserta[currentLogbook])}
                      >
                        Nilai
                      </Button>
                      <br />
                      <br />
                      <Pagination
                        defaultCurrent={pages}
                        defaultPageSize={1}
                        onChange={handleChange}
                        total={logbookPeserta.length}
                      />
                    </>
                  )
                }
              })}
            </div>
          </div>

          <div style={{ marginTop: 150 }}>
            {title('SELF ASSESSMENT')}

            <ul className="list-group mb-4">
              {selfAssessmentPeserta.map((sa, index) => {
                if (index === currentSelfAssessment) {
                  // console.log('SA', index, 'curr', currentSelfAssessment )
                  return (
                    <>
                      <div>
                        <div>
                          <table>
                            <tr>
                              <td>Penilaian</td>
                              <td>:</td>
                              <td>
                                {selfAssessmentPeserta[currentSelfAssessment].id_self_assessment}
                              </td>
                            </tr>
                            <tr>
                              <td>Tanggal Self Assessment</td>
                              <td>:</td>
                              <td>
                                {
                                  selfAssessmentPeserta[currentSelfAssessment].data[0].attributes
                                    .selfassessment.data.attributes.tanggalmulai
                                }{' '}
                                &nbsp; s/d &nbsp;
                                {
                                  selfAssessmentPeserta[currentSelfAssessment].data[0].attributes
                                    .selfassessment.data.attributes.tanggalselesai
                                }
                              </td>
                            </tr>
                          </table>
                          <div className="spacetop"></div>
                          <Table striped="columns">
                            <thead>
                              <tr>
                                <td>
                                  <b>NO</b>
                                </td>
                                <td>
                                  <b>POIN SELF ASSESSMENT</b>
                                </td>
                                <td width={'10%'}>
                                  <b>NILAI</b>
                                </td>
                                <td width={'50%'}>
                                  <b>KETERANGAN</b>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {selfAssessmentPeserta[currentSelfAssessment].data.map(
                                (data, index) => {
                                  return (
                                    <tr key={data.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {
                                          data.attributes.poinpenilaianselfassessment.data
                                            .attributes.poinpenilaian
                                        }
                                      </td>
                                      <td width={'10%'}>
                                        <Input
                                          onChange={(e) =>
                                            handleChangeNilaiSelfAssessment(
                                              data.id,
                                              index,
                                              e.target.value,
                                              'nilai'
                                            )
                                          }
                                          defaultValue={data.attributes.nilai}
                                          type="number"
                                          placeholder="Input a number"
                                          maxLength={2}
                                        ></Input>
                                      </td>
                                      <td>{data.attributes.keterangan}</td>
                                    </tr>
                                  )
                                },
                              )}
                            </tbody>
                          </Table>
                        </div>
                        <Button type="primary" onClick={()=>putNilaiSelfAssessment(index)} variant="contained">
                          Simpan Nilai
                        </Button>
                      </div>
                      <br />

                      <Pagination
                        defaultCurrent={pagesSelfAssessment}
                        defaultPageSize={1}
                        onChange={handleChangeSelfAssessmentPages}
                        total={selfAssessmentPeserta.length}
                      />
                    </>
                  )
                }
              })}
            </ul>
          </div>
        </div>

        {/* <Button type="primary" onClick={showModal}>
        Modal
      </Button> */}
        <Modal
          title="Penilaian Logbook Peserta"
          visible={isModaleditVisible}
          onOk={form1.submit}
          onCancel={handleCancelEdit}
          width={600}
          zIndex={99}
          enforceFocus={true}
          footer={[
            <Button key="back" onClick={handleCancelEdit}>
              Batal
            </Button>,
            <Button loading={loadings[1]} key="submit" type="primary" onClick={form1.submit}>
              Simpan
            </Button>,
          ]}
        >
          <h6>Penilaian saat ini : {penilaianBefore}</h6>
          <Form
            form={form1}
            name="basic"
            wrapperCol={{ span: 24 }}
            onFinish={() => AksiPenilaianPeserta(idLogbookChoosen)}
            autoComplete="off"
            fields={[
              {
                name: 'namapembimbing',
                // value: pembimbingChoosen,
              },
            ]}
          >
            <Form.Item label="Pilih Nilai" rules={[{ required: true, message: 'Penilaian' }]}>
              <Form.Item>
                <Space wrap>
                  <Popover
                    className="indexing"
                    placement="topRight"
                    title={textSangatBaik}
                    content={contentPenilaianSangatBaik}
                    arrow={mergedArrow}
                  >
                    <Button primary onClick={() => setNilai(90)}>
                      Sangat Baik
                    </Button>
                  </Popover>
                  <Popover
                    className="indexing"
                    placement="topRight"
                    title={textSangatBaik}
                    content={contentPenilaianBaik}
                    arrow={mergedArrow}
                  >
                    <Button primary onClick={() => setNilai(80)}>
                      Baik
                    </Button>
                  </Popover>
                  <Popover
                    className="indexing"
                    placement="topRight"
                    title={textSangatBaik}
                    content={contentPenilaianCukup}
                    arrow={mergedArrow}
                  >
                    <Button primary onClick={() => setNilai(70)}>
                      Cukup
                    </Button>
                  </Popover>
                  <Popover
                    className="indexing"
                    placement="topRight"
                    title={textSangatBaik}
                    content={contentPenilaianKurang}
                    arrow={mergedArrow}
                  >
                    <Button primary onClick={() => setNilai(60)}>
                      Kurang
                    </Button>
                  </Popover>
                </Space>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </>
  )
}

export default PenilaianSelfAssessment
