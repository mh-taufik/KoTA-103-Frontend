import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../../pengisianDokumen/rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Row, Col, Space, Card, Tag, FloatButton, Spin } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Box } from '@mui/material'
import { Table } from 'reactstrap'

const RekapPenilaianLogbook = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
  const params = useParams()
  const NIM_PESERTA = params.id
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [dataPeserta, setDataPeserta] = useState([])
  const [dataNilaiLaporanPeserta, setDataNilaiLaporanPeserta] = useState([])
  const usernamePengguna = localStorage.username
  const [averageGrade, setAverageGrade] = useState()
  let rolePengguna = localStorage.id_role
  axios.defaults.withCredentials = true

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
    const GetDataInfoPeserta = async () => {
      await axios
        .post(`${process.env.REACT_APP_API_GATEWAY_URL}participant/get-by-id`, {
          id: [NIM_PESERTA],
        })
        .then((result) => {
          setDataPeserta(result.data.data[0])
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
    const GetDataPenilaianLaporanPeserta = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/supervisor/grade/get-all/${NIM_PESERTA}`,
        )
        .then((res) => {
          let dataPenilaianLaporanPeserta = res.data.data
          setDataNilaiLaporanPeserta(dataPenilaianLaporanPeserta)
          let nilai
          let banyakNilai = dataNilaiLaporanPeserta.len
          let GetAverage = function (data) {
            for (var i in data) {
              nilai += data.phase
            }
          }
          GetAverage(dataPenilaianLaporanPeserta)
          let hasil = nilai / banyakNilai
          setAverageGrade(hasil)
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
          } else if (error.toJSON().status >= 500 && error.toJSON().status <= 500) {
            history.push('/500')
          }
        })
    }
    GetDataPenilaianLaporanPeserta()
    GetDataInfoPeserta()
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
  return isLoading ? (
    <Spin size="large" />
  ) : (
    <>
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

      {title('REKAP PENILAIAN FORM PEMBIMBING JURUSAN')}
      <div className="container2">
        <h5>INFORMASI HASIL PENILAIAN</h5>
        <hr />

        <table className="table">
          <thead>
            <tr>
              <th scope="col">FASE</th>
              <th scope="col">NILAI</th>
            </tr>
          </thead>
          <tbody>
            {dataNilaiLaporanPeserta.map((data) => {
              return (
                <tr key={data.id}>
                  <td>{data.phase}</td>
                  <td>{data.date}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <b>NILAI RATA-RATA</b>
              </td>
              <td>
                <b>{averageGrade}</b>
              </td>
            </tr>
          </tfoot>
        </table>
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

export default RekapPenilaianLogbook
