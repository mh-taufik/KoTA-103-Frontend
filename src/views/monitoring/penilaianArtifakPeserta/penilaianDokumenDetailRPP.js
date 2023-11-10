import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../pengisianDokumen/rpp/rpp.css'
import { Col, Row } from 'react-bootstrap'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import {ArrowLeftOutlined } from '@ant-design/icons';
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
import { Button, FloatButton, Popover, Space, Spin } from 'antd'

const PenilaianDokumenDetailRPP = (props) => {
  const params = useParams()
  let RPP_ID = params.id
  let NIM_PESERTA = params.nim
  let ID_SA = params.idsa
  let ID_LOGBOOK = params.idlogbook
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
  const [dataRPP, setDataRPP] = useState([])
  const [isSelfAssessmentLink, setIsSelfAssessmentLink] = useState()
  const [dataMilestones, setDataMilestones] = useState([])
  const [dataCapaianMingguan, setDataCapaianMingguan] = useState([])
  const [dataDeliverables, setDataDeliverables] = useState([])
  const [dataJadwalPenyelesaianKeseluruhan, setDataJadwalPenyelesaianKeseluruhan] = useState([])
  const [loadings, setLoadings] = useState([])
  const rolePengguna = localStorage.id_role

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
    
    
    function getCurrUrl () {
        let url = window.location.href
        let getSplit = url.split('/')
        if(getSplit[4] === 'selfAssessmentPeserta'){
            setIsSelfAssessmentLink(true)
        }else{
            setIsSelfAssessmentLink(false)
        }
       
      }
  
      getCurrUrl()

    const getRPPDetailPeserta = async (index) => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/get/${RPP_ID}`)
        .then((response) => {
          console.log(response.data.data)

          const convertDate = (date) => {
            var temp_date_split = date.split('-')
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
            var date_month = temp_date_split[1]
            var month_of_date = month[parseInt(date_month) - 1]
            return date ? `${temp_date_split[2]}  ${month_of_date}  ${temp_date_split[0]}` : null
          }

          setDataRPP({
            start_date: convertDate(response.data.data.start_date),
            finish_date: convertDate(response.data.data.finish_date),
            group_role: response.data.data.group_role,
            work_title: response.data.data.work_title,
            task_description: response.data.data.task_description,
          })

              /**SET DATA DELIVERABLES */
              let temp_del = []
              let temp_del1 = []
              temp_del = response.data.data.deliverables
              let temp_deliverables = function (obj) {
                for (var i in obj) {
                  temp_del1.push({
                    id: obj[i].id,
                    due_date: convertDate(obj[i].due_date),
                    deliverables: obj[i].deliverables,
                  })
                }
              }
    
              temp_deliverables(temp_del)
              setDataDeliverables(temp_del1)
              console.log('deliverables', temp_del1)

          /** SET DATA MILESTONES */
          let temp_mil = []
          let temp_mil1 = []
          temp_mil = response.data.data.milestones
          let temp_milestone = function (obj) {
            for (var i in obj) {
              temp_mil1.push({
                id: obj[i].id,
                description: obj[i].description,
                start_date: convertDate(obj[i].start_date),
                finish_date: convertDate(obj[i].finish_date),
              })
            }
          }

          temp_milestone(temp_mil)
          setDataMilestones(temp_mil1)
          console.log('milestones', temp_mil1)

      

          /**SET DATA RENCANA CAPAIAN MINGGUAN */
          let temp_rcm = []
          let temp_rcm1 = []
          temp_rcm = response.data.data.weekly_achievement_plans
          let temp_rencanaCapaianMingguan = function (obj) {
            for (var i in obj) {
              temp_rcm1.push({
                id: obj[i].id,
                achievement_plan: obj[i].achievement_plan,
                start_date: convertDate(obj[i].start_date),
                finish_date: convertDate(obj[i].finish_date),
              })
            }
          }

          temp_rencanaCapaianMingguan(temp_rcm)
          setDataCapaianMingguan(temp_rcm1)
          console.log('capaian mingguan', temp_rcm1)

          /** JADWAL PENYELESAIAN KESELURUHAN */
          let temp_jadwalKeseluruhan = []
          let temp_jadwalKeseluruhan1 = []
          temp_jadwalKeseluruhan = response.data.data.completion_schedules
          let temp_jadwalKeseluruhans = function (obj) {
            for (var i in obj) {
              temp_jadwalKeseluruhan1.push({
                id: obj[i].id,
                task_type: obj[i].task_type,
                task_name: obj[i].task_name,
                start_date: convertDate(obj[i].start_date),
                finish_date: convertDate(obj[i].finish_date),
              })
            }
          }

          temp_jadwalKeseluruhans(temp_jadwalKeseluruhan)
          setDataJadwalPenyelesaianKeseluruhan(temp_jadwalKeseluruhan1)
          console.log('capaian mingguan', temp_jadwalKeseluruhan1)

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

    getRPPDetailPeserta()
  }, [history])

  const HandleKembali = () => {
 isSelfAssessmentLink? history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${NIM_PESERTA}/penilaian/${ID_SA}`): history.push(`/rekapDokumenPeserta/logbookPeserta/${NIM_PESERTA}/nilai/${ID_LOGBOOK}`)
  }


  return isLoading?( <Spin tip="Loading" size="large">
  <div className="content" />
</Spin>): (
    <>
      <div className="container2">
      <React.Fragment>
      <Space wrap className="title-s">
       
     
        </Space>
        </React.Fragment>
        <h1 className="justify">RENCANA PENYELESAIAN PROYEK</h1>
        <div className="spacebottom"></div>
        <Box sx={{ color: 'primary.main' }}>
          Tanggal RPP : {dataRPP.start_date} &nbsp;&nbsp;s/d&nbsp;&nbsp; {dataRPP.finish_date}
        </Box>
=
        <div className="spacebottom"></div>

        <TableContainer component={Paper} style={{padding:20}}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <b className="left">Topik/Tema/Judul Pekerjaan</b>
            <TableRow>
              <TableCell colSpan={3}>{dataRPP.work_title}</TableCell>
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
              <TableCell colSpan={3}>{dataRPP.group_role}</TableCell>
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
              <TableCell colSpan={3}>{dataRPP.task_description}</TableCell>
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
                  <TableCell>{deliverable.due_date}</TableCell>
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
                  <TableCell>{milestone.start_date}</TableCell>
                  <TableCell>{milestone.finish_date}</TableCell>
                  <TableCell>{milestone.description}</TableCell>
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
                  <TableCell>{capaian.start_date}</TableCell>
                  <TableCell>{capaian.finish_date}</TableCell>
                  <TableCell>{capaian.achievement_plan}</TableCell>
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
                  <TableCell>{keseluruhan.start_date}</TableCell>
                  <TableCell>{keseluruhan.finish_date}</TableCell>
                  <TableCell>{keseluruhan.task_type}</TableCell>
                  <TableCell>{keseluruhan.task_name}</TableCell>
                  <TableCell/>
                </TableRow>
              )
            })}
          </Table>
        </TableContainer>
      </div>
           
                 <FloatButton type='primary' onClick={HandleKembali} icon={<ArrowLeftOutlined />} tooltip={<div>Kembali ke Rekap RPP</div>} />
                 
        




    </>
  )
}

export default PenilaianDokumenDetailRPP
