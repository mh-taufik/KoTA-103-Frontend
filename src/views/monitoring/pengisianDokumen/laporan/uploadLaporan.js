import React, { useEffect, useState } from 'react'
import {ArrowLeftOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf'
import { UploadOutlined } from '@ant-design/icons'
import { Button, FloatButton, Form, Input, Result, Space, Upload, notification } from 'antd'
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
  axios.defaults.withCredentials = true
  const [numPages, setNumPages] = useState(null)
  const [hiddenScroll, setHiddenScroll] = useState('upload-dokumen-laporan')
  const [fileData, setFileData] = useState()
  const [isFinishDatePhase, setIsFinishDatePhase] = useState()
  const [storageFile, setStorageFile] = useState()
  const NIM_PESERTA = localStorage.username
  const [isUploadFileByLink, setIsUploadFileByLink] = useState(true)
  const [linkGdrive, setLinkGdrive] = useState()
  const history = useHistory()
  const [idPeserta, setIdPeserta] = useState()
  const [isiDetailLaporan, setIsiDetailLaporan] = useState([])
  const params = useParams()
  const ID_LAPORAN_PESERTA = params.id

  function onFileChange(event) {
    console.log(event)
    setFile(event.target.files[0])
    setHiddenScroll('upload-dokumen-laporans')
    var v = event.target.files[0].name
    setFileData(v)
    console.log(v)
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages)
  }



  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }



  const onSubmit = async (values) => {
    let todayDate = new Date()
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/update`, {
        'id' : isiDetailLaporan.id,
        'phase' : isiDetailLaporan.fase,
        'uri' : linkGdrive
      })
      .then((res) => {
        console.log('hasil', res.data.data)
        notification.success({
          message: 'Submit data pembaruan link berhasil',
        })

        history.push(`/laporan`)
      })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {


    const getDataLaporanPeserta = async () => {
      await axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get/${ID_LAPORAN_PESERTA}`).then((res) => {
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
        let current_phase = temp.phase
     
        waltemp = {
            id: temp.id,
            link_drive: temp.uri,
            fase : temp.phase,
            tanggal_pengumpulan: convertDate(temp.upload_date),
          }
        
      
        console.log('TEP', waltemp)
        setIsiDetailLaporan(waltemp)
        form1.setFieldValue({
          id : 'linkdrive',
          name : 'linkdrive',
          value : waltemp.link_drive
        })
        let idDeadline
        if(current_phase === 1){
          idDeadline= 3
        }else if(current_phase ===2){
          idDeadline = 4
        }else if(current_phase === 3){
          idDeadline = 5
        }

        axios.get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/deadline/get-all?id_deadline=${idDeadline}`).then((res)=>{
          console.log('hasil', res.data.data)
          let today = formatDate(new Date())
          let date_finished_this_phase = res.data.data.finish_assignment_date
          console.log('date' , today, date_finished_this_phase)
          if(date_finished_this_phase < today){
            setIsFinishDatePhase(true)
          }else{
            setIsFinishDatePhase(false)
          }
        })
      
      })
    }

    getDataLaporanPeserta()
   
  }, [history])

  const tes = ()=>{
    console.log(isiDetailLaporan)
  }

  return (
    <>
      {!isUploadFileByLink && (
        <div className="Example container">
          <h4 className="title-s">Laporan KP dan PKL</h4>
          <Box sx={{ color: 'info.main' }}>
            <ul>
              <li>Tanggal Pengumpulan : {isiDetailLaporan.tanggal_pengumpulan}</li>
              <li>Tanggal Deadline : {isiDetailLaporan.tanggal_deadline}</li>
            </ul>
          </Box>
          <Text type="warning">
            * Laporan KP / PKL dikumpulkan hanya satu file <br /> * Laporan dapat dikumpulkan
            kembali selama belum mencapai deadline
          </Text>
          <div className="spacing"></div>
          <form>
            <Button type="primary" onClick={onFinishFailed}>
              Submit Dokumen
            </Button>

            <div className="Example__container__load App">
              <label htmlFor="file">Upload Laporan</label>{' '}
              <input
                onChange={onFileChange}
                className="custom-file-input"
                type="file"
                accept="application/pdf"
              />
              {/* </Upload> */}
            </div>
          </form>
          <div className={`Example__container  ${hiddenScroll}`}>
            <div className="Example__container__document ">
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}


      {isUploadFileByLink && (
        <div className="Example container">
          <h4 className="title-s">Laporan KP dan PKL</h4>
      
          <Box sx={{ color: 'info.main' }}>
          Tanggal Pengumpulan &nbsp;&nbsp;&nbsp; : {isiDetailLaporan.tanggal_pengumpulan}
          </Box>
          <Box sx={{ color: 'info.main' }}>Link yang dikumpulkan : <a href={isiDetailLaporan.link_drive}>{isiDetailLaporan.link_drive}</a></Box>
          <div className='spacebottom'></div>
          <Text type="warning" className='spacetop'>
            * Laporan KP / PKL dikumpulkan hanya satu file dalam bentuk link gdrive <br /> * Laporan dapat dikumpulkan
            kembali selama belum mencapai deadline <br /> * Pastikan Gdrive dapat diakses  <br/> * Pengumpulan kembali dapat dilakukan dengan mengisi form dibawah dan klik submit
          </Text>
     

         


        {!isFinishDatePhase && (
            <Form
            className="spacetop"
            name="basic"
            form={form1}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={ true }
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            fields={[
              {
                name : 'linkdrive',
                value : isiDetailLaporan.link_drive
              }
            ]}
          >
            <Form.Item
              label="LINK GDRIVE"
              name="linkGdrive"
              rules={[{ required: true, message: 'Isi link gdrive terlebih dahulu' }]}
            >
              <Input type="url"  onChange={(e) => setLinkGdrive(e.target.value)} />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        )}

        {isFinishDatePhase && (
            <Result
            title="Sudah Melewati Batas Tanggal Pengumpulan"
            subTitle="Anda sudah tidak dapat melakukan pengeditan link laporan"
          
          />
        )}
        </div>
      )}
            <FloatButton type='primary' icon={<ArrowLeftOutlined />} onClick={()=>{history.push(`/laporan`)}} tooltip={<div>Kembali ke Rekap Laporan</div>} />




    </>
  )
}
