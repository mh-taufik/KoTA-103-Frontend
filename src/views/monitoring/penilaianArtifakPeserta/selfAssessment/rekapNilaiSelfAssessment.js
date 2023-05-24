import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Space,
  notification,
  Spin,
  Select,
  Popconfirm,
  Popover,
  Card,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Option } from 'antd/lib/mentions'
import { HoverStyle } from 'devextreme-react/chart'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapSelfAssessment = () => {
  var idPeserta = useParams()
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  let rolePengguna = localStorage.id_role
  let history = useHistory()
  const [dataPoinPenilaian, setDataPoinPenilaian] = useState()

  const response = {
    initial_data: [
      {
        'Did I see this plant in 2016?': 'No',
        'Did I see this plant in 2017?': 'Yes',
        'How Many?': 1,
        'User Data 4': 'x',
        'User Data 5': '',
        'Did I see this plant in 2022?': 'No',
        Name: 'Abronia alpina',
      },
      {
        'Did I see this plant in 2016?': 'No',
        'Did I see this plant in 2017?': 'No',
        'How Many?': 11,
        'User Data 4': 'x',
        'User Data 5': '',
        'Did I see this plant in 2022?': 'Yes',
        Name: 'Abronia alpina1',
      },
    ],
  }

  //   isLoading ? (
  //     <Spin indicator={antIcon} />
  //   ) :

  /** API */
  const getPenilaianPerPoinPeserta = async () => {
    await axios
      .get('http://localhost:1337/api/poinpenilaianselfassessments')
      .then((res) => {
          console.log(res)
        var temp = []
        var tempData = res.data.data

        var getDataPoin = function (obj) {
          for (var i in obj) {
            temp.push({
              id: obj[i].id,
              poinpenilaian: obj[i].attributes.poinpenilaian,
              tanggalmulaipengisian: obj[i].attributes.tanggalmulaipengisian,
              status: obj[i].attributes.status,
            })
          }
        }
        getDataPoin(tempData)
        setDataPoinPenilaian(temp)
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

  useEffect(() => {
    // const data = response.initial_data
    // const columns = Object.keys(response.initial_data[0]).map((key, id) => {
    //   console.log('key', key)
    // })
    const getPoinPenilaianSelfAssessment = async () => {
      await axios
        .get('http://localhost:1337/api/poinpenilaianselfassessments')
        .then((res) => {
            console.log(res)
          var temp = []
          var tempData = res.data.data

          var getDataPoin = function (obj) {
            for (var i in obj) {
              temp.push({
                id: obj[i].id,
                poinpenilaian: obj[i].attributes.poinpenilaian,
                tanggalmulaipengisian: obj[i].attributes.tanggalmulaipengisian,
                status: obj[i].attributes.status,
              })
            }
          }
          getDataPoin(tempData)
          setDataPoinPenilaian(temp)
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
    getPoinPenilaianSelfAssessment()
  }, [history])

  const columns = [
    {
      title: 'Poin Penilaian',
      dataIndex: 'poinpenilaian',
      key: 'poinpenilaian',
    },
  ]
  return (
    <>
      <Table columns={columns} dataSource={dataPoinPenilaian} />
    </>
  )
}

export default RekapSelfAssessment
