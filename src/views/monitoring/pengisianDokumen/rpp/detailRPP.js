import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import { Col, Row } from 'react-bootstrap'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'

import routes from 'src/routes'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import { Button, Popover, Space } from 'antd'

const DetailRPP = (props) => {
  var params = useParams()
  let PESERTA_ID_RPP = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
  const [dataRPP, setDataRPP] = useState([])
  const [dataMilestones, setDataMilestones] = useState([])
  const [dataCapaianMingguan, setDataCapaianMingguan] = useState([])
  const [dataDeliverables, setDataDeliverables] = useState([])
  const [dataJadwalPenyelesaianKeseluruhan, setDataJadwalPenyelesaianKeseluruhan] = useState([])
  const [loadings, setLoadings] = useState([])
  const rolePengguna = localStorage.id_role
  var idLogbook
  //   var RPP = params.id
  var RPP = 1
  axios.defaults.withCredentials = true
  let history = useHistory()

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  useEffect(() => {
    console.log('params',params)
    const getRPPDetailPeserta = async (index) => {
      await axios
        .get(`http://localhost:1337/api/rpps?filters[id][$eq]=${PESERTA_ID_RPP}&populate=*`)
        .then((response) => {
          console.log(response.data.data[0])

          setDataRPP({
            tanggal_mulai: response.data.data[0].attributes.tanggal_mulai,
            tanggal_selesai: response.data.data[0].attributes.tanggal_selesai,
            perankelompok: response.data.data[0].attributes.perankelompok,
            waktupengisian: response.data.data[0].attributes.waktupengisian,
            judulpekerjaan: response.data.data[0].attributes.judulpekerjaan,
            deskripsi_tugas: response.data.data[0].attributes.deskripsi_tugas,
            status: response.data.data[0].status,
          })

          /** SET DATA MILESTONES */
          let temp_mil = []
          let temp_mil1 = []
          temp_mil = response.data.data[0].attributes.milestones.data
          let temp_milestone = function (obj) {
            for (var i in obj) {
              temp_mil1.push({
                id: obj[i].id,
                deskripsi: obj[i].attributes.deskripsi,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalselesai: obj[i].attributes.tanggalselesai,
              })
            }
          }

          temp_milestone(temp_mil)
          setDataMilestones(temp_mil1)
          console.log('milestones', temp_mil1)

          /**SET DATA DELIVERABLES */
          let temp_del = []
          let temp_del1 = []
          temp_del = response.data.data[0].attributes.deliverables.data
          let temp_deliverables = function (obj) {
            for (var i in obj) {
              temp_del1.push({
                id: obj[i].id,
                duedate: obj[i].attributes.duedate,
                deliverables: obj[i].attributes.deliverables,
              })
            }
          }

          temp_deliverables(temp_del)
          setDataDeliverables(temp_del1)
          console.log('deliverables', temp_del1)

          /**SET DATA RENCANA CAPAIAN MINGGUAN */
          let temp_rcm = []
          let temp_rcm1 = []
          temp_rcm = response.data.data[0].attributes.rencanacapaianmingguans.data
          let temp_rencanaCapaianMingguan = function (obj) {
            for (var i in obj) {
              temp_rcm1.push({
                id: obj[i].id,
                rencanacapaian: obj[i].attributes.rencanacapaian,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalberakhir: obj[i].attributes.tanggalberakhir,
              })
            }
          }

          temp_rencanaCapaianMingguan(temp_rcm)
          setDataCapaianMingguan(temp_rcm1)
          console.log('capaian mingguan', temp_rcm1)

          /** JADWAL PENYELESAIAN KESELURUHAN */
          let temp_jadwalKeseluruhan = []
          let temp_jadwalKeseluruhan1 = []
          temp_jadwalKeseluruhan = response.data.data[0].attributes.jadwalpenyelesaiankeseluruhans.data
          let temp_jadwalKeseluruhans = function (obj) {
            for (var i in obj) {
              temp_jadwalKeseluruhan1.push({
                id: obj[i].id,
                jenispekerjaan: obj[i].attributes.jenispekerjaan,
                butirpekerjaan: obj[i].attributes.butirpekerjaan,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalselesai: obj[i].attributes.tanggalselesai,
              })
            }
          }

          temp_jadwalKeseluruhans(temp_jadwalKeseluruhan)
          setDataJadwalPenyelesaianKeseluruhan(temp_jadwalKeseluruhan1)
          console.log('capaian mingguan', temp_jadwalKeseluruhan1)
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

    getRPPDetailPeserta()
  }, [history])

  const HandleKembali = () => {
   (rolePengguna === 1)?  history.push(`/rencanaPenyelesaianProyek`): history.push(`/rekapDokumenPeserta/rppPeserta/${params.nim}`)
  }

  const hoverButtonKembali = <div>Klik tombol, untuk kembali ke list RPP</div>

  const hoverButtonEdit = <div>Klik tombol, untuk mengedit RPP</div>
  return (
    <>
      <div className="container2">
      <React.Fragment>
      <Space wrap className="title-s">
         
            <Popover content={hoverButtonKembali}>
            <Button type="primary" shape="round" onClick={HandleKembali}>
              Kembali
            </Button>
          </Popover>
       
        {/* {rolePengguna === '1' && (
              <Popover content={hoverButtonEdit}>
              <Button
                type="primary"
                shape="round"
                style={{ background: '#d48806',  borderColor:"#d48806" }}
              >
                Edit
              </Button>
            </Popover>
        )} */}
        </Space>
        </React.Fragment>
        <h1 className="justify">RENCANA PENYELESAIAN PROYEK</h1>
        <div className="spacebottom"></div>
        <Box sx={{ color: 'primary.main' }}>
          Tanggal RPP : 12 Januari 2023 - 19 Januari 2023
        </Box>
        <Box sx={{ color: 'primary.main' }}>Dikumpulkan Pada : 15 Januari 2023</Box>
        <div className="spacebottom"></div>

        <TableContainer component={Paper} style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Topik/Tema/Judul Pekerjaan</b>
            <TableRow>
              <TableCell colSpan={3}>{dataRPP.judulpekerjaan}</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>
        </TableContainer>
        <div className="spacebottom"></div>

        <TableContainer component={Paper} style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Peran Kelompok Dalam Pekerjaan</b>
            <TableRow>
              <TableCell colSpan={3}>{dataRPP.perankelompok}</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>
        </TableContainer>
        <div className="spacebottom"></div>

        <TableContainer component={Paper} style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Deskripsi Pekerjaan</b>
            <TableRow>
              <TableCell colSpan={3}>{dataRPP.deskripsi_tugas}</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>
        </TableContainer>

        <div className="spacebottom"></div>
        <TableContainer component={Paper}  style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Deliverables</b>
            <TableRow>
              <TableCell>NO</TableCell>
              <TableCell>DELIVERABLES</TableCell>
              <TableCell>DUEDATE</TableCell>
            </TableRow>
            {dataDeliverables.map((deliverable, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{deliverable.deliverables}</TableCell>
                  <TableCell>{deliverable.duedate}</TableCell>
                </TableRow>
              )
            })}
          </Table>
        </TableContainer>

        <div className="spacebottom"></div>
        <TableContainer component={Paper}  style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Milestones</b>
            <TableRow>
              <TableCell>NO</TableCell>
              <TableCell>TANGGAL MULAI</TableCell>
              <TableCell>TANGGAL SELESAI</TableCell>
              <TableCell>DESKRIPSI</TableCell>
            </TableRow>
            {dataMilestones.map((milestone, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{milestone.tanggalmulai}</TableCell>
                  <TableCell>{milestone.tanggalselesai}</TableCell>
                  <TableCell>{milestone.deskripsi}</TableCell>
                </TableRow>
              )
            })}
          </Table>
        </TableContainer>

        <div className="spacebottom"></div>
        <TableContainer component={Paper}  style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Rencana Capaian PerMinggu</b>
            <TableRow>
              <TableCell>NO</TableCell>
              <TableCell>TANGGAL MULAI</TableCell>
              <TableCell>TANGGAL SELESAI</TableCell>
              <TableCell>RENCANA CAPAIAN</TableCell>
              <TableCell/>
            </TableRow>
            {dataCapaianMingguan.map((capaian, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{capaian.tanggalmulai}</TableCell>
                  <TableCell>{capaian.tanggalberakhir}</TableCell>
                  <TableCell colSpan={2}>{capaian.rencanacapaian}</TableCell>
                  <TableCell/>
                </TableRow>
              )
            })}
          </Table>
        </TableContainer>

        <div className="spacebottom"></div>
        <TableContainer component={Paper}  style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Jadwal Penyelesaian Keseluruhan</b>
            <TableRow>
              <TableCell>NO</TableCell>
              <TableCell>TANGGAL MULAI</TableCell>
              <TableCell>TANGGAL SELESAI</TableCell>
              <TableCell>JENIS PEKERJAAN</TableCell>
              <TableCell>BUTIR PEKERJAAN</TableCell>
              <TableCell/>
            </TableRow>
            {dataJadwalPenyelesaianKeseluruhan.map((keseluruhan, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{keseluruhan.tanggalmulai}</TableCell>
                  <TableCell>{keseluruhan.tanggalselesai}</TableCell>
                  <TableCell>{keseluruhan.jenispekerjaan}</TableCell>
                  <TableCell>{keseluruhan.butirpekerjaan}</TableCell>
                  <TableCell/>
                </TableRow>
              )
            })}
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default DetailRPP
