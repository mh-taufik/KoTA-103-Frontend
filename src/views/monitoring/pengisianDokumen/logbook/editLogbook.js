import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../rpp/rpp.css'
import { Col, Row } from 'react-bootstrap'
import Table from 'react-bootstrap/Table';
import { Refresh } from '@mui/icons-material'
import axios from 'axios'
import { Route, Router, useHistory, useParams } from 'react-router-dom'
import { notification } from 'antd'
import routes from 'src/routes'





const FormEditLogbook = (props) => {
  var params = useParams()
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinner, setIsSpinner] = useState(true);
  const [tanggalLogbook, setTanggalLogbook] = useState();
  const [loadings, setLoadings] = useState([]);
  const [tanggalProyek, setTanggalProyek] = useState()
  const [tools, setTools] = useState()
  const [hasilKerja, setHasilKerja] = useState()
  const [projectManager, setProjectManager] = useState()
  const [keterangan, setKeterangan] = useState()
  const [namaProyek, setNamaProyek] = useState()
  const [technicalLeader, setTechnicalLeader] = useState()
  const [tugasPeserta, setTugasPeserta] = useState()
  const [waktuDanKegiatanPeserta, setWaktuDanKegiatanPeserta] = useState()
  const [statusPengecekanPembimbing, setStatusPengecekanPembimbing] = useState(0)
  const [submitAccepted, setSubmitAccepted] = useState(1)
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [usernamePeserta, setUsernamePeserta] = useState()
  var dataLogbook = []
  const [logbookData, setLogbookData] = useState({namaproyek : '', tools:'',hasilkerja:'',nilai:'',projectmanager:'',keterangan:'',technicalleader:'',tugas:'',waktudankegiatan:'',statuspengecekan:'',tanggallogbook:''})
  var idLogbook ;
  axios.defaults.withCredentials = true;
  let history = useHistory()

  const enterLoading = index => {
    setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
    });
}

 useEffect(()=>{

    // alert('idLogbook :', params.id)
    console.log(params.id)
    idLogbook = params.id
    console.log("id",idLogbook)

  },[])



  const handleInputLogbookDate = (date) => {
    // console.log('tanggal', value)
    
    axios.get(`http://localhost:1337/api/logbooks?filters[tanggallogbook][$eq]=${date}`)
    .then((result)=> {
    const ress =  result.data.data.length
    if(ress > 0){
      notification.warning({
        message : 'Pilih tanggal lain, logbook sudah tersedia'
      })
      setSubmitAccepted(0)
    }
      
    })
  }

 
  const getDataLogbookChosen = async (index) => {
    enterLoading(index)
    await axios.get(`http://localhost:1337/api/logbooks/${idLogbook}`)
    .then((response) => {
        dataLogbook = response.data.data
        console.log("data", dataLogbook)
        setLogbookPeserta(response.data.data)
      })
      .catch(function(error){
        if(error.toJSON().status >=300 && error.toJSON().status <= 399){
          history.push({
            pathname : "/login",
            state : {
              session:true,
            }
          });
        }else if(error.toJSON().status >=400 && error.toJSON().status <= 499){
          history.push("/404");
        }else if(error.toJSON().status >=500 && error.toJSON().status <= 500){
          history.push("/500");
        }
      })

     
     
}

  useEffect(()=>{
   getDataLogbookChosen()
 
  },[history])
 
 
const submitLogbook = () => {
  if(submitAccepted===0){
    console.log('tidak bisa')
    notification.info({message:'Silahkan ganti tanggal logbook'})
  }else{
    console.log('bisa')
    saveDataLogbook()
  }
}
  const saveDataLogbook = async (data,index) => {
    enterLoading(index)
    await axios.post('http://localhost:1337/api/logbooks', {
      'data' : {
        'tanggallogbook' : tanggalLogbook,
        'namaproyek' : namaProyek,
        'tools' : tools,
        'hasilkerja' : hasilKerja,
        'projectmanager' : projectManager,
        'keterangan' : keterangan,
        'technicalleader' : technicalLeader,
        'tugas' : tugasPeserta,
        'waktudankegiatan' :  waktuDanKegiatanPeserta,
        'statuspengecekan' : statusPengecekanPembimbing,
      }
    }).then((response) => {
      notification.success({
        message:'Logbook berhasil ditambahkan'
      });
 
    })
    .catch(function(error){
      if(error.toJSON().status >=300 && error.toJSON().status <= 399){
        history.push({
          pathname : "/login",
          state : {
            session:true,
          }
        });
      }else if(error.toJSON().status >=400 && error.toJSON().status <= 499){
        history.push("/404");
      }else if(error.toJSON().status >=500 && error.toJSON().status <= 500){
        history.push("/500");
      }
    })
  }
  return (
    <>
      <React.Fragment>
        <div className="App container">
          <h3 align="center" className='title-s'>FORM PENGISIAN LOGBOOK</h3>

      
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="tanggalLogbook">
                  <Form.Label>Tanggal Logbook</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggallogbook"
                    value={tanggalLogbook}
                    placeholder="Tanggal Logbook"
                    onChange={(e) => handleInputLogbookDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
           <Row>
              <Col>
                <Form.Group className="mb-3" controlId="namaProyek">
                  <Form.Label>Nama Proyek</Form.Label>
                  <Form.Control type="text" value={namaProyek} name='namaproyek' placeholder="Nama Proyek" onChange={(e)=>setNamaProyek(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="projectManager">
                  <Form.Label>Project Manager</Form.Label>
                  <Form.Control type="text" placeholder="Project Manager" name='projectmanager' value={projectManager} onChange={(e) => setProjectManager(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="technicalLeader">
                  <Form.Label>Technical Leader</Form.Label>
                  <Form.Control type="text" placeholder="technicalLeader" name='technicalleader' value={technicalLeader} onChange={(e) => setTechnicalLeader(e.target.value)} required />
                </Form.Group>
              </Col>
            </Row>

       <Row>
              <Col>
                <Form.Group className="mb-3" controlId="tugas">
                  <Form.Label>Tugas</Form.Label>
                  <Form.Control as="textarea" placeholder="tugas" name='tugas' value={tugasPeserta} onChange={(e) => setTugasPeserta(e.target.value)}/>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="waktuDanKegiatan">
                  <Form.Label>Waktu dan Kegiatan</Form.Label>
                  <Form.Control as="textarea" placeholder="Waktu Dan Kegiatan" name='waktudankegiatan' value={waktuDanKegiatanPeserta} onChange={(e) => setWaktuDanKegiatanPeserta(e.target.value)}/>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="toolsYangDigunakan">
                  <Form.Label>Tools Yang Digunakan</Form.Label>
                  <Form.Control
                    type="text"
                    name="tools"
                    value={tools}
                    placeholder="Tools Yang Digunakan"
                    onChange={(e) => setTools(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="hasilKerja">
                  <Form.Label>Hasil Kerja</Form.Label>
                  <Form.Control type="text" name="hasilkerja" value={hasilKerja} placeholder="Hasil Kerja" onChange={(e) => setHasilKerja(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="keterangan">
                  <Form.Label>Keterangan</Form.Label>
                   <Form.Control as="textarea" placeholder="keterangan" name='keterangan' value={keterangan} onChange={(e)=> setKeterangan(e.target.value)}/>
                </Form.Group>
              </Col>
            </Row> 

            <Button  className='form-control btn btn-primary' onClick={submitLogbook} >Submit Logbook</Button>
          </Form>
            
        </div>
      </React.Fragment>
    </>
  )
}

export default FormEditLogbook