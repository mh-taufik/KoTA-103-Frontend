import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import '../../pengisianDokumen/rpp/rpp.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'
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
  Tag,
} from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useHistory, useParams, Router } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Box } from '@mui/material'
import moment from 'moment'

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />
const RekapPenilaianLogbook = () => {
  var idPeserta = useParams() //ngambil dari params, dimana params untuk menunjukkan detail logbook
  let searchInput
  const [state, setState] = useState({ searchText: '', searchedColumn: '' })
  const [logbookPeserta, setLogbookPeserta] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wannaEdit, setWannaEdit] = useState(false)
  const [idPengguna, setIdPengguna] = useState(localStorage.username)
  let rolePengguna = localStorage.id_role

  return (
    <>
      {rolePengguna !== '1' && (
        <Space
          className="spacebottom"
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <Card title="Informasi Peserta" size="small" style={{ padding: 30 }}>
            <Row style={{ fontSize: 16 }}>
              <Col span={4}>Nama Lengkap</Col>
              <Col span={2}>:</Col>
              <Col span={8}>Gina Anifah Choirunnisa</Col>
            </Row>
            <Row style={{ fontSize: 16 }}>
              <Col span={4}>NIM</Col>
              <Col span={2}>:</Col>
              <Col span={8}>201511009</Col>
            </Row>
          </Card>
        </Space>
      )}
      <div className="container"></div>
    </>
  )
}

export default RekapPenilaianLogbook
