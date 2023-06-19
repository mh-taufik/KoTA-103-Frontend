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
  Spin,
  Table,
  notification,
} from 'antd'
import './rpp.css'
import 'antd/dist/reset.css'
import { Form, Modal, message } from 'antd'

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
  const weekFormat = 'MM-DD';
  const [isLoading, setIsLoading] = useState(true)
  const [, updateState] = React.useState()
  const forceUpdate = React.useCallback(() => updateState({}), [])
  const dateFormat = 'YYYY-MM-DD'
  let params = useParams()
  let RPP_ID = params.id
  dayjs.extend(customParseFormat)
  let history = useHistory()
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [formDeliverables] = Form.useForm()
  const [formMilestones] = Form.useForm()
  const [formRencanaCapaianMingguan] = Form.useForm()
  const [formJadwalPenyelesaian] = Form.useForm()
  const [formUbahTanggal] = Form.useForm()
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
  let rolePengguna = localStorage.id_role
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
  axios.defaults.withCredentials = true
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
    setDataDeliverablesEditChangeDeliverables(data.deliverables)
    setDataDeliverablesEditChangeDueDate(data.due_date)
    setDataDeliverablesEdit({
      due_date: data.due_date,
      deliverables: data.deliverables,
      id: data.id,
    })
    setIsModalDeliverablesEditOpen(true)
  }

  const handleCancelModalDeliverablesEdit = () => {
    setIsModalDeliverablesEditOpen(false)
  }

  /** PUT EDIT DELIVERABLES */
  const putDataDeliverablesEdit = async () => {
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/deliverable/update`, {
        completion_schedules: [],
        deliverables: [
          {
            deliverables: dataDeliverablesEditChangeDeliverables,
            due_date: dataDeliverablesEditChangeDueDate,
            id: dataDeliverablesEdit.id,
          },
        ],
        milestone: [],
        rpp_id: parseInt(RPP_ID),
        weekly_achievement_plan: [],
      })
      .then((res) => {
        setIsModalDeliverablesEditOpen(false)
        notification.success({ message: 'Data deliverables berhasil diubah' })
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
    setDataMilestonesEditDeskripsi(data.description)
    setDataMilestonesEditTanggalMulai(data.start_date)
    setDataMilestonesEditTanggalSelesai(data.finish_date)
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
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/milestone/update`, {
        completion_schedule: [],
        deliverables: [],
        milestone: [
          {
            description: dataMilestonesEditDeskripsi,
            finish_date: dataMilestonesEditTanggalSelesai,
            id: dataMilestonesEdit.id,
            start_date: dataMilestonesEditTanggalMulai,
          },
        ],
        rpp_id: parseInt(RPP_ID),
        weekly_achievement_plan: [],
      })
      .then((res) => {
        setIsModalMilestonesEditOpen(false)
        notification.success({ message: 'Data milestones berhasil diubah' })
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

  useEffect(()=>{
    if(dataRencanaCapaianMingguanEditTanggalBerakhir){
      setDataRencanaCapaianMingguanEditTanggalBerakhir(dataRencanaCapaianMingguanEditTanggalBerakhir)
    }
    },[dataRencanaCapaianMingguanEditTanggalBerakhir])

    
  useEffect(()=>{
    if(dataRencanaCapaianMingguanEditTanggalMulai){
      setDataRencanaCapaianMingguanEditTanggalMulai(dataRencanaCapaianMingguanEditTanggalMulai)
    }
    },[dataRencanaCapaianMingguanEditTanggalMulai])

    
  useEffect(()=>{
    if(dataRencanaCapaianMingguanEditRencana){
      setDataRencanaCapaianMingguanEditRencana(dataRencanaCapaianMingguanEditRencana)
    }
    },[dataRencanaCapaianMingguanEditRencana])

  /** HANDLE MODAL EDIT RENCANA CAPAIAN MINGGUAN*/
  const showModalRencanaCapaianMingguanEdit = (data) => {
    setDataRencanaCapaianMingguanEditRencana(data.achievement_plan)
    setDataRencanaCapaianMingguanEditTanggalMulai(data.start_date)
    setDataRencanaCapaianMingguanEditTanggalBerakhir(data.finish_date)
    setDataRencanaCapaianMingguanEdit(data)
    setIsModalRencanaCapaianMingguanEditOpen(true)
  }

  const handleCancelModalRencanaCapaianMingguanEdit = () => {
    setIsModalRencanaCapaianMingguanEditOpen(false)
  }

  /** PUT DATA RENCANA CAPAIAN MINGGUAN */
  const putDataRencanaCapaianMingguanEdit = async () => {
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/weekly-achievement/update`, {
        completion_schedules: [],
        deliverables: [],
        milestone: [],
        rpp_id: parseInt(RPP_ID),
        weekly_achievement_plan: [
          {
            achievement_plan: dataRencanaCapaianMingguanEditRencana,
            finish_date: dataRencanaCapaianMingguanEditTanggalBerakhir,
            id: dataRencanaCapaianMingguanEdit.id,
            start_date: dataRencanaCapaianMingguanEditTanggalMulai,
          },
        ],
      })
      .then((res) => {
        setIsModalRencanaCapaianMingguanEditOpen(false)
        notification.success({ message: 'Data Rencana Capaian Mingguan Berhasil Diubah' })
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

  /** HANDLE MODAL EDIT JADWAL PENYELESAIAN KESELURUHAN*/
  const showModalJadwalPenyelesaianEdit = (data, statusDatePickerStart) => {
    setDataJadwalPenyelesaianEditButirPekerjaan(data.task_name)
    setDataJadwalPenyelesaianEditJenisPekerjaan(data.task_type)
    setDataJadwalPenyelesaianEditTanggalMulai(data.start_date)
    setDataJadwalPenyelesaianEditTanggalSelesai(data.finish_date)
    setHandleStatusStartWeekDatePicker(statusDatePickerStart)
    setDataJadwalPenyelesaianEdit(data)

    setIsModalJadwalPenyelesaianEditOpen(true)
  }

  const handleCancelModalJadwalPenyelesaianEdit = () => {
    setIsModalJadwalPenyelesaianEditOpen(false)
  }
  
  useEffect(()=>{
    if(dataJadwalPenyelesaianEdit){
      setDataJadwalPenyelesaianEdit(dataJadwalPenyelesaianEdit)
    }
  },[dataJadwalPenyelesaianEdit])

  useEffect(()=>{
    if(dataJadwalPenyelesaianEditButirPekerjaan){
      setDataJadwalPenyelesaianEditButirPekerjaan(dataJadwalPenyelesaianEditButirPekerjaan)
    }
  },[dataJadwalPenyelesaianEditButirPekerjaan])

  useEffect(()=>{
    if(dataJadwalPenyelesaianEditJenisPekerjaan){
      setDataJadwalPenyelesaianEditJenisPekerjaan(dataJadwalPenyelesaianEditJenisPekerjaan)
    }
  },[dataJadwalPenyelesaianEditJenisPekerjaan])

  useEffect(()=>{
    if(dataJadwalPenyelesaianEditTanggalMulai){
      setDataJadwalPenyelesaianEditTanggalMulai(dataJadwalPenyelesaianEditTanggalMulai)
    }
  },[dataJadwalPenyelesaianEditTanggalMulai])

  useEffect(()=>{
    if(dataJadwalPenyelesaianEditTanggalSelesai){
      setDataJadwalPenyelesaianEditTanggalSelesai(dataJadwalPenyelesaianEditTanggalSelesai)
    }
  },[dataJadwalPenyelesaianEditTanggalSelesai])


  /** PUT DATA JADWAL PENYELESAIAN */
  const putDataJadwalPenyelesaianEdit = async () => {
    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/completion-schedule/update`, {
        "completion_schedule": [
          {
            "finish_date": dataJadwalPenyelesaianEditTanggalSelesai,
            "id": dataJadwalPenyelesaianEdit.id,
            "start_date": dataJadwalPenyelesaianEditTanggalMulai,
            "task_name": dataJadwalPenyelesaianEditButirPekerjaan,
            "task_type": dataJadwalPenyelesaianEditJenisPekerjaan
        
          },
        ],
        "deliverables": [],
        "milestone": [],
        "rpp_id": parseInt(RPP_ID),
        "weekly_achievement_plan": [],
      })
      .then((res) => {
        setIsModalJadwalPenyelesaianEditOpen(false)
        notification.success({ message: 'Data Jadwal Penyelesaian Keseluruhan Berhasil Diubah' })
        refreshDataRPP()
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

    refreshDataRPP()
  }






  /** HANDLE CHAGES FINISH DATE */
  /** HANDLE EDIT DELIVEREBLES MODAL AND DATA */
  const [isModalFinishDateEditOpen, setIsModalFinishDateEditOpen] = useState(false)
  const [dataFinishDateEdit, setDataFinishDateEdit] = useState()

  /** HANDLE MODAL EDIT DELIVERABLES*/
  const showModalFinishDateEdit = (data) => {
    setDataFinishDateEdit(dataRPP.finish_date)
    setIsModalFinishDateEditOpen(true)
  }

  const handleCancelModalFinishDateEdit = () => {
    setIsModalFinishDateEditOpen(false)
  }

  /** PUT EDIT FINISH DATE */
  const putDataFinishDateEdit = async () => {
    if(dataRPP.start_date>dataFinishDateEdit){
      notification.warning({message:'Harap cek kembali tanggal selesai !!! '})
    }else{
      await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/update/simple`, {
        finish_date : dataFinishDateEdit,
        rpp_id : parseInt(RPP_ID)
      })
      .then((res) => {
        setIsModalFinishDateEditOpen(false)
        notification.success({ message: 'Data tanggal selesai RPP berhasil diubah' })
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

    refreshDataRPP()
    }
  }

  /** ADD DATA TO RPP */
  /** HANDLE ADD DELIVERABLES */
  const postDataDeliverablesAdditional = async () => {
    let jsonDeliverables = JSON.parse(JSON.stringify(deliverables))

    await axios
      .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/deliverable/create`, {
        completion_schedule: [],
        deliverables: jsonDeliverables,
        milestone: [],
        rpp_id: parseInt(RPP_ID),
        weekly_achievement_plan: [],
      })
      .then((res) => {
        setIsSuccessInputEdit(true)
        notification.success({message:'Data Deliverables berhasil ditambahkan'})
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

    refreshDataRPP()
    window.location.reload(false)
  }

  /** HANDLE ADD MILESTONES */
  const postDataMilestonesAdditional = async () => {
    const jsonMilestones = JSON.parse(JSON.stringify(milestones))
    await axios
      .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/milestone/create`, {
        completion_schedule: [],
        deliverables: [],
        milestone: jsonMilestones,
        rpp_id: parseInt(RPP_ID),
        weekly_achievement_plan: [],
      })
      .then((res) => {
        setIsSuccessInputEdit(true)
        notification.success({message:'Data Milestones berhasil ditambahkan'})
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
      refreshDataRPP()
    window.location.reload(false)
  }

  /** HANDLE ADD RENCANA CAPAIAN PERMINGGU */
  const postDataRencanaCapaianPermingguAdditional = async () => {
    let jsonRencanaCapaianPerminggu = JSON.parse(JSON.stringify(capaianPerminggu))


    await axios
      .post(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/weekly-achievement/create`,{
        "completion_schedule": [
      
        ],
        "deliverables": [
        
        ],
        "milestone": [
        
        ],
        "rpp_id": parseInt(RPP_ID),
        "weekly_achievement_plan": jsonRencanaCapaianPerminggu
      })
      .then((res) => {
        setIsSuccessInputEdit(true)
        notification.success({message:'Data Rencana Capaian Perminggu berhasil ditambahkan'})
      
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

      refreshDataRPP()
    window.location.reload(false)

  }


  const postDataJadwalPenyelesaianKeseluruhanAdditional = async () => {
    let jsonJadwalPenyelesaian = JSON.parse(JSON.stringify(jadwalPenyelesaianKeseluruhan))

    await axios
      .put(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/completion-schedule/update`, {
        "completion_schedule": jsonJadwalPenyelesaian,
        "deliverables": [
       
        ],
        "milestone": [
       
        ],
        "rpp_id": parseInt(RPP_ID),
        "weekly_achievement_plan": [
        
        ]
      })
      .then((res) => {
        setIsSuccessInputEdit(true)
        notification.success({message:'Data Jadwal Keseluruhan berhasil ditambahkan'})
   
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

      refreshDataRPP()
    window.location.reload(false)
   
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
      .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/get/${RPP_ID}`)
      .then((response) => {
     

        setDataRPP({
          start_date: response.data.data.start_date,
          finish_date: response.data.data.finish_date,
          group_role: response.data.data.group_role,
          work_title: response.data.data.work_title,
          task_description: response.data.data.task_description,
        })

        /**SET DATA DELIVERABLES */
        let temp_del = []
        let temp_del1 = []
        temp_del = response.data.data.deliverables
        let temp_deliverables = function (obj) {
          for (var i in obj) {
            temp_del1.push({
              id: obj[i].id,
              due_date: obj[i].due_date,
              deliverables: obj[i].deliverables,
            })
          }
        }

        temp_deliverables(temp_del)
        setDataDeliverables(temp_del1)


        /** SET DATA MILESTONES */
        let temp_mil = []
        let temp_mil1 = []
        temp_mil = response.data.data.milestones
        let temp_milestone = function (obj) {
          for (var i in obj) {
            temp_mil1.push({
              id: obj[i].id,
              description: obj[i].description,
              start_date: obj[i].start_date,
              finish_date: obj[i].finish_date,
            })
          }
        }

        temp_milestone(temp_mil)
        setDataMilestones(temp_mil1)
  

        /**SET DATA RENCANA CAPAIAN MINGGUAN */
        let temp_rcm = []
        let temp_rcm1 = []
        temp_rcm = response.data.data.weekly_achievement_plans
        let temp_rencanaCapaianMingguan = function (obj) {
          for (var i in obj) {
            temp_rcm1.push({
              id: obj[i].id,
              achievement_plan: obj[i].achievement_plan,
              start_date: obj[i].start_date,
              finish_date: obj[i].finish_date,
            })
          }
        }

        temp_rencanaCapaianMingguan(temp_rcm)
        setDataCapaianMingguan(temp_rcm1)
     

        /** JADWAL PENYELESAIAN KESELURUHAN */
        let temp_jadwalKeseluruhan = []
        let temp_jadwalKeseluruhan1 = []
        temp_jadwalKeseluruhan = response.data.data.completion_schedules
        let temp_jadwalKeseluruhans = function (obj) {
          for (var i in obj) {
            temp_jadwalKeseluruhan1.push({
              id: obj[i].id,
              task_type: obj[i].task_type,
              task_name: obj[i].task_name,
              start_date: obj[i].start_date,
              finish_date: obj[i].finish_date,
            })
          }
        }

        temp_jadwalKeseluruhans(temp_jadwalKeseluruhan)
        setDataJadwalPenyelesaianKeseluruhan(temp_jadwalKeseluruhan1)

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
  
    let data = [...deliverables]
    data[index][type] = event
    setDeliverables(data)
  
  }

  const handleAddRowDeliverables = () => {
    setNoOfRowsDeliverables(noOfRowsDeliverables + 1)
    let newField = { deliverables: '', due_date: '' }
    setDeliverables([...deliverables, newField])
  }

  const handleDropRowDeliverables = () => {

    var will_delete = deliverables.length - 1
    var temp = []
    var tempDeliverables = function (obj) {
      for (var i in obj) {

        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempDeliverables(deliverables)
    setDeliverables(temp)

    setNoOfRowsDeliverables(noOfRowsDeliverables - 1)
  }

  /** SAVE DATA MILESTONES TO STATE OF MILESTONES */
  const handleDataMilestones = (index, event, type) => {
 
    let data = [...milestones]
    data[index][type] = event
    setMilestones(data)

  }

  const handleAddRowMilestones = () => {
    let newField = { description: ' ', start_date: ' ', finish_date: ' ' }
    setMilestones([...milestones, newField])
    setNoOfRowsMilestones(noOfRowsMilestones + 1)
  }

  const handleDropRowMilestones = () => {

    var will_delete = milestones.length - 1
    var temp = []
    var tempMilestones = function (obj) {
      for (var i in obj) {

        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempMilestones(milestones)
    setMilestones(temp)

    setNoOfRowsMilestones(noOfRowsMilestones - 1)
  }

  /** SAVE DATA RENCANA CAPAIAN PERMINGGU TO STATE OF RENCANA CAPAIAN PERMINGGU */
  const handleDataRencanaCapaianPerminggu = (index, event, type) => {
  
    let data = [...capaianPerminggu]
    data[index][type] = event
    setCapaianPerminggu(data)

  }

  const handleAddRowRencanaCapaianPerminggu = () => {
    let newField = {start_date: '', finish_date: '', achievement_plan: ''}
    setCapaianPerminggu([...capaianPerminggu, newField])
    setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu + 1)
  }

  const handleDropRowRencanaCapaianPerminggu = () => {

    var will_delete = capaianPerminggu.length - 1
    var temp = []
    var tempCapaianPerminggu = function (obj) {
      for (var i in obj) {

        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempCapaianPerminggu(capaianPerminggu)
    setCapaianPerminggu(temp)

    setNoOfRowsCapaianPerminggu(noOfRowsCapaianPerminggu - 1)
  }

  /** SAVE DATA JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN TO SET STATE OF JADWAL PENYELESAIAN PEKERJAAN KESELURUHAN */
  const handleDataJadwalPenyelesaianKeseluruhan = (index, event, type) => {

    let data = [...jadwalPenyelesaianKeseluruhan]
    data[index][type] = event
    SetJadwalPenyelesaianKeseluruhan(data)

  }

  const handleAddRowJadwalPenyelesaianKeseluruhan = () => {
    let newField = { start_date: '', finish_date: '', task_name: '', task_type: '' , id:0}
    SetJadwalPenyelesaianKeseluruhan([...jadwalPenyelesaianKeseluruhan, newField])
    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan + 1,
    )
  }

  const handleDropRowJadwalPenyelesaianKeseluruhan = () => {

    var will_delete = jadwalPenyelesaianKeseluruhan.length - 1
    var temp = []
    var tempJadwalKeseluruhan = function (obj) {
      for (var i in obj) {

        if (i === 0) {
          break
        } else if (i < will_delete) {
          temp.push(obj[i])
        }
      }
    }
    tempJadwalKeseluruhan(jadwalPenyelesaianKeseluruhan)
    SetJadwalPenyelesaianKeseluruhan(temp)

    setNoOfRowsJadwalPenyelesaianPekerjaanKeseluruhan(
      noOfRowsJadwalPenyelesaianPekerjaanKeseluruhan - 1,
    )
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

    var ISOweekStart = simple

    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }

    ISOweekStart.setDate(ISOweekStart.getDate() + 4)
    return formatDate(ISOweekStart.toDateString())
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
    const getRPPDetailPeserta = async (index) => {
      await axios
        .get(`${process.env.REACT_APP_API_GATEWAY_URL}monitoring/rpp/get/${RPP_ID}`)
        .then((response) => {


          setDataRPP({
            start_date: response.data.data.start_date,
            finish_date: response.data.data.finish_date,
            group_role: response.data.data.group_role,
            work_title: response.data.data.work_title,
            task_description: response.data.data.task_description,
          })

          /**SET DATA DELIVERABLES */
          let temp_del = []
          let temp_del1 = []
          temp_del = response.data.data.deliverables
          let temp_deliverables = function (obj) {
            for (var i in obj) {
              temp_del1.push({
                id: obj[i].id,
                due_date: obj[i].due_date,
                deliverables: obj[i].deliverables,
              })
            }
          }

          temp_deliverables(temp_del)
          setDataDeliverables(temp_del1)


    
          let temp_mil = []
          let temp_mil1 = []
          temp_mil = response.data.data.milestones
          let temp_milestone = function (obj) {
            for (var i in obj) {
              temp_mil1.push({
                id: obj[i].id,
                description: obj[i].description,
                start_date: obj[i].start_date,
                finish_date: obj[i].finish_date,
              })
            }
          }

          temp_milestone(temp_mil)
          setDataMilestones(temp_mil1)
     
          let temp_rcm = []
          let temp_rcm1 = []
          temp_rcm = response.data.data.weekly_achievement_plans
          let temp_rencanaCapaianMingguan = function (obj) {
            for (var i in obj) {
              temp_rcm1.push({
                id: obj[i].id,
                achievement_plan: obj[i].achievement_plan,
                start_date: obj[i].start_date,
                finish_date: obj[i].finish_date,
              })
            }
          }

          temp_rencanaCapaianMingguan(temp_rcm)
          setDataCapaianMingguan(temp_rcm1)

          let temp_jadwalKeseluruhan = []
          let temp_jadwalKeseluruhan1 = []
          temp_jadwalKeseluruhan = response.data.data.completion_schedules
          let temp_jadwalKeseluruhans = function (obj) {
            for (var i in obj) {
              temp_jadwalKeseluruhan1.push({
                id: obj[i].id,
                task_type: obj[i].task_type,
                task_name: obj[i].task_name,
                start_date: obj[i].start_date,
                finish_date: obj[i].finish_date,
              })
            }
          }

          temp_jadwalKeseluruhans(temp_jadwalKeseluruhan)
          setDataJadwalPenyelesaianKeseluruhan(temp_jadwalKeseluruhan1)
  
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

    getRPPDetailPeserta()
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
      dataIndex: 'due_date',
      key: 'due_date',
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


        dateLimit.setDate(dateLimit.getDate() + (7 - new Date().getDay()))
        let recDueDate = new Date(record.due_date)
   

        if (recDueDate > dateLimit) {
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-deliverables"
                shape="circle"
                onClick={() => {
                  showModalDeliverablesEdit(record)

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
      dataIndex: 'start_date',
      key: 'start_date',
      width: '10%',
    },
    {
      title: 'TANGGAL SELESAI',
      dataIndex: 'finish_date',
      key: 'finish_date',
      width: '10%',
    },
    {
      title: 'DESKRIPSI',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()

    
        dateLimit.setDate(dateLimit.getDate() + (7 - new Date().getDay()))
        let recStartDate = new Date(record.start_date)
        let recFinishDate = new Date(record.finish_date)
        let popoverSD
    

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
      dataIndex: 'start_date',
      key: 'start_date',
      width: '20%',
    },
    {
      title: 'TANGGAL BERAKHIR',
      dataIndex: 'finish_date',
      key: 'finish_date',
      width: '20%',
    },
    {
      title: 'RENCANA CAPAIAN',
      dataIndex: 'achievement_plan',
      key: 'achievement_plan',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()

   
        dateLimit.setDate(dateLimit.getDate() + (7 - new Date().getDay()))
        let recStartDate = new Date(record.start_date)
        let recFinishDate = new Date(record.finish_date)

   

        if (recStartDate > dateLimit) {
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-rencana-capaian-perminggu"
                shape="circle"
                onClick={() => {
 
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
      dataIndex: 'start_date',
      key: 'start_date',
      width: '10%',
    },
    {
      title: 'TANGGAL SELESAI',
      dataIndex: 'finish_date',
      key: 'finish_date',
      width: '10%',
    },
    {
      title: 'JENISPEKERJAAN',
      dataIndex: 'task_type',
      key: 'task_type',
      width: '20%',
    },
    {
      title: 'BUTIRPEKERJAAN',
      dataIndex: 'task_name',
      key: 'task_name',
      width: '30%',
    },
    {
      title: 'AKSI',
      dataIndex: 'action',
      width: '5%',
      render: (text, record) => {
        let dateLimit = new Date()

        dateLimit.setDate(dateLimit.getDate() + (7 - limitMinusDay))
        let recStartDate = new Date(record.start_date)

        let weekOnDateStart = getWeekBasedOnDate(recStartDate) - 1
        let currWeek = getWeekBasedOnDate(new Date())-1


        if (weekOnDateStart>currWeek) {
          return (
            <Popover content={<div>Edit data</div>}>
              <Button
                id="button-edit-jadwal-penyelesaian"
                shape="circle"
                onClick={() => {
      
                  showModalJadwalPenyelesaianEdit(record, false)
            
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

  useEffect(()=>{
    if(dataFinishDateEdit){
      setDataFinishDateEdit(dataFinishDateEdit)
    }
  },[dataFinishDateEdit])

 

  return isLoading ? (
    <Spin tip="Loading" size="large">
      <div className="content" />
    </Spin>
  ) : (
    <>
      <div className="container">

        <Space>
          <Modal
            title="Format Pengisian Dokumen RPP"
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
              <Col span={8}>{dataRPP.start_date}</Col>
            </Row>
            <Row>
              <Col style={{ paddingBottom: 20 }} span={8}>
                Tanggal Selesai
              </Col>
              <Col span={4}>{dataRPP.finish_date}</Col>
              <Col span={4}>Ubah Tanggal :</Col>
              <Col span={4}>
                <Popover content={<div>Klik untuk mengubah tanggal selesai dari RPP</div>}>
                  <Button type="primary" onClick={showModalFinishDateEdit}>
                    Ubah Tanggal Selesai
                  </Button>
                </Popover>
              </Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Topik Pekerjaan
              </Col>
              <Col span={8}>{dataRPP.work_title}</Col>
              <Col></Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Peran Kelompok
              </Col>
              <Col span={8}>{dataRPP.group_role}</Col>
              <Col></Col>
            </Row>

            <Row>
              <Col span={8} style={{ paddingBottom: 20 }}>
                Deskripsi Tugas
              </Col>
              <Col span={8}>{dataRPP.task_description}</Col>
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
                      <Form.Item
                        name={`tanggaldeliverables${index}`}
                        key={index}
                        label="Tanggal"
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan tanggal deliverables terlebih dahulu !',
                          },
                          {
                            type: 'date',
                            warningOnly: 'true',
                          },
                        ]}
                      >
                        <DatePicker
                          disabledDate={(current) => {
                          
                              setLimitMinusDay(new Date().getDay())
                          

                            return (
                              moment().add(-1, 'days') >= current ||
                              moment().add(7 - limitMinusDay, 'days') >= current
                            )
                          }}
                          style={{ width: '70%' }}
                          value={deliverables.date}
                          onChange={(date, datestring) =>
                            handleDataDeliverables(index, datestring, 'due_date')
                          }
                        />
                      </Form.Item>
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
                  <Popover content={<div>Klik untuk menambahkan deliverables</div>}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                  
                        postDataDeliverablesAdditional()
                      }}
                    >
                      Simpan Data
                    </Button>
                  </Popover>
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
                          value={milestones.description}
                          style={{ width: '100%' }}
                          placeholder="Masukkan milestones"
                          onChange={(event) => {
                            handleDataMilestones(index, event.target.value, 'description')
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={`tanggalmilestones${index}`}
                        key={index}
                        label="Tanggal"
                        rules={[
                          {
                            required: true,
                            message: 'Masukkan tanggal milestones terlebih dahulu !',
                          },
                          {
                            type: 'datepicker',
                            warningOnly: 'true',
                          },
                        ]}
                      >
                        <RangePicker
                          style={{ width: '100%' }}
                          disabledDate={(current) => {
                            let minusToGetLimit = new Date().getDay()
                          
                              setLimitMinusDay(minusToGetLimit)
                          

                            return (
                              moment().add(-1, 'days') >= current ||
                              moment().add(7 - limitMinusDay, 'days') >= current
                            )
                          }}
                          onChange={(date, datestring) => {
                            handleDataMilestones(index, datestring[0], 'start_date')
                            handleDataMilestones(index, datestring[1], 'finish_date')
                          }}
                        />
                      </Form.Item>
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
                 
                      postDataMilestonesAdditional()
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
                          style={{ width: '100%' }}
                          placeholder="Masukkan rencana perminggu"
                          onChange={(event) => {
                            handleDataRencanaCapaianPerminggu(
                              index,
                              event.target.value,
                              'achievement_plan',
                            )
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name={`capaian-date${index}`}
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
                         
                              setLimitMinusDay(minusToGetLimit)
                          

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
                              'start_date',
                            ),
                            handleDataRencanaCapaianPerminggu(
                              index,
                              getEndDateOfWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                              'finish_date',
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

                  <Popover content={<div>Klik untuk menambahkan rencana capaian perminggu</div>}>
                    <Button
                      type="primary"
                      onClick={() => {
               
                        postDataRencanaCapaianPermingguAdditional()
                      }}
                    >
                      Simpan Data
                    </Button>
                  </Popover>
                </>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>

   
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
                            value={jadwalPenyelesaianKeseluruhan.task_name}
                            style={{ width: '100%' }}
                            placeholder="Butir Pekerjaan"
                            onChange={(event) => {
                              handleDataJadwalPenyelesaianKeseluruhan(
                                index,
                                event.target.value,
                                'task_name',
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
                            handleDataJadwalPenyelesaianKeseluruhan(index, value, 'task_type')
                          }
                          options={[
                            { value: 'Exploration', label: 'Exploration' },
                            { value: 'Analysis', label: 'Analysis' },
                            { value: 'Design', label: 'Design' },
                            { value: 'Implementasi', label: 'Implementation' },
                            { value: 'Testing', label: 'Testing' },
                          ]}
                        />
                      </Col>
                      <Col span={8}>
                        <RangePicker
                          picker="week"
                          placeholder="Minggu Ke"
                          disabledDate={(current) => {
                            let minusToGetLimit = new Date().getDay()
                         
                              setLimitMinusDay(minusToGetLimit)
                       

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
                              'start_date',
                            )
                            handleDataJadwalPenyelesaianKeseluruhan(
                              index,
                              getEndDateOfWeek(
                                datestring[1].slice(5, 7),
                                datestring[1].slice(0, 4),
                              ),
                              'finish_date',
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

                  <Popover>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => {
                
                        postDataJadwalPenyelesaianKeseluruhanAdditional()
                      }}
                    >
                      Simpan Data
                    </Button>
                  </Popover>
                </>
              )}
            </Col>
          </div>
          <hr />
          <div className="spacebottom"></div>
        </Form>
      </div>

      <Modal
        title="Edit Deliverables"
        open={isModalDeliverablesEditOpen}
   
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
              name: ['due_date'],
              value: dataDeliverablesEdit.due_date,
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
              defaultValue={dayjs(dataDeliverablesEdit.due_date, dateFormat)}
              onChange={(date, datestring) => {
                setDataDeliverablesEditChangeDueDate(datestring)
              }}
              disabledDate={(current) => {
                let minusToGetLimit = new Date().getDay()
           
                  setLimitMinusDay(minusToGetLimit)
              
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
              value: dataMilestonesEdit.description,
            },
            {
              name: ['tanggalmulai'],
              value: dataDeliverablesEdit.start_date,
            },
            {
              name: ['tanggalselesai'],
              value: dataDeliverablesEdit.finish_date,
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
              defaultValue={dataMilestonesEdit.description}
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
                defaultValue={dayjs(dataMilestonesEdit.start_date, dateFormat)}
                onChange={(date, datestring) => setDataMilestonesEditTanggalMulai(datestring)}
                disabledDate={(current) => {
                  let minusToGetLimit = new Date().getDay()
           
                    setLimitMinusDay(minusToGetLimit)
               
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
                defaultValue={dayjs(dataMilestonesEdit.finish_date, dateFormat)}
                onChange={(date, datestring) => setDataMilestonesEditTanggalSelesai(datestring)}
                disabledDate={(current) => {
                  let minusToGetLimit = new Date().getDay()
                 
                    setLimitMinusDay(minusToGetLimit)
                
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
              value: dataRencanaCapaianMingguanEdit.achievement_plan,
            },
            {
              name: ['tanggalmulai'],
              value: dataRencanaCapaianMingguanEdit.start_date,
            },
            {
              name: ['tanggalselesai'],
              value: dataRencanaCapaianMingguanEdit.finish_date,
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
              defaultValue={dataRencanaCapaianMingguanEdit.achievement_plan}
              onChange={(e) => setDataRencanaCapaianMingguanEditRencana(e.target.value)}
            />
          </Form.Item>

          <br />
          <b>
            {dataRencanaCapaianMingguanEdit.start_date} &nbsp;s/d&nbsp;{' '}
            {dataRencanaCapaianMingguanEdit.finish_date}
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
             
                  setDataRencanaCapaianMingguanEditTanggalMulai(
                    getDateOfISOWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                  )
                  setDataRencanaCapaianMingguanEditTanggalBerakhir(
                    getEndDateOfWeek(datestring.slice(5, 7), datestring.slice(0, 4)),
                  )
                }}
                disabledDate={(current) => {
                  let minusToGetLimit = new Date().getDay()
             
                    setLimitMinusDay(minusToGetLimit)
             

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

      {/* MODAL EDIT JADWAL PENYELESAIAN KESELURUHAN */}
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
              value: dataJadwalPenyelesaianEdit.task_name,
            },
            {
              name: ['jenispekerjaan'],
              value: dataJadwalPenyelesaianEdit.task_type,
            },
            {
              name: ['tanggalmulai'],
              value: dataJadwalPenyelesaianEdit.start_date,
            },
            {
              name: ['tanggalselesai'],
              value: dataJadwalPenyelesaianEdit.finish_date,
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
              defaultValue={dataJadwalPenyelesaianEdit.task_name}
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
              defaultValue={dataJadwalPenyelesaianEdit.task_type}
              options={[
                { value: 'Exploration', label: 'Exploration' },
                { value: 'Analysis', label: 'Analysis' },
                { value: 'Design', label: 'Design' },
                { value: 'Implementation', label: 'Implementation' },
                { value: 'Testing', label: 'Testing' },
              ]}
              onChange={(e) => setDataJadwalPenyelesaianEditJenisPekerjaan(e)}
            />
          </Form.Item>
          <br />

          <b>
            Tanggal : {dataJadwalPenyelesaianEdit.start_date} &nbsp;s/d&nbsp;{' '}
            {dataJadwalPenyelesaianEdit.finish_date}
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
           
                  setLimitMinusDay(minusToGetLimit)
           
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
             
                  setLimitMinusDay(minusToGetLimit)
             

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

      {/* MODAL EDIT TANGGAL BERAKHIR*/}
      <Modal
        title="Edit Tanggal Berakhir"
        open={isModalFinishDateEditOpen}
        onCancel={handleCancelModalFinishDateEdit}
        footer={false}
        destroyOnClose
      >
        <Form
          name="form_edit_finish_date"
          form={formUbahTanggal}
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
        >
          <Form.Item
            label="Tanggal Mulai"
            initialValue={dataFinishDateEdit}
            rules={[
              {
                required: true,
                message: 'Mohon isi Berakhir !!!',
              },
              {
                type: 'date',
                warningOnly: true,
              },
            ]}
          >
            <DatePicker
              onChange={(date, datestring) => setDataFinishDateEdit(datestring)}
              disabledDate={(current) => {
                let minusToGetLimit = new Date().getDay()
                  setLimitMinusDay(minusToGetLimit)
                return (
                  moment().add(-1, 'days') >= current ||
                  moment().add(7 - limitMinusDay, 'days') >= current
                )
              }}
            />
          </Form.Item>

          <Button type="primary" onClick={putDataFinishDateEdit}>
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
