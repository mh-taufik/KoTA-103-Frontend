import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  AutoComplete,
  Button,
  Cascader,
  Col,
  DatePicker,
  FloatButton,
  Input,
  Popover,
  Row,
  Select,
  Space,
  Table,
  notification,
} from 'antd'
import './rpp.css'
import { Form, Modal, message } from 'antd'
import { Refresh, SentimentVeryDissatisfiedOutlined, TextSnippetSharp } from '@mui/icons-material'
import { PoweroffOutlined } from '@ant-design/icons'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { SpaceContext } from 'antd/lib/space'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'
import { render } from 'enzyme'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons'

const { TextArea } = Input
const EditRPP = () => {
const [, updateState] = React.useState();
const forceUpdate = React.useCallback(() => updateState({}), []);
  const dateFormat = 'YYYY-MM-DD'
  let params = useParams()
  let PESERTA_ID_RPP_EDIT = params.id
  dayjs.extend(customParseFormat)
  let history = useHistory()
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [formDeliverables] = Form.useForm()
  const [formMilestones] = Form.useForm()
  const [formRencanaCapaianMingguan] = Form.useForm()
  const [formJadwalPenyelesaian] = Form.useForm()
  const [loadings, setLoadings] = useState([])
  const [noOfRows, setNoOfRows] = useState(1)
  const [noOfRowsDeliverables, setNoOfRowsDeliverables] = useState(0)
  const [noOfRowsMilestones, setNoOfRowsMilestones] = useState(0)
  const [noOfRowsCapaianPerminggu, setNoOfRowsCapaianPerminggu] = useState(0)
  const [
    noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan,
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan,
  ] = useState(0)
  const [topikPekerjaan, setTopikPekerjaan] = useState()
  const [peranDalamPekerjaan, setPeranDalamPekerjaan] = useState()
  const [deskripsiTugas, setDeskripsiTugas] = useState()
  const [tanggalMulaiPekerjaan, setTanggalMulaiPekerjaan] = useState()
  const [tanggalBerakhirPekerjaan, setTanggalBerakhirPekerjaan] = useState()
  const [deliverables, setDeliverables] = useState([])
  const [milestones, setMilestones] = useState([])
  const [capaianPerminggu, setCapaianPerminggu] = useState([])
  const [jadwalPenyelesaianKeseluruhan, SetJadwalPenyelesaianKeseluruhan] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [dataRPP, setDataRPP] = useState([])
  const [dataMilestones, setDataMilestones] = useState([])
  const [dataCapaianMingguan, setDataCapaianMingguan] = useState([])
  const [dataDeliverables, setDataDeliverables] = useState([])
  const [dataJadwalPenyelesaianKeseluruhan, setDataJadwalPenyelesaianKeseluruhan] = useState([])
  const [isSuccessInputEdit, setIsSuccessInputEdit] = useState([])

  /**LIMIT PANGURANGAN HARI DALAM MINGGU */
  const [limitMinusDay, setLimitMinusDay] = useState()

  /** HANDLE EDIT DELIVEREBLES MODAL AND DATA */
  const [isModalDeliverablesEditOpen, setIsModalDeliverablesEditOpen] = useState(false)
  const [dataDeliverablesEdit, setDataDeliverablesEdit] = useState([])
  const [dataDeliverablesEditChangeDeliverables, setDataDeliverablesEditChangeDeliverables] =
    useState([])
  const [dataDeliverablesEditChangeDueDate, setDataDeliverablesEditChangeDueDate] = useState([])

  /** HANDLE MODAL EDIT DELIVERABLES*/
  const showModalDeliverablesEdit = (data) => {
    setDataDeliverablesEditChangeDeliverables(undefined)
    setDataDeliverablesEditChangeDueDate(undefined)
    setDataDeliverablesEdit({ duedate: data.duedate, deliverables: data.deliverables, id: data.id })
    setIsModalDeliverablesEditOpen(true)
  }

  const handleCancelModalDeliverablesEdit = () => {
    setIsModalDeliverablesEditOpen(false)
  }

  /** PUT EDIT DELIVERABLES */
  const putDataDeliverablesEdit = async () => {
    await axios
      .put(`http://localhost:1337/api/deliverables/${dataDeliverablesEdit.id}`, {
        data: {
          deliverables: dataDeliverablesEditChangeDeliverables,
          duedate: dataDeliverablesEditChangeDueDate,
        },
      })
      .then((res) => {
        console.log(res)
        console.log(res.data.data)
        setIsModalDeliverablesEditOpen(false)
        notification.success({ message: 'Data deliverables berhasil diubah' })
      })

    refreshDataRPP()
  }

  /**HANDLE MODAL AND DATA EDIT MILESTONES */
  const [isModalMilestonesEditOpen, setIsModalMilestonesEditOpen] = useState(false)
  const [dataMilestonesEdit, setDataMilestonesEdit] = useState([])
  const [popoverStartDate, setPopoverStartDate] = useState([])
  const [dataMilestonesEditDeskripsi, setDataMilestonesEditDeskripsi] = useState()
  const [dataMilestonesEditTanggalMulai, setDataMilestonesEditTanggalMulai] = useState()
  const [dataMilestonesEditTanggalSelesai, setDataMilestonesEditTanggalSelesai] = useState()

  /** HANDLE MODAL EDIT MILESTONES*/
  const showModalMilestonesEdit = (data, popover) => {
    setDataMilestonesEditDeskripsi(undefined)
    setDataMilestonesEditTanggalMulai(undefined)
    setDataMilestonesEditTanggalSelesai(undefined)
    setDataMilestonesEdit(data)
    setPopoverStartDate(popover)
    setIsModalMilestonesEditOpen(true)
  }

  const handleCancelModalMilestonesEdit = () => {
    setIsModalMilestonesEditOpen(false)
  }

  /** PUT DATA MILESTONES */
  const putDataMilestonesEdit = async () => {
    await axios
      .put(`http://localhost:1337/api/milestones/${dataMilestonesEdit.id}`, {
        data: {
          deskripsi: dataMilestonesEditDeskripsi,
          tanggalmulai: dataMilestonesEditTanggalMulai,
          tanggalselesai: dataMilestonesEditTanggalSelesai,
        },
      })
      .then((res) => {
        console.log(res)
        console.log(res.data.data)
        setIsModalMilestonesEditOpen(false)
        notification.success({ message: 'Data milestones berhasil diubah' })
      })
    refreshDataRPP()
  }

  /**HANDLE MODAL AND DATA EDIT RENCANA CAPAIAN MINGGUAN */
  const [isModalRencanaCapaianMingguanEditOpen, setIsModalRencanaCapaianMingguanEditOpen] =
    useState(false)
  const [dataRencanaCapaianMingguanEdit, setDataRencanaCapaianMingguanEdit] = useState([])
  const [dataRencanaCapaianMingguanEditRencana, setDataRencanaCapaianMingguanEditRencana] =
    useState()
  const [
    dataRencanaCapaianMingguanEditTanggalMulai,
    setDataRencanaCapaianMingguanEditTanggalMulai,
  ] = useState()
  const [
    dataRencanaCapaianMingguanEditTanggalBerakhir,
    setDataRencanaCapaianMingguanEditTanggalBerakhir,
  ] = useState()

  /** HANDLE MODAL EDIT RENCANA CAPAIAN MINGGUAN*/
  const showModalRencanaCapaianMingguanEdit = (data) => {
    setDataRencanaCapaianMingguanEditRencana(undefined)
    setDataRencanaCapaianMingguanEditTanggalMulai(undefined)
    setDataRencanaCapaianMingguanEditTanggalBerakhir(undefined)
    setDataRencanaCapaianMingguanEdit(data)
    setIsModalRencanaCapaianMingguanEditOpen(true)
  }

  const handleCancelModalRencanaCapaianMingguanEdit = () => {
    setIsModalRencanaCapaianMingguanEditOpen(false)
  }

  /** PUT DATA RENCANA CAPAIAN MINGGUAN */
  const putDataRencanaCapaianMingguanEdit = async () => {
    await axios
      .put(
        `http://localhost:1337/api/rencanacapaianmingguans/${dataRencanaCapaianMingguanEdit.id}`,
        {
          data: {
            rencanacapaian: dataRencanaCapaianMingguanEditRencana,
            tanggalmulai: dataRencanaCapaianMingguanEditTanggalMulai,
            tanggalberakhir: dataRencanaCapaianMingguanEditTanggalBerakhir,
          },
        },
      )
      .then((res) => {
        console.log(res)
        console.log(res.data.data)
        setIsModalRencanaCapaianMingguanEditOpen(false)
        notification.success({ message: 'Data Rencana Capaian Mingguan Berhasil Diubah' })
      })

    refreshDataRPP()
  }

  /**HANDLE MODAL AND DATA EDIT JADWAL PENYELESAIAN */
  const [isModalJadwalPenyelesaianEditOpen, setIsModalJadwalPenyelesaianEditOpen] = useState(false)
  const [dataJadwalPenyelesaianEdit, setDataJadwalPenyelesaianEdit] = useState([])
  const [handleStatusStartWeekDatePicker, setHandleStatusStartWeekDatePicker] = useState()
  const [dataJadwalPenyelesaianEditButirPekerjaan, setDataJadwalPenyelesaianEditButirPekerjaan] =
    useState()
  const [dataJadwalPenyelesaianEditJenisPekerjaan, setDataJadwalPenyelesaianEditJenisPekerjaan] =
    useState()
  const [dataJadwalPenyelesaianEditTanggalMulai, setDataJadwalPenyelesaianEditTanggalMulai] =
    useState()
  const [dataJadwalPenyelesaianEditTanggalSelesai, setDataJadwalPenyelesaianEditTanggalSelesai] =
    useState()

  /** HANDLE MODAL EDIT RENCANA CAPAIAN MINGGUAN*/
  const showModalJadwalPenyelesaianEdit = (data, statusDatePickerStart) => {
    setDataJadwalPenyelesaianEditButirPekerjaan(undefined)
    setDataJadwalPenyelesaianEditJenisPekerjaan(undefined)
    setDataJadwalPenyelesaianEditTanggalMulai(undefined)
    setDataJadwalPenyelesaianEditTanggalSelesai(undefined)
    setHandleStatusStartWeekDatePicker(statusDatePickerStart)
    setDataJadwalPenyelesaianEdit(data)
    setIsModalJadwalPenyelesaianEditOpen(true)
  }

  const handleCancelModalJadwalPenyelesaianEdit = () => {
    setIsModalJadwalPenyelesaianEditOpen(false)
  }

  /** ADD DATA TO RPP */
  /** HANDLE ADD DELIVERABLES */
  const postDataDeliverablesAdditional = async(data) =>{
    let id_rpp = parseInt(PESERTA_ID_RPP_EDIT)
    console.log('data', data)
    console.log('id_rpp', id_rpp)
    for(var i in data){
      var iterator = 1
      await axios.post(`http://localhost:1337/api/deliverables`,{
        'data' : {
          'deliverables' : data[i].deliverables,
          'duedate' : data[i].date,
          'rpp' : {
            'connect' : id_rpp
          }
        }
      }).then((res)=>{
        setIsSuccessInputEdit(true)
        console.log(res)
      })
      iterator++
      if(iterator === data.length){
        notification.success({message:'Data Milestones Berhasil Ditambahkan!!!'})
      }
      
    }
    refreshDataRPP()
    setNoOfRowsMilestones(0)
    setMilestones(undefined)
    forceUpdate()

   
  }

  /** HANDLE ADD MILESTONES */
  const postDataMilestonesAdditional = async(data) =>{
    for(var i in data){
      await axios.post(`http://localhost:1337/api/milestones`,{
        'data' : {
          'deskripsi' : data[i].deskripsi,
          'tanggalmulai' : data[i].tanggalmulai,
          'tanggalselesai' : data[i].tanggalselesai,
          'rpp' : {
            'connect' : [parseInt( PESERTA_ID_RPP_EDIT)]
        }
      }
      }).then((res)=>{
        setIsSuccessInputEdit(true)
        console.log(res)
      })
    }
    refreshDataRPP()
  }


  /** PUT DATA JADWAL PENYELESAIAN */
  const putDataJadwalPenyelesaianEdit = async () => {
    await axios
      .put(
        `http://localhost:1337/api/jadwalpenyelesaiankeseluruhans/${dataJadwalPenyelesaianEdit.id}`,
        {
          data: {
            butirpekerjaan: dataJadwalPenyelesaianEditButirPekerjaan,
            jenispekerjaan: dataJadwalPenyelesaianEditJenisPekerjaan,
            tanggalmulai: dataJadwalPenyelesaianEditTanggalMulai,
            tanggalselesai: dataJadwalPenyelesaianEditTanggalSelesai,
          },
        },
      )
      .then((res) => {
        console.log(res)
        console.log(res.data.data)
        setIsModalJadwalPenyelesaianEditOpen(false)
        notification.success({ message: 'Data Jadwal Penyelesaian Keseluruhan Berhasil Diubah' })
      })

    refreshDataRPP()
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet)
  }

  function changePageBack() {
    changePage(-1)
  }

  function changePageNext() {
    changePage(+1)
  }

  /**REFRESH DATA */
  const refreshDataRPP = async () => {
    await axios
      .get(`http://localhost:1337/api/rpps?populate=*&filters[id][$eq]=${PESERTA_ID_RPP_EDIT}`)
      .then((response) => {
        console.log(response.data.data)
        setDataRPP({
          tanggal_mulai: response.data.data[0].attributes.tanggal_mulai,
          tanggal_selesai: response.data.data[0].attributes.tanggal_selesai,
          perankelompok: response.data.data[0].attributes.perankelompok,
          waktupengisian: response.data.data[0].attributes.waktupengisian,
          judulpekerjaan: response.data.data[0].attributes.judulpekerjaan,
          deskripsi_tugas: response.data.data[0].attributes.deskripsi_tugas,
          status: response.data.data[0].status,
        })

        /** SET DATA MILESTONES */
        var temp_mil = []
        var temp_mil1 = []
        temp_mil = response.data.data[0].attributes.milestones.data
        var temp_milestone = function (obj) {
          for (var i in obj) {
            temp_mil1.push({
              id: obj[i].id,
              deskripsi: obj[i].attributes.deskripsi,
              tanggalmulai: obj[i].attributes.tanggalmulai,
              tanggalselesai: obj[i].attributes.tanggalselesai,
            })
          }
        }

        temp_milestone(temp_mil)
        setDataMilestones(temp_mil1)
        console.log('milestones', temp_mil1)

        /**SET DATA DELIVERABLES */
        var temp_del = []
        var temp_del1 = []
        temp_del = response.data.data[0].attributes.deliverables.data
        var temp_deliverables = function (obj) {
          for (var i in obj) {
            temp_del1.push({
              id: obj[i].id,
              duedate: obj[i].attributes.duedate,
              deliverables: obj[i].attributes.deliverables,
            })
          }
        }

        temp_deliverables(temp_del)
        setDataDeliverables(temp_del1)
        console.log('deliverables', temp_del1)

        /**SET DATA RENCANA CAPAIAN MINGGUAN */
        var temp_rcm = []
        var temp_rcm1 = []
        temp_rcm = response.data.data[0].attributes.rencanacapaianmingguans.data
        var temp_rencanaCapaianMingguan = function (obj) {
          for (var i in obj) {
            temp_rcm1.push({
              id: obj[i].id,
              rencanacapaian: obj[i].attributes.rencanacapaian,
              tanggalmulai: obj[i].attributes.tanggalmulai,
              tanggalberakhir: obj[i].attributes.tanggalberakhir,
            })
          }
        }

        temp_rencanaCapaianMingguan(temp_rcm)
        setDataCapaianMingguan(temp_rcm1)
        console.log('capaian mingguan', temp_rcm1)

        /** JADWAL PENYELESAIAN KESELURUHAN */
        let temp_jadwalKeseluruhan = []
        let temp_jadwalKeseluruhan1 = []
        temp_jadwalKeseluruhan =
          response.data.data[0].attributes.jadwalpenyelesaiankeseluruhans.data
        let temp_jadwalKeseluruhans = function (obj) {
          for (var i in obj) {
            temp_jadwalKeseluruhan1.push({
              id: obj[i].id,
              jenispekerjaan: obj[i].attributes.jenispekerjaan,
              butirpekerjaan: obj[i].attributes.butirpekerjaan,
              tanggalmulai: obj[i].attributes.tanggalmulai,
              tanggalselesai: obj[i].attributes.tanggalselesai,
            })
          }
        }

        temp_jadwalKeseluruhans(temp_jadwalKeseluruhan)
        setDataJadwalPenyelesaianKeseluruhan(temp_jadwalKeseluruhan1)
        console.log('capaian mingguan', temp_jadwalKeseluruhan1)
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

  /** LOADING HANDLING */
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
  }

  /** HANDLE ADD DELIVERABLES DATA */

  /**HANDLE FAILED INPUT */
  const onFinishFailed = () => {
    message.error('Submit gagal pastikan semua data terisi !!!')
  }

  /**HANDLE INPUT TANGGAL PEKERJAAN (TANGGAL PERENCANAAN)  */
  const handleInputTanggalPengerjaan = (tanggal) => {
    var tglmulai = tanggal[0]
    var tglselesai = tanggal[1]
    setTanggalMulaiPekerjaan(tglmulai)
    setTanggalBerakhirPekerjaan(tglselesai)
  }

  /** SAVE DATA DELIVERABLES TO STATE OF DELIVERABLES */
  const handleDataDeliverables = (index, event, type) => {
    console.log(index, event, type)
    let data = [...deliverables]
    data[index][type] = event
    setDeliverables(data)
    console.log('data deliverables=> ', deliverables)
  }

  const handleAddRowDeliverables = () => {
    setNoOfRowsDeliverables(noOfRowsDeliverables + 1)
    let newField = { deliverables: '', date: '' }
    setDeliverables([...deliverables, newField])
  }

  const handleDropRowDeliverables = () => {
    console.log('sebelum apus', deliverables)
    console.log(deliverables.length)
    console.log(deliverables)
    var will_delete = deliverables.length - 1
    var temp = []
    var tempDeliverables = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempDeliverables(deliverables)
    setDeliverables(temp)
    console.log('del', deliverables)
    setNoOfRowsDeliverables(noOfRowsDeliverables - 1)
  }

  /** SAVE DATA MILESTONES TO STATE OF MILESTONES */
  const handleDataMilestones = (index, event, type) => {
    console.log(index, event, type)
    let data = [...milestones]
    data[index][type] = event
    setMilestones(data)
    console.log('data milestones=> ', milestones)
  }

  const handleAddRowMilestones = () => {
    let newField = { deskripsi: ' ', tanggalmulai: ' ', tanggalselesai: ' ' }
    setMilestones([...milestones, newField])
    setNoOfRowsMilestones(noOfRowsMilestones + 1)
  }

  const handleDropRowMilestones = () => {
    console.log('sebelum apus milestones', milestones)
    console.log(milestones.length)
    console.log(milestones)
    var will_delete = milestones.length - 1
    var temp = []
    var tempMilestones = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempMilestones(milestones)
    setMilestones(temp)
    console.log('del milestones', milestones)
    setNoOfRowsMilestones(noOfRowsMilestones - 1)
  }

  /** SAVE DATA RENCANA CAPAIAN PERMINGGU TO STATE OF RENCANA CAPAIAN PERMINGGU */
  const handleDataRencanaCapaianPerminggu = (index, event, type) => {
    console.log(index, event, type)
    let data = [...capaianPerminggu]
    data[index][type] = event
    setCapaianPerminggu(data)
    console.log('data capaianperminggu=> ', capaianPerminggu)
  }

  const handleAddRowRencanaCapaianPerminggu = () => {
    let newField = { tanggal: '', rencana: '' }
    setCapaianPerminggu([...capaianPerminggu, newField])
    setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu + 1)
  }

  const handleDropRowRencanaCapaianPerminggu = () => {
    console.log('sebelum apus rcm', capaianPerminggu)
    console.log(capaianPerminggu.length)
    var will_delete = capaianPerminggu.length - 1
    var temp = []
    var tempCapaianPerminggu = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempCapaianPerminggu(capaianPerminggu)
    setCapaianPerminggu(temp)
    console.log('del capaian', capaianPerminggu)
    setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu - 1)
  }

  /** SAVE DATA JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN TO SET STATE OF JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN */
  const handleDataJadwalPenyelesaianKeseluruhan = (index, event, type) => {
    console.log(index, event, type)
    let data = [...jadwalPenyelesaianKeseluruhan]
    data[index][type] = event
    SetJadwalPenyelesaianKeseluruhan(data)
    console.log('data jadwal penyelesaian=> ', jadwalPenyelesaianKeseluruhan)
  }

  const handleAddRowJadwalPenyelesaianKeseluruhan = () => {
    let newField = { minggumulai: '', mingguselesai: '', butirpekerjaan: '', jenispekerjaan: '' }
    SetJadwalPenyelesaianKeseluruhan([...jadwalPenyelesaianKeseluruhan, newField])
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan + 1,
    )
  }

  const handleDropRowJadwalPenyelesaianKeseluruhan = () => {
    console.log('sebelum apus perencanaan', jadwalPenyelesaianKeseluruhan)
    console.log(jadwalPenyelesaianKeseluruhan.length)
    var will_delete = jadwalPenyelesaianKeseluruhan.length - 1
    var temp = []
    var tempJadwalKeseluruhan = function (obj) {
      for (var i in obj) {
        console.log('[', i)
        console.log(']', will_delete)
        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempJadwalKeseluruhan(jadwalPenyelesaianKeseluruhan)
    SetJadwalPenyelesaianKeseluruhan(temp)
    console.log('del peyelesaian', jadwalPenyelesaianKeseluruhan)
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan - 1,
    )
  }

  /** FUNCTIONAL */
  /**get data date berdasarkan minggu dalam tahun */

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    var ISOweekStart = simple
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    return formatDate(ISOweekStart.toDateString())
  }

  function getEndDateOfWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    console.log('dow =>', dow)
    var ISOweekStart = simple
    console.log('dow =>', ISOweekStart)
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }

    ISOweekStart.setDate(ISOweekStart.getDate() + 4)
    return formatDate(ISOweekStart.toDateString())
  }

  /** HANDLE RANGE DATE SAAT MEMILIH  */
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day')
  }

  const getWeekBasedOnDate = (date) => {
    var year = new Date(date.getFullYear(), 0, 1)
    var days = Math.floor((date - year) / (24 * 60 * 60 * 1000))
    var week = Math.ceil((date.getDay() + 1 + days) / 7)

    return week
  }

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const aksiLihatLebihJelasRPP = () => {
    history.push(`/rencanaPenyelesaianProyek/peserta/formPengisianRPP/contohPengisianRPP`)
  }

  useEffect(() => {
    const getRPP = async () => {
      await axios
        .get(`http://localhost:1337/api/rpps?populate=*&filters[id][$eq]=${PESERTA_ID_RPP_EDIT}`)
        .then((response) => {
          console.log(response.data.data)
          setDataRPP({
            tanggal_mulai: response.data.data[0].attributes.tanggal_mulai,
            tanggal_selesai: response.data.data[0].attributes.tanggal_selesai,
            perankelompok: response.data.data[0].attributes.perankelompok,
            waktupengisian: response.data.data[0].attributes.waktupengisian,
            judulpekerjaan: response.data.data[0].attributes.judulpekerjaan,
            deskripsi_tugas: response.data.data[0].attributes.deskripsi_tugas,
            status: response.data.data[0].status,
          })

          /** SET DATA MILESTONES */
          var temp_mil = []
          var temp_mil1 = []
          temp_mil = response.data.data[0].attributes.milestones.data
          var temp_milestone = function (obj) {
            for (var i in obj) {
              temp_mil1.push({
                id: obj[i].id,
                deskripsi: obj[i].attributes.deskripsi,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalselesai: obj[i].attributes.tanggalselesai,
              })
            }
          }

          temp_milestone(temp_mil)
          setDataMilestones(temp_mil1)
          console.log('milestones', temp_mil1)

          /**SET DATA DELIVERABLES */
          var temp_del = []
          var temp_del1 = []
          temp_del = response.data.data[0].attributes.deliverables.data
          var temp_deliverables = function (obj) {
            for (var i in obj) {
              temp_del1.push({
                id: obj[i].id,
                duedate: obj[i].attributes.duedate,
                deliverables: obj[i].attributes.deliverables,
              })
            }
          }

          temp_deliverables(temp_del)
          setDataDeliverables(temp_del1)
          console.log('deliverables', temp_del1)

          /**SET DATA RENCANA CAPAIAN MINGGUAN */
          var temp_rcm = []
          var temp_rcm1 = []
          temp_rcm = response.data.data[0].attributes.rencanacapaianmingguans.data
          var temp_rencanaCapaianMingguan = function (obj) {
            for (var i in obj) {
              temp_rcm1.push({
                id: obj[i].id,
                rencanacapaian: obj[i].attributes.rencanacapaian,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalberakhir: obj[i].attributes.tanggalberakhir,
              })
            }
          }

          temp_rencanaCapaianMingguan(temp_rcm)
          setDataCapaianMingguan(temp_rcm1)
          console.log('capaian mingguan', temp_rcm1)

          /** JADWAL PENYELESAIAN KESELURUHAN */
          let temp_jadwalKeseluruhan = []
          let temp_jadwalKeseluruhan1 = []
          temp_jadwalKeseluruhan =
            response.data.data[0].attributes.jadwalpenyelesaiankeseluruhans.data
          let temp_jadwalKeseluruhans = function (obj) {
            for (var i in obj) {
              temp_jadwalKeseluruhan1.push({
                id: obj[i].id,
                jenispekerjaan: obj[i].attributes.jenispekerjaan,
                butirpekerjaan: obj[i].attributes.butirpekerjaan,
                tanggalmulai: obj[i].attributes.tanggalmulai,
                tanggalselesai: obj[i].attributes.tanggalselesai,
              })
            }
          }

          temp_jadwalKeseluruhans(temp_jadwalKeseluruhan)
          setDataJadwalPenyelesaianKeseluruhan(temp_jadwalKeseluruhan1)
          console.log('capaian mingguan', temp_jadwalKeseluruhan1)
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

    getRPP()
    setHandleStatusStartWeekDatePicker(false)
  }, [history])

  const columnDeliverables = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL',
      dataIndex: 'duedate',
      key: 'duedate',
      width: '20%',
    },
    {
      title: 'DELIVERABLES',
      dataIndex: 'deliverables',
      key: 'deliverables',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()

        /**MENGAMBIL TANGGAL HARI INI + SISA NYA(DALAM MINGGU) / MENGAMBIL TANGGAL AKHIR DIMINGGU INI */
        dateLimit.setDate(dateLimit.getDate() + (7 - new Date().getDay()))
        let recDueDate = new Date(record.duedate)
        // console.log(recDueDate, dateLimit, '---', recDueDate > dateLimit)

        if (recDueDate > dateLimit) {
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-deliverables"
                shape="circle"
                onClick={() => {
                  showModalDeliverablesEdit(record)
                  // console.log(record)
                  // console.log('CLICK EDIT DELIVERABLES')
                }}
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        } else {
          return (
            <Popover content={<div>Pengeditan tidak diizinkan</div>}>
              <Button
                id="button-edit-deliverables"
                disabled
                shape="circle"
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        }
      },
    },
  ]

  const columnMiletones = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL MULAI',
      dataIndex: 'tanggalmulai',
      key: 'tanggalmulai',
      width: '10%',
    },
    {
      title: 'TANGGAL SELESAI',
      dataIndex: 'tanggalselesai',
      key: 'tanggalselesai',
      width: '10%',
    },
    {
      title: 'DESKRIPSI',
      dataIndex: 'deskripsi',
      key: 'deskripsi',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()

        /**MENGAMBIL TANGGAL HARI INI + SISA NYA(DALAM MINGGU) / MENGAMBIL TANGGAL AKHIR DIMINGGU INI */
        dateLimit.setDate(dateLimit.getDate() + (7 - new Date().getDay()))
        let recStartDate = new Date(record.tanggalmulai)
        let recFinishDate = new Date(record.tanggalselesai)
        let popoverSD
        // console.log(recDueDate, dateLimit, '---', recDueDate > dateLimit)

        if (recFinishDate > dateLimit) {
          if (recStartDate > dateLimit) {
            popoverSD = 'Tanggal mulai masih dapat diedit'
          } else {
            popoverSD = 'Tanggal mulai tidak dapat diedit'
          }
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-milestones"
                shape="circle"
                onClick={() => {
                  showModalMilestonesEdit(record, popoverSD)
                  console.log(record)
                }}
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        } else {
          return (
            <Popover content={<div>Pengeditan tidak diizinkan</div>}>
              <Button
                id="button-edit-milestones"
                disabled
                shape="circle"
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        }
      },
    },
  ]

  const columnRencanaCapaianMingguan = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL MULAI',
      dataIndex: 'tanggalmulai',
      key: 'tanggalmulai',
      width: '20%',
    },
    {
      title: 'TANGGAL BERAKHIR',
      dataIndex: 'tanggalberakhir',
      key: 'tanggalberakhir',
      width: '20%',
    },
    {
      title: 'RENCANA CAPAIAN',
      dataIndex: 'rencanacapaian',
      key: 'rencanacapaian',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()

        /**MENGAMBIL TANGGAL HARI INI + SISA NYA(DALAM MINGGU) / MENGAMBIL TANGGAL AKHIR DIMINGGU INI */
        dateLimit.setDate(dateLimit.getDate() + (7 - new Date().getDay()))
        let recStartDate = new Date(record.tanggalmulai)
        let recFinishDate = new Date(record.tanggalberakhir)

        // console.log(recDueDate, dateLimit, '---', recDueDate > dateLimit)

        if (recStartDate > dateLimit) {
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-rencana-capaian-perminggu"
                shape="circle"
                onClick={() => {
                  console.log(record)
                  showModalRencanaCapaianMingguanEdit(record)
                }}
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        } else {
          return (
            <Popover content={<div>Pengeditan tidak diizinkan</div>}>
              <Button
                id="button-edit-rencana-capaian-perminggu"
                disabled
                shape="circle"
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        }
      },
    },
  ]

  const columnJadwalPenyelesaianKeseluruhan = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'TANGGAL MULAI',
      dataIndex: 'tanggalmulai',
      key: 'tanggalmulai',
      width: '10%',
    },
    {
      title: 'TANGGAL SELESAI',
      dataIndex: 'tanggalselesai',
      key: 'tanggalselesai',
      width: '10%',
    },
    {
      title: 'JENISPEKERJAAN',
      dataIndex: 'jenispekerjaan',
      key: 'jenispekerjaan',
      width: '20%',
    },
    {
      title: 'BUTIRPEKERJAAN',
      dataIndex: 'butirpekerjaan',
      key: 'butirpekerjaan',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()
        let minusToGetLimit = new Date().getDay()
        if (minusToGetLimit === 0) {
          setLimitMinusDay(7)
        } else {
          setLimitMinusDay(minusToGetLimit)
        }

        /**MENGAMBIL TANGGAL HARI INI + SISA NYA(DALAM MINGGU) / MENGAMBIL TANGGAL AKHIR DIMINGGU INI */
        dateLimit.setDate(dateLimit.getDate() + (7 - limitMinusDay))
        let recStartDate = new Date(record.tanggalmulai)
        let recFinishDate = new Date(record.tanggalselesai)
        let weekOnDateFinish = getWeekBasedOnDate(recFinishDate) - 1
        let yearOnDateFinish = record.tanggalselesai.slice(0, 4)
        let limitDateGetMondayDateBasedOnFinishDate = getDateOfISOWeek(
          weekOnDateFinish,
          yearOnDateFinish,
        )
        let monLimit = new Date(limitDateGetMondayDateBasedOnFinishDate)
        let limitDateToEdit = formatDate(dateLimit.toDateString())
        let statusDatePickerStart

        // console.log(recDueDate, dateLimit, '---', recDueDate > dateLimit)

        if (limitDateGetMondayDateBasedOnFinishDate > limitDateToEdit) {
          if (record.tanggalmulai > limitDateToEdit) {
            statusDatePickerStart = false //jika belum limit , disable nya di false,(tidak di disable)
          } else {
            statusDatePickerStart = true
          }
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-jadwal-penyelesaian"
                shape="circle"
                onClick={() => {
                  console.log(record)
                  showModalJadwalPenyelesaianEdit(record, statusDatePickerStart)

                  console.log(dateLimit)
                  console.log(weekOnDateFinish)
                  console.log(yearOnDateFinish)
                  console.log(limitDateGetMondayDateBasedOnFinishDate)
                  console.log(monLimit)

                  // console.log(limitDateGetMondayDateBasedOnFinishDate>limitDateToEdit)
                }}
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        } else {
          return (
            <Popover content={<div>Pengeditan tidak diizinkan</div>}>
              <Button
                id="button-edit-jadwal-penyelesaian"
                disabled
                shape="circle"
                style={{ backgroundColor: '#fff566', borderColor: '#fff566' }}
              >
                <FontAwesomeIcon icon={faPencil} style={{ color: 'black' }} />
              </Button>
            </Popover>
          )
        }
      },
    },
  ]

  return (
    <>
      <div className="container">
        {/* <button
          onClick={() => {
            // console.log(7-new Date().getDay())
            console.log(dataJadwalPenyelesaianEditButirPekerjaan)
            console.log(dataJadwalPenyelesaianEditJenisPekerjaan)
            console.log(dataJadwalPenyelesaianEditTanggalMulai)
            console.log(dataJadwalPenyelesaianEditTanggalSelesai)
          }}
        >
          teeees
        </button> */}
        <Space>
          <Modal
            title="Format Pengisian Dokumen RPP"
            visible={isModalOpen}
            open={isModalOpen}
            onCancel={handleOk}
            style={{ top: 0 }}
            footer={[
              <Button key="close" onClick={handleOk}>
                Tutup
              </Button>,
            ]}
          >
            <Document file="/contohrpp.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page height="600" pageNumber={pageNumber} />
            </Document>
            <p>
              {' '}
              Page {pageNumber} of {numPages}
            </p>

            <Space wrap>
              {pageNumber > 1 && (
                <Button className="btn-pdf" type="primary" onClick={changePageBack}>
                  Halaman Sebelumnya
                </Button>
              )}
              {pageNumber < numPages && (
                <Button className="btn-pdf" onClick={changePageNext} type="primary">
                  Halaman Selanjutnya
                </Button>
              )}
              <Button className="btn-pdf" type="primary" onClick={() => aksiLihatLebihJelasRPP()}>
                Lihat Lebih Jelas
              </Button>
            </Space>
          </Modal>
        </Space>

        <div className="spacing"></div>
        <h3 align="center" className="title-s">
          FORM PENGISIAN RPP - EDIT RPP
        </h3>
        <Box sx={{ color: 'warning.main' }}>
          Catatan :
          <ul>
            <li>Isi sesuai dengan perencanaan proyek yang diberikan</li>
            <li>
              Data dapat ditambahkan dan diedit apabila tanggal tersebut belum memasuki minggu saat
              ini
            </li>
          </ul>
        </Box>
        <div className="spacebottom"></div>
        <Form
          name="basic"
          form={form}
          className="left"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 1200,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          onFinishFailed={onFinishFailed}
        >
       
          <div className="spacetop">
            <Row>
              <Col style={{ paddingBottom: 20 }} span={8}>
                Tanggal Mulai
              </Col>
              <Col span={8}>{dataRPP.tanggal_mulai}</Col>
            </Row>
            <Row>
              <Col style={{ paddingBottom: 20 }} span={8}>
                Tanggal Selesai
              </Col>
              <Col span={6}>{dataRPP.tanggal_selesai}</Col>
              <Col span={4}>Ubah Tanggal :</Col>
              <Col span={6}>
                <DatePicker
                  picker="date"
                  disabledDate={(current) => {
                    if (new Date().getDay() === 0) {
                      setLimitMinusDay(7)
                    } else {
                      setLimitMinusDay(new Date().getDay())
                    }

                    return (
                      moment().add(-1, 'days') >= current ||
                      moment().add(7 - limitMinusDay, 'days') >= current
                    )
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Topik Pekerjaan
              </Col>
              <Col span={8}>{dataRPP.judulpekerjaan}</Col>
              <Col></Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Peran Kelompok
              </Col>
              <Col span={8}>{dataRPP.perankelompok}</Col>
              <Col></Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Deskripsi Tugas
              </Col>
              <Col span={8}>{dataRPP.deskripsi_tugas}</Col>
              <Col></Col>
            </Row>
          </div>

          <div style={{ border: '1' }}>
            <br />
            <div className="spacebottom"></div>

            {/* DELIVERABLES   */}
            <h4>DELIVERABLES</h4>
            <hr />
            <Table columns={columnDeliverables} dataSource={dataDeliverables} />
            <div className="spacebottom" />

            {[...Array(noOfRowsDeliverables)].map((elementInArray, index) => {
              return (
                <div className="site-space-compact-wrapper" key={index}>
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name={`deliverables${index}`}
                        key={index}
                        label={index + 1}
                        rules={[
                          { required: true, message: 'Masukkan deliverables terlebih dahulu !' },
                        ]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          placeholder="Masukkan deliverables"
                          value={deliverables.deliverables}
                          onChange={(event) => {
                            handleDataDeliverables(index, event.target.value, 'deliverables')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <DatePicker
                        disabledDate={(current) => {
                          let minusToGetLimit = new Date().getDay()
                          if (minusToGetLimit === 0) {
                            setLimitMinusDay(7)
                          } else {
                            setLimitMinusDay(minusToGetLimit)
                          }

                          return (
                            moment().add(-1, 'days') >= current ||
                            moment().add(7 - limitMinusDay, 'days') >= current
                          )
                        }}
                        style={{ width: '70%' }}
                        value={deliverables.date}
                        onChange={(date, datestring) =>
                          handleDataDeliverables(index, datestring, 'date')
                        }
                      />
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <Button type="primary" onClick={() => handleAddRowDeliverables()}>
                Tambah Data
              </Button>
              {noOfRowsDeliverables !== 0 && (
                <>
                  <Button type="primary" danger onClick={() => handleDropRowDeliverables()}>
                    Hapus Baris Terakhir
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log(deliverables)
                      postDataDeliverablesAdditional(deliverables)
                    }}
                  >
                    Simpan Data
                  </Button>
                </>
              )}
            </Col>
          </div>

          <hr />

          {/* MILESTONES */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <h4>MILESTONES</h4>
            <hr />

            <Table columns={columnMiletones} dataSource={dataMilestones} />
            <Row>
              <Col span={16}>
                {' '}
                <b>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  MILESTONES
                </b>
              </Col>
              <Col span={8}>
                {' '}
                <b>TANGGAL MULAI DAN SELESAI</b>
              </Col>
            </Row>
            {[...Array(noOfRowsMilestones)].map((elementInArray, index) => {
              return (
                <div className="site-space-compact-wrapper" key={index}>
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name={`milestones${index}`}
                        key={index}
                        style={{ width: '100%' }}
                        label={index + 1}
                        rules={[
                          { required: true, message: 'Masukkan milestones terlebih dahulu !' },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          value={milestones.deskripsi}
                          style={{ width: '100%' }}
                          placeholder="Masukkan milestones"
                          onChange={(event) => {
                            handleDataMilestones(index, event.target.value, 'deskripsi')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <RangePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                          let minusToGetLimit = new Date().getDay()
                          if (minusToGetLimit === 0) {
                            setLimitMinusDay(7)
                          } else {
                            setLimitMinusDay(minusToGetLimit)
                          }

                          return (
                            moment().add(-1, 'days') >= current ||
                            moment().add(7 - limitMinusDay, 'days') >= current
                          )
                        }}
                        onChange={(date, datestring) => {
                          handleDataMilestones(index, datestring[0], 'tanggalmulai')
                          handleDataMilestones(index, datestring[1], 'tanggalselesai')
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <Button type="primary" onClick={() => handleAddRowMilestones()}>
                Tambah Data
              </Button>
              {noOfRowsMilestones !== 0 && (
                <>
                  <Button type="primary" danger onClick={() => handleDropRowMilestones()}>
                    Hapus Baris Terakhir
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log(milestones)
                      postDataMilestonesAdditional(milestones)
                    }}
                  >
                    Simpan Data
                  </Button>
                </>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          {/* RENCANA CAPAIAN PERMINGGU */}
          <div>
            <br />
            <div className="spacebottom"></div>
            <h4>RENCANA CAPAIAN PERMINGGU</h4>
            <hr />

            <Table columns={columnRencanaCapaianMingguan} dataSource={dataCapaianMingguan} />
            {[...Array(noOfRowsCapaianPerminggu)].map((elementInArray, index) => {
              return (
                <div className="site-space-compact-wrapper" key={index}>
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name={`capaian${index}`}
                        key={index}
                        style={{ width: '100%' }}
                        label={index + 1}
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan rencana perminggu terlebih dahulu !',
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          value={capaianPerminggu.deskripsi}
                          style={{ width: '100%' }}
                          placeholder="Masukkan rencana perminggu"
                          onChange={(event) => {
                            handleDataRencanaCapaianPerminggu(index, event.target.value, 'rencana')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={`capaian${index}`}
                        key={index}
                        style={{ width: '100%' }}
                        label="Tanggal"
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan Tanggal Rencana Perminggu Terlebih Dahulu  !!!',
                          },
                          {
                            type: 'date',
                            warningOnly: true,
                          },
                        ]}
                      >
                        <DatePicker
                          picker="week"
                          placeholder="Minggu Ke"
                          disabledDate={(current) => {
                            let minusToGetLimit = new Date().getDay()
                            if (minusToGetLimit === 0) {
                              setLimitMinusDay(7)
                            } else {
                              setLimitMinusDay(minusToGetLimit)
                            }

                            return (
                              moment().add(-1, 'days') >= current ||
                              moment().add(7 - limitMinusDay, 'days') >= current
                            )
                          }}
                          size="middle"
                          style={{ width: '100%' }}
                          onChange={(date, datestring) => [
                            handleDataRencanaCapaianPerminggu(
                              index,
                              getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                              'tanggalmulai',
                            ),
                            handleDataRencanaCapaianPerminggu(
                              index,
                              getEndDateOfWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                              'tanggalberakhir',
                            ),
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Col>
              <Button type="primary" onClick={() => handleAddRowRencanaCapaianPerminggu()}>
                Tambah Data
              </Button>
              {noOfRowsCapaianPerminggu !== 0 && (
                <>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDropRowRencanaCapaianPerminggu()}
                  >
                    Hapus Baris Terakhir
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => {
                      console.log(capaianPerminggu)
                    }}
                  >
                    Simpan Data
                  </Button>
                </>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

          {/* JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN */}
          <div>
            <br />
            <div className="spacebottom"></div>

            <h4>JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN</h4>
            <hr />
            <Table
              columns={columnJadwalPenyelesaianKeseluruhan}
              dataSource={dataJadwalPenyelesaianKeseluruhan}
            />
            {[...Array(noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan)].map(
              (elementInArray, index) => {
                return (
                  <div className="site-space-compact-wrapper" key={index}>
                    <Row>
                      {index + 1} &nbsp;&nbsp;
                      <Col span={8}>
                        <Form.Item
                          name={`penyelesaian${index}`}
                          key={index}
                          style={{ width: '100%' }}
                          rules={[
                            {
                              required: true,
                              message: 'Masukkan jadwal penyelesaian terlebih dahulu !',
                            },
                          ]}
                        >
                          <Input
                            rows={4}
                            value={jadwalPenyelesaianKeseluruhan.butirpekerjaan}
                            style={{ width: '100%' }}
                            placeholder="Butir Pekerjaan"
                            onChange={(event) => {
                              handleDataJadwalPenyelesaianKeseluruhan(
                                index,
                                event.target.value,
                                'butirpekerjaan',
                              )
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Select
                          defaultValue="Jenis Pekerjaan"
                          style={{ width: '100%' }}
                          onChange={(value) =>
                            handleDataJadwalPenyelesaianKeseluruhan(index, value, 'jenispekerjaan')
                          }
                          options={[
                            { value: 'exploration', label: 'Exploration' },
                            { value: 'design', label: 'Design' },
                            { value: 'implementasi', label: 'Implementation' },
                            { value: 'testing', label: 'Testing' },
                          ]}
                        />
                      </Col>
                      <Col span={8}>
                        <RangePicker
                          picker="week"
                          placeholder="Minggu Ke"
                          disabledDate={(current) => {
                            let minusToGetLimit = new Date().getDay()
                            if (minusToGetLimit === 0) {
                              setLimitMinusDay(7)
                            } else {
                              setLimitMinusDay(minusToGetLimit)
                            }

                            return (
                              moment().add(-1, 'days') >= current ||
                              moment().add(7 - limitMinusDay, 'days') >= current
                            )
                          }}
                          size="middle"
                          style={{ width: '100%' }}
                          onChange={(date, datestring) => {
                            handleDataJadwalPenyelesaianKeseluruhan(
                              index,
                              getDateOfISOWeek(
                                datestring[0].slice(5, 7),
                                datestring[0].slice(0, 4),
                              ),
                              'minggumulai',
                            )
                            handleDataJadwalPenyelesaianKeseluruhan(
                              index,
                              getEndDateOfWeek(
                                datestring[1].slice(5, 7),
                                datestring[1].slice(0, 4),
                              ),
                              'mingguselesai',
                            )
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                )
              },
            )}
            <Col>
              <Button type="primary" onClick={() => handleAddRowJadwalPenyelesaianKeseluruhan()}>
                Tambah Data
              </Button>
              {noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan !== 0 && (
                <>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDropRowJadwalPenyelesaianKeseluruhan()}
                  >
                    Hapus Baris Terakhir
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => {
                      console.log(jadwalPenyelesaianKeseluruhan)
                    }}
                  >
                    Simpan Data
                  </Button>
                </>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>
        </Form>
      </div>

      {/* MODAL EDIT DELIVERABLES */}
      <Modal
        title="Edit Deliverables"
        open={isModalDeliverablesEditOpen}
        // onOk={handleOkModalDeliverablesEdit}
        onCancel={handleCancelModalDeliverablesEdit}
        footer={false}
        destroyOnClose
      >
        <Form
          name="form_edit_deliverables"
          form={formDeliverables}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={dataDeliverablesEdit}
          autoComplete="off"
          fields={[
            {
              name: ['deliverables'],
              value: dataDeliverablesEdit.deliverables,
            },
            {
              name: ['duedate'],
              value: dataDeliverablesEdit.duedate,
            },
          ]}
        >
          <Form.Item
            label="Deliverables"
            rules={[
              {
                required: true,
                message: 'Mohon isi Deliverables !!!',
              },
            ]}
          >
            <TextArea
              defaultValue={dataDeliverablesEdit.deliverables}
              onChange={(e) => {
                setDataDeliverablesEditChangeDeliverables(e.target.value)
              }}
            />
          </Form.Item>

          <Form.Item
            label="Due Date"
            initialValue={dataDeliverablesEdit}
            rules={[
              {
                required: true,
                message: 'Mohon isi Tanggal Deliverables !!!',
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <DatePicker
              defaultValue={dayjs(dataDeliverablesEdit.duedate, dateFormat)}
              onChange={(date, datestring) => {
                setDataDeliverablesEditChangeDueDate(datestring)
              }}
              disabledDate={(current) => {
                let minusToGetLimit = new Date().getDay()
                if (minusToGetLimit === 0) {
                  setLimitMinusDay(7)
                } else {
                  setLimitMinusDay(minusToGetLimit)
                }
                return (
                  moment().add(-1, 'days') >= current ||
                  moment().add(7 - limitMinusDay, 'days') >= current
                )
              }}
            />
          </Form.Item>
          <Button type="primary" onClick={putDataDeliverablesEdit}>
            Simpan Perubahan
          </Button>
        </Form>
      </Modal>

      {/* MODAL EDIT MILESTONES */}
      <Modal
        title="Edit Milestones"
        open={isModalMilestonesEditOpen}
        onCancel={handleCancelModalMilestonesEdit}
        footer={false}
        destroyOnClose
      >
        <Form
          name="form_edit_milestones"
          form={formMilestones}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={dataMilestonesEdit}
          autoComplete="off"
          fields={[
            {
              name: ['deskripsi'],
              value: dataMilestonesEdit.deskripsi,
            },
            {
              name: ['tanggalmulai'],
              value: dataDeliverablesEdit.tanggalmulai,
            },
            {
              name: ['tanggalselesai'],
              value: dataDeliverablesEdit.tanggalselesai,
            },
          ]}
        >
          <Form.Item
            label="Deskripsi"
            rules={[
              {
                required: true,
                message: 'Mohon isi Deskripsi !!!',
              },
            ]}
          >
            <TextArea
              defaultValue={dataMilestonesEdit.deskripsi}
              onChange={(e) => setDataMilestonesEditDeskripsi(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Tanggal Mulai"
            initialValue={dataMilestonesEdit}
            rules={[
              {
                required: true,
                message: 'Mohon isi Tanggal Mulai Milestones !!!',
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <Popover content={<div>{popoverStartDate}</div>}>
              <DatePicker
                defaultValue={dayjs(dataMilestonesEdit.tanggalmulai, dateFormat)}
                onChange={(date, datestring) => setDataMilestonesEditTanggalMulai(datestring)}
                disabledDate={(current) => {
                  let minusToGetLimit = new Date().getDay()
                  if (minusToGetLimit === 0) {
                    setLimitMinusDay(7)
                  } else {
                    setLimitMinusDay(minusToGetLimit)
                  }
                  return (
                    moment().add(-1, 'days') >= current ||
                    moment().add(7 - limitMinusDay, 'days') >= current
                  )
                }}
              />
            </Popover>
          </Form.Item>

          <Form.Item
            label="Tanggal Selesai"
            name="tanggalselesaimilestones"
            initialValue={dataMilestonesEdit}
            rules={[
              {
                required: true,
                message: 'Mohon isi Tanggal Selesai Milestones !!!',
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <Popover content={<div>Tanggal selesai masih dapat diedit</div>}>
              <DatePicker
                defaultValue={dayjs(dataMilestonesEdit.tanggalselesai, dateFormat)}
                onChange={(date, datestring) => setDataMilestonesEditTanggalSelesai(datestring)}
                disabledDate={(current) => {
                  let minusToGetLimit = new Date().getDay()
                  if (minusToGetLimit === 0) {
                    setLimitMinusDay(7)
                  } else {
                    setLimitMinusDay(minusToGetLimit)
                  }
                  return (
                    moment().add(-1, 'days') >= current ||
                    moment().add(7 - limitMinusDay, 'days') >= current
                  )
                }}
              />
            </Popover>
          </Form.Item>
          <Button type="primary" onClick={putDataMilestonesEdit}>
            Simpan Perubahan
          </Button>
        </Form>
      </Modal>

      {/* MODAL EDIT RENCANA CAPAIAN MINGGUAN */}
      <Modal
        title="Edit Rencana Capaian PerMinggu"
        open={isModalRencanaCapaianMingguanEditOpen}
        onCancel={handleCancelModalRencanaCapaianMingguanEdit}
        footer={false}
        destroyOnClose
      >
        <Form
          name="form_edit_rencana_capaian_mingguan"
          form={formRencanaCapaianMingguan}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={dataRencanaCapaianMingguanEdit}
          autoComplete="off"
          fields={[
            {
              name: ['rencanacapaian'],
              value: dataRencanaCapaianMingguanEdit.rencanacapaian,
            },
            {
              name: ['tanggalmulai'],
              value: dataRencanaCapaianMingguanEdit.tanggalmulai,
            },
            {
              name: ['tanggalselesai'],
              value: dataRencanaCapaianMingguanEdit.tanggalselesai,
            },
          ]}
        >
          <Form.Item
            label="Rencana Capaian"
            name="rencanacapaianmingguan"
            rules={[
              {
                required: true,
                message: 'Mohon isi Rencana Capaian!!!',
              },
            ]}
          >
            <TextArea
              defaultValue={dataRencanaCapaianMingguanEdit.rencanacapaian}
              onChange={(e) => setDataRencanaCapaianMingguanEditRencana(e.target.value)}
            />
          </Form.Item>

          <br />
          <b>
            {dataRencanaCapaianMingguanEdit.tanggalmulai} &nbsp;s/d&nbsp;{' '}
            {dataRencanaCapaianMingguanEdit.tanggalberakhir}
          </b>
          <Form.Item
            label="Minggu Rencana Capaian"
            rules={[
              {
                required: true,
                message: 'Mohon isi Tanggal Rencana Capaian Mingguan !!!',
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <Popover content={<div>Klik untuk mengubah, jika tidak boleh dikosongkan saja</div>}>
              <DatePicker
                picker="week"
                onChange={(date, datestring) => {
                  console.log(datestring)
                  setDataRencanaCapaianMingguanEditTanggalMulai(
                    getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                  )
                  setDataRencanaCapaianMingguanEditTanggalBerakhir(
                    getEndDateOfWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                  )
                }}
                disabledDate={(current) => {
                  let minusToGetLimit = new Date().getDay()
                  if (minusToGetLimit === 0) {
                    setLimitMinusDay(7)
                  } else {
                    setLimitMinusDay(minusToGetLimit)
                  }

                  return (
                    moment().add(-1, 'days') >= current ||
                    moment().add(7 - limitMinusDay, 'days') >= current
                  )
                }}
              />
            </Popover>
          </Form.Item>
          <Button type="primary" onClick={putDataRencanaCapaianMingguanEdit}>
            Simpan Perubahan
          </Button>
        </Form>
      </Modal>

      {/* MODAL JADWAL PENYELESAIAN KESELURUHAN */}
      <Modal
        title="Edit Penyelesaian Keseluruhan"
        open={isModalJadwalPenyelesaianEditOpen}
        onCancel={handleCancelModalJadwalPenyelesaianEdit}
        footer={false}
        destroyOnClose
      >
        <Form
          name="form_edit_jadwal_penyelesaian"
          form={formJadwalPenyelesaian}
          initialValues={dataJadwalPenyelesaianEdit}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          fields={[
            {
              name: ['butirpekerjaan'],
              value: dataJadwalPenyelesaianEdit.butirpekerjaan,
            },
            {
              name: ['jenispekerjaan'],
              value: dataJadwalPenyelesaianEdit.jenispekerjaan,
            },
            {
              name: ['tanggalmulai'],
              value: dataJadwalPenyelesaianEdit.tanggalmulai,
            },
            {
              name: ['tanggalselesai'],
              value: dataJadwalPenyelesaianEdit.tanggalselesai,
            },
          ]}
        >
          <Form.Item
            label="Butir Pekerjaan"
            rules={[
              {
                required: true,
                message: 'Mohon isi butir pekerjaan!!!',
              },
            ]}
          >
            <TextArea
              defaultValue={dataJadwalPenyelesaianEdit.butirpekerjaan}
              onChange={(e) => setDataJadwalPenyelesaianEditButirPekerjaan(e.target.value)}
            />
          </Form.Item>

          <br />
          <Form.Item
            label="Jenis Pekerjaan"
            rules={[
              {
                required: true,
                message: 'Mohon isi jenis pekerjaan!!!',
              },
            ]}
          >
            <Select
              defaultValue={dataJadwalPenyelesaianEdit.jenispekerjaan}
              options={[
                { value: 'exploration', label: 'exploration' },
                { value: 'analysis', label: 'analysis' },
                { value: 'design', label: 'design' },
                { value: 'implementation', label: 'implementation' },
                { value: 'testing', label: 'testing' },
              ]}
              onChange={(e) => setDataJadwalPenyelesaianEditJenisPekerjaan(e)}
            />
          </Form.Item>
          <br />

          <b>
            Tanggal : {dataJadwalPenyelesaianEdit.tanggalmulai} &nbsp;s/d&nbsp;{' '}
            {dataJadwalPenyelesaianEdit.tanggalselesai}
          </b>
          <Form.Item
            label="Minggu Mulai"
            rules={[
              {
                required: true,
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <DatePicker
              name="tanggalmulaijadwalpenyelesaian"
              picker="week"
              onChange={(date, datestring) =>
                setDataJadwalPenyelesaianEditTanggalMulai(
                  getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                )
              }
              disabled={handleStatusStartWeekDatePicker}
              disabledDate={(current) => {
                let minusToGetLimit = new Date().getDay()
                if (minusToGetLimit === 0) {
                  setLimitMinusDay(7)
                } else {
                  setLimitMinusDay(minusToGetLimit)
                }

                return (
                  moment().add(-1, 'days') >= current ||
                  moment().add(7 - limitMinusDay, 'days') >= current
                )
              }}
            />
          </Form.Item>

          <Form.Item
            label="Minggu Selesai"
            rules={[
              {
                required: true,
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <DatePicker
              name="tanggalselesaijadwalpenyelesaian"
              picker="week"
              onChange={(date, datestring) =>
                setDataJadwalPenyelesaianEditTanggalSelesai(
                  getEndDateOfWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                )
              }
              disabledDate={(current) => {
                let minusToGetLimit = new Date().getDay()
                if (minusToGetLimit === 0) {
                  setLimitMinusDay(7)
                } else {
                  setLimitMinusDay(minusToGetLimit)
                }

                return (
                  moment().add(-1, 'days') >= current ||
                  moment().add(7 - limitMinusDay, 'days') >= current
                )
              }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" onClick={putDataJadwalPenyelesaianEdit}>
            Simpan Perubahan
          </Button>
        </Form>
      </Modal>

      <FloatButton
        type="primary"
        onClick={() => history.push(`/rencanaPenyelesaianProyek`)}
        icon={<ArrowLeftOutlined />}
        tooltip={<div>Kembali ke Rekap RPP</div>}
      />
    </>
  )
}

export default EditRPP
