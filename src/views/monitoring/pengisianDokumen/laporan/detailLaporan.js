import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Upload, notification } from 'antd'
import '../rpp/rpp.css'
import Text from 'antd/lib/typography/Text'
import './sample.css'
import axios from 'axios'
import { useForm } from 'antd/lib/form/Form'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { Box } from '@mui/material'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
}

export default function UploadLaporan() {
  const [file, setFile] = useState('./sample.pdf')
  const [form1] = Form.useForm()
  const NIM_PESERTA = localStorage.username
  const history = useHistory()
  axios.defaults.withCredentials = true
  const [idPeserta, setIdPeserta] = useState()
  const [isiDetailLaporan, setIsiDetailLaporan] = useState([])
  const params = useParams()
  const idLaporan = params.id





  useEffect(() => {


    const getDataLaporanPeserta = async () => {
      await axios.get(`http://localhost:1337/api/laporans/${idLaporan}?populate=*`).then((res) => {
        console.log('RES', res.data.data)
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

          let date_month_current = temp_date_split[1]
          let month_date_after_convert = month[parseInt(date_month_current) - 1]
          return date
            ? `${temp_date_split[2]} - ${month_date_after_convert} - ${temp_date_split[0]}`
            : null
        }

        let temp = res.data.data
        let waltemp = []
     
        waltemp = {
            id: temp.id,
            link_drive: temp.attributes.link_drive,
            tanggal_deadline: convertDate(temp.attributes.deadlinen),
            tanggal_pengumpulan: convertDate(temp.attributes.tanggalpengumpulan),
          }
        
      
        console.log('TEP', waltemp)
        setIsiDetailLaporan(waltemp)
        form1.setFieldValue({
          id : 'linkdrive',
          name : 'linkdrive',
          value : waltemp.link_drive
        })
      
      })
    }

    getDataLaporanPeserta()
   
  }, [history])

 
  return (
    <>
      
    </>
  )
}
