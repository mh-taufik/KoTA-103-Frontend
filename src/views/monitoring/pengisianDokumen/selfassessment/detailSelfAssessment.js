import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import { ArrowLeftOutlined } from '@ant-design/icons'
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
  const NIM_PESERTA_AS_USER = localStorage.username
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinner, setIsSpinner] = useState(true)
  const [loadings, setLoadings] = useState([])
  const [selfAssessment, setSelfAssessment] = useState([])
  const [tanggalMulaiSelfAssessment, setTanggalMulaiSelfAssessment] = useState()
  const [tanggalBerakhirSelfAssessment, setTanggalBerakhirSelfAssessment] = useState()
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
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/self-assessment/get/${ID_SELF_ASESSMENT}`,
        )
        .then((result) => {
          console.log('data self assessment', result.data.data)
   
          let data_grade_poin = []
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
          setTanggalMulaiSelfAssessment(convertDate(result.data.data.start_date))
          setTanggalBerakhirSelfAssessment(
            convertDate(result.data.data.finish_date),
          )

          console.log(result.data.data.aspect_list)
          let funcGetPoinGrade = function(data){
            for(var i in data){
              data_grade_poin.push({
                grade_id : data[i].grade_id,
                nilai : data[i].grade,
                keterangan : data[i].description,
                poin_penilaian : data[i].aspect_name,
                aspect_id : data[i].aspect_id
              })
            }
          }

          funcGetPoinGrade(result.data.data.aspect_list)
          console.log(data_grade_poin)
          setSelfAssessment(data_grade_poin)
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
  }, [history])

  const HandleKembali = () => {
    rolePengguna !== '1'
      ? history.push(`/rekapDokumenPeserta/selfAssessmentPeserta/${NIM}`)
      : history.push(`/selfAssessment`)
  }

  return (
    <>
      <div className="container2">
        <h1 className="justify" style={{ fontFamily: 'Candara' }}>
          SELF ASSESSMENT
        </h1>
        <div className="spacebottom"></div>
        <Box sx={{ color: 'primary.main' }}>
          Tanggal Self Assessment : {tanggalMulaiSelfAssessment} - {tanggalBerakhirSelfAssessment}
        </Box>

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
      <FloatButton
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={HandleKembali}
        tooltip={<div>Kembali ke Rekap Self Assessment</div>}
      />
    </>
  )
}

export default DetailSelfAssessment
