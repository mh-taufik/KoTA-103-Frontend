import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Space, Upload } from 'antd'
import '../rpp/rpp.css'
import Text from 'antd/lib/typography/Text'
import './sample.css'
import axios from 'axios'

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
  const NIM_PESERTA = localStorage.username

  function onFileChange(event) {
    setFile(event.target.files[0])
    console.log(event.target.files[0], "$$$$")
    console.log(event.target.files, "$$$$")
    setHiddenScroll('upload-dokumen-laporans')
    var v = event.target.files[0].name
    setFileData(v)
    console.log(v)
  }


  useEffect(()=> {
    // alert(NIM_PESERTA)
  })

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages)
  }

  function HandleFile(e) {
    let file = e.target.file
    setFileData(file)


  }

  const HandleUploadDokumen = async() => {

    const formData = new FormData()
    formData.append(
      "myFile",
      file,
      file.name
    )
 
    await axios.post(`http://localhost:1337/api/laporans`,{
      'data':{
        'name':formData
      }
    }).then((response)=> {
      console.log(response)
    })
  }

  return (
    <>
      <div className="Example container">
        <h4 className="title-s">Laporan KP dan PKL</h4>
        <Text type="warning">
          * Laporan KP / PKL dikumpulkan hanya satu file <br /> * Laporan dapat dikumpulkan kembali
          selama belum mencapai deadline
        </Text>
        <div className="spacing"></div>
        <Button type="primary" onClick={HandleUploadDokumen}>Submit Dokumen</Button>
      
          <div className="Example__container__load App">
            <label htmlFor="file">Upload Laporan</label>{' '}
            {/* <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picturetext"
              maxCount={1}
            > */}
              <input onChange={onFileChange} className="custom-file-input" type="file" accept="application/pdf" />
            {/* </Upload> */}
          </div>
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
    </>
  )
}
