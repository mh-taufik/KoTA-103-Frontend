import React from 'react'
import {
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import { Button, Result } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import '../../monitoring/pengisianDokumen/rpp/rpp.css'

const Page404 = () => {
  const history = useHistory()
  return (
    <div className='container2'>
      <Result
    status="400"
    title="400"
    subTitle="Sorry, Something Wrong."
    extra={<Button type="primary" onClick={()=>history.push(`/dashboard`)}>Back Home</Button>}
  />
    </div>
  )
}

export default Page404
