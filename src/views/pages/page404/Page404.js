import React from 'react'
import {
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import { Button, Result } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import '../../monitoring/pengisianDokumen/rpp/rpp.css'
import { useLayoutEffect } from 'react'

const Page404 = () => {
  const history = useHistory()
  useLayoutEffect(() => {
    document.body.style.backgroundColor = "white"
});
  return (
    <div className='container2'>
      <Result
       status={404||409||405||400}
    title="404"
    subTitle="Sorry, Something Wrong."
    extra={<Button type="primary" onClick={()=>history.push(`/dashboard`)}>Back Home</Button>}
  />
    </div>
  )
}

export default Page404
