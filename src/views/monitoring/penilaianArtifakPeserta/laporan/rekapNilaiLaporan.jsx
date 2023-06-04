import React, { useState, useEffect } from 'react'
import 'antd/dist/reset.css'
import '../../pengisianDokumen/rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {ArrowLeftOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Space,
  Card,
  Tag,
  FloatButton,
  Spin,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Box } from '@mui/material'
import { Table } from 'reactstrap';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapPenilaianLogbook = () => {
  var params = useParams() //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const unamePeserta = params.id
  const [dataNilaiLaporanPeserta,setDataNilaiLaporanPeserta] = useState([])
  const usernamePengguna = localStorage.username
  let rolePengguna = localStorage.id_role
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

 useEffect(()=>{
    const getDataLaporanPeserta = async() =>{
        await axios.get(`http://localhost:1337/api/laporans?populate=*&filters[peserta][username]=${unamePeserta}`)
        .then((res)=>{
            console.log(res.data.data)
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
                // console.log(month_of_date,'isi date monts', month_of_date)
                return date ? `${temp_date_split[2]} - ${month_of_date} - ${temp_date_split[0]}` : null
              }

              const hitungTotalNilaiLaporanPeserta = (nilai1,nilai2,nilai3)=>{

              }
    
            let temp = res.data.data
            let temp1 = []

            let functTemp = function(data){
                let totalnilai = 80
                for(var i in data){
                   
                    temp1.push({
                        deadline : convertDate(data[i].attributes.deadlinen),
                        tanggalpengumpulan : convertDate(data[i].attributes.tanggalpengumpulan),
                        statuspengumpulan : data[i].attributes.status,
                        totalnilai : totalnilai,
                        id : data[i].id
                        

                    })
                    totalnilai=+5
                }
            }

            functTemp(temp)
            setDataNilaiLaporanPeserta(temp1)
            setIsLoading(false)

        })
    }
    getDataLaporanPeserta()
 },[history])

 const tagColorStatusHandling = (status) =>{
 
     if(status === 'terlambat')
    {
        return "warning"
    }else if(status === 'tepat waktu'){
       return "success"
    }else if(status === 'belum mengumpulkan'){
       return "default"
    }

 }
  return isLoading? <Spin size="large" />:(
    <>
    {title('REKAP PENILAIAN FORM PEMBIMBING JURUSAN')}
 
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <Card title="Informasi Peserta" size="small" style={{ padding: 30 }}>
            <Row style={{ fontSize: 16 }}>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>Gina Anifah Choirunnisa</Col>
            </Row>
            <Row style={{ fontSize: 16 }}>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>201511009</Col>
            </Row>
          </Card>
          
        </Space>

      
      <div className="container2">
        <h5>INFORMASI DOKUMEN PESERTA</h5>
        <hr/>

        <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tanggal Tenggat</th>
            <th>Tanggal Pengumpulan</th>
            <th>Status Pengumpulan</th>
            <th>Nilai Laporan</th>
          </tr>
        </thead>
        <tbody>
          {dataNilaiLaporanPeserta.map((data,idx)=>{
          return(
            <tr key={data.id}>
            <td>{idx+1}</td>
            <td>{data.deadline}</td>
            <td>{data.tanggalpengumpulan}</td>
            <td><Tag color={tagColorStatusHandling(data.statuspengumpulan)}>{data.statuspengumpulan}</Tag></td>
            <td>{data.totalnilai}</td>
             </tr>
          )
          })}
          <tr>
            <td colSpan={3}><b>RATA-RATA NILAI</b></td>
            <td colSpan={2}><b>80</b></td>
          </tr>
        
        </tbody>
      </Table>
      </div>
      <FloatButton type='primary' icon={<ArrowLeftOutlined />} onClick={()=>{history.push(`/rekapPenilaianPeserta`)}} tooltip={<div>Kembali ke Rekap Penilaian Peserta</div>} />


    </>
  )
}

export default RekapPenilaianLogbook
