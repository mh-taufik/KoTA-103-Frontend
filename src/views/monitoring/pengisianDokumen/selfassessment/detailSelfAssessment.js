import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import {ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Row } from 'react-bootstrap'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'

import routes from 'src/routes'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Paper from '@mui/material/Paper'
import { FloatButton } from 'antd'

const DetailSelfAssessment = (props) => {
  var params = useParams()
  const NIM = params.nim
  const ID_SELF_ASESSMENT = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
  const [loadings, setLoadings] = useState([])
  const [selfAssessment, setSelfAssessment] = useState([])
  const [tanggalMulaiSelfAssessment, setTanggalMulaiSelfAssessment] = useState()
  const [tanggalBerakhirSelfAssessment, setTanggalBerakhirSelfAssessment] = useState()
  const [tanggalPengumpulan, setTanggalPengumpulan] = useState()
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
    const getDataDetailSelfAssessment = async () => {
      await axios
        .get(`http://localhost:1337/api/selfassessments/${ID_SELF_ASESSMENT}?populate=*`)
        .then((response) => {
          console.log('data self assessment', response.data.data)
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
          setTanggalMulaiSelfAssessment(convertDate(response.data.data.attributes.tanggalmulai))
          setTanggalBerakhirSelfAssessment(
            convertDate(response.data.data.attributes.tanggalselesai),
          )
          setTanggalPengumpulan(convertDate(response.data.data.attributes.createdAt.slice(0, 10)))
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

    const getSelfAsssessmentPoinNilaiKeterangan = async () => {
      await axios
        .get(`http://localhost:1337/api/selfasspoins?populate=*&&filters[selfassessment][id]=${ID_SELF_ASESSMENT}`)
        .then((response) => {
          console.log('data self POIN', response.data.data)
          let tempPoin = []
          let tempPoin1 = response.data.data
          let getTempDetailSelfAssessment = function (obj) {
            for (var i in obj) {
              tempPoin.push({
                id_self_poin: obj[i].id,
                keterangan: obj[i].attributes.keterangan,
                nilai: obj[i].attributes.nilai,
                poin_penilaian:obj[i].attributes.poinpenilaianselfassessment.data.attributes.poinpenilaian,
              })
              console.log('id', obj[i].id, ' keterangan ',  obj[i].attributes.keterangan)
            }
          }
    
          getTempDetailSelfAssessment(tempPoin1)
          console.log('POIN SA', tempPoin)
          setSelfAssessment(tempPoin)
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

  
    getDataDetailSelfAssessment()
    getSelfAsssessmentPoinNilaiKeterangan()
  }, [history])



  const HandleKembali = () => {
    rolePengguna !== '1'
      ? history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${NIM}`)
      : history.push(`/selfAssessment`)
  }

  return (
    <>
      <div className="container2">
      
        <h1 className="justify" style={{fontFamily:'Candara'}}>SELF ASSESSMENT</h1>
        <div className="spacebottom"></div>
        <Box sx={{ color: 'primary.main' }}>
          Tanggal Self Assessment : {tanggalMulaiSelfAssessment} - {tanggalBerakhirSelfAssessment}
        </Box>
        <Box sx={{ color: 'primary.main' }}>Dikumpulkan Pada : {tanggalPengumpulan}</Box>
        <div className="spacebottom"></div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <b>POIN PENILAIAN</b>
                </TableCell>
                <TableCell align="center">
                  <b>NILAI</b>
                </TableCell>
                <TableCell align="center">
                  <b>KETERANGAN</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selfAssessment.map((row, index) => (
                <TableRow key={row.id_self_poin}>
                  <TableCell align="left">{row.poin_penilaian}</TableCell>
                  <TableCell align="center">{row.nilai}</TableCell>
                  <TableCell align="left">{row.keterangan}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <FloatButton type='primary' icon={<ArrowLeftOutlined />} onClick={HandleKembali} tooltip={<div>Kembali ke Rekap Self Assessment</div>} />




    </>
  )
}

export default DetailSelfAssessment
