import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
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

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
}

export default function TambahLaporan() {
  const [file, setFile] = useState('./sample.pdf')
  const [form1] = Form.useForm()
  axios.defaults.withCredentials = true
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
  const [isThisPhaseHavingLaporan, setIsThisPhaseHavingLaporan] = useState()
  const ID_LAPORAN_PESERTA = params.id
  const [currentLaporanPhase, setCurrentLaporanPhase] = useState()

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
    await axios
      .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/create`, {
        phase: currentLaporanPhase,
        uri: linkGdrive,
      })
      .then((res) => {
        console.log('hasil', res)
        notification.success({
          message: 'Submit data laporan berhasil',
        })

        history.push(`/laporan`)
      })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    async function getCurrentPhase() {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get-phase`)
        .then((response) => {
          setCurrentLaporanPhase(response.data.data)
          let phase = response.data.data
          axios
            .get(
              `${process.env.REACT_APP_API_GATEWAY_URL}monitoring/laporan/get-all/${NIM_PESERTA}`,
            )
            .then((response) => {
              let dataLaporan = response.data.data

              if (dataLaporan !== null && dataLaporan.length > 0) {
                let getIsDataLaporanAvailable = function (data) {
                  for (var i in data) {
                    if (phase === parseInt(data[i].phase)) {
                      setIsThisPhaseHavingLaporan(true)
                    }
                    console.log('pase', phase, data[i].phase)
                  }
                }

                getIsDataLaporanAvailable(dataLaporan)
              } else {
                setIsThisPhaseHavingLaporan(false)
              }
            })
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

  
    getCurrentPhase()
  }, [history])

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
          <h4 className="title-s">Pengumpulan Laporan KP dan PKL Fase Ke {currentLaporanPhase}</h4>
          <Text type="warning" className="spacetop">
            * Laporan KP / PKL dikumpulkan hanya satu file dalam bentuk link Gdrive
            <br /> * Laporan dapat dikumpulkan kembali selama belum mencapai deadline <br /> *
            Pastikan Gdrive dapat diakses <br /> * Pengumpulan kembali dapat dilakukan dengan
            mengisi form dibawah dan klik submit
          </Text>

          {isThisPhaseHavingLaporan && (
            <Result
              status="success"
              title="Anda Sudah Mengumpulkan Link Laporan Pada Fase Ini"
              subTitle="Silahkan Lakukan Pengeditan Link Laporan Apabila Diperlukan"
            />
          )}

          {!isThisPhaseHavingLaporan && (
            <Form
              className="spacetop"
              name="basic"
              form={form1}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={true}
              onFinish={onSubmit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              fields={[
                {
                  name: 'linkdrive',
                  value: isiDetailLaporan.link_drive,
                },
              ]}
            >
              <Form.Item
                label="LINK GDRIVE"
                name="linkGdrive"
                rules={[{ required: true, message: 'Isi link gdrive terlebih dahulu' }]}
              >
                <Input type="url" onChange={(e) => setLinkGdrive(e.target.value)} />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          )}
        </div>
      )}
      <FloatButton
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          history.push(`/laporan`)
        }}
        tooltip={<div>Kembali ke Rekap Laporan</div>}
      />
    </>
  )
}
