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
 
  const [numPages, setNumPages] = useState(null)
  const [hiddenScroll, setHiddenScroll] = useState('upload-dokumen-laporan')
  const [fileData, setFileData] = useState()
  const [storageFile, setStorageFile] = useState()
  const NIM_PESERTA = localStorage.username
  const [isUploadFileByLink, setIsUploadFileByLink] = useState(true)
  const [linkGdrive, setLinkGdrive] = useState()
  const history = useHistory()
  const [idPeserta, setIdPeserta] = useState()
  const [isiDetailLaporan, setIsiDetailLaporan] = useState([])
  const params = useParams()
  const idLaporan = params.id

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

  const getIdPeserta = async () => {
    await axios
      .get(`http://localhost:1337/api/pesertas?populate=*&filters[username][$eq]=${NIM_PESERTA}`)
      .then((res) => {
        console.log(res.data.data[0].id)
        setIdPeserta(res.data.data[0].id)
      })
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

  const statusPengumpulan = async () => {
    await axios
      .get(
        `http://localhost:1337/api/laporans?populate=*&filters[peserta][username]=${NIM_PESERTA}`,
      )
      .then((res) => {
        console.log(res.data.data[0].attributes.deadline.data)
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

  const onSubmit = async (values) => {
    console.log('link', linkGdrive)
    console.log('peserta', NIM_PESERTA)
    let todayDate = new Date()
    await axios
      .put(`http://localhost:1337/api/laporans/${idLaporan}`, {
        data: {
          link_drive: linkGdrive,
          status: 'tepat waktu',
          tanggalpengumpulan: formatDate(todayDate.toDateString()),
          peserta: {
            connect: [idPeserta],
          },
        },
      })
      .then((res) => {
        console.log('hasil', res.data.data)
        notification.success({
          message: 'Submit data berhasil',
        })

        history.push(`/laporan`)
      })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    getIdPeserta()

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
          <Button type='primary' className='spacebottom' onClick={()=>{history.push(`/laporan`)}}>Kembali</Button>
          <Box sx={{ color: 'info.main' }}>
          Tanggal Pengumpulan &nbsp;&nbsp;&nbsp; : {isiDetailLaporan.tanggal_pengumpulan}
          </Box>
          <Box sx={{ color: 'info.main' }}>Link yang dikumpulkan : </Box><Input className='spacebottom' value={isiDetailLaporan.link_drive}/>
          <Text type="warning" className='spacetop'>
            * Laporan KP / PKL dikumpulkan hanya satu file <br /> * Laporan dapat dikumpulkan
            kembali selama belum mencapai deadline <br /> * Pastikan Gdrive dapat diakses  <br/> * Re-submit akan mengubah tanggal pengumpulan
          </Text>
     

         


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
              <Input type="url" name='linkdrive'  onChange={(e) => setLinkGdrive(e.target.value)} />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
      )}
    </>
  )
}
