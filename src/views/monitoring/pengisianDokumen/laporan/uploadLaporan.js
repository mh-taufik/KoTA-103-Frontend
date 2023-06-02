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
  const [numPages, setNumPages] = useState(null)
  const [hiddenScroll, setHiddenScroll] = useState('upload-dokumen-laporan')
  const [fileData, setFileData] = useState()
  const [storageFile, setStorageFile] = useState()
  const NIM_PESERTA = localStorage.username
  const [isUploadFileByLink, setIsUploadFileByLink] = useState(true)
  const [linkGdrive, setLinkGdrive] = useState()
  const history = useHistory()
  const [idPeserta, setIdPeserta] = useState()
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


  const getIdPeserta  = async() =>{
    await axios.get(`http://localhost:1337/api/pesertas?populate=*&filters[username][$eq]=${NIM_PESERTA}`)
    .then((res)=>{
      console.log(res.data.data[0].id)
      setIdPeserta(res.data.data[0].id)
    })
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-')
}

const statusPengumpulan = async() =>{
 
    await axios
      .get(`http://localhost:1337/api/laporans?populate=*&filters[peserta][username]=${NIM_PESERTA}`)
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

  const onSubmit = async(values) => {
    console.log('link', linkGdrive)
    console.log('peserta', NIM_PESERTA)
    let todayDate = new Date()
    await axios.put(`http://localhost:1337/api/laporans/${idLaporan}`,{
      'data' :{
        'link_drive' : linkGdrive,
        'status' : 'tepat waktu',
        'tanggalpengumpulan' : formatDate(todayDate.toDateString()) ,
        'peserta' : {
          'connect' : [idPeserta]
        }
      }
    }).then((res)=>{
      console.log('hasil', res.data.data)
      notification.success({
        message:'Submit data berhasil'
      })

      history.push(`/laporan`);

    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(()=>{
    getIdPeserta()
  },[history])

  return (
    <>
      {!isUploadFileByLink && (
        <div className="Example container">
          <h4 className="title-s">Laporan KP dan PKL</h4>
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
          <Text type="warning">
            * Laporan KP / PKL dikumpulkan hanya satu file <br /> * Laporan dapat dikumpulkan
            kembali selama belum mencapai deadline <br/> * Pastikan Gdrive dapat diakses
          </Text>

          <Form
          className='spacetop'
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="LINK GDRIVE"
              name="linkGdrive"
              rules={[{ required: true, message: 'Isi link gdrive terlebih dahulu' }]}
            >
              <Input type="url" onChange={(e)=>setLinkGdrive(e.target.value)}/>
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
