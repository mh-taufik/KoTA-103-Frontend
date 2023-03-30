import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">Copyright &copy; 2022 </span>
        <a href="http://jtk.polban.ac.id/" target="_blank" rel="noopener noreferrer">
          <b>Jurusan Teknik Komputer dan Informatika Polban</b>
        </a>
      </div>
      <div className="ms-auto">
        <span className="me-1">Version 1.0.0</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
