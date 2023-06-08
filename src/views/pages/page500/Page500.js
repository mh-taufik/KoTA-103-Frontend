import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'
import { Button, Result } from 'antd'
import '../../monitoring/pengisianDokumen/rpp/rpp.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Page500 = () => {
  const history = useHistory()
  return (
    <div className="container2">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button type="primary" onClick={() => history.push(`/dashboard`)}>
            Back Home
          </Button>
        }
      />
    </div>
  )
}

export default Page500
