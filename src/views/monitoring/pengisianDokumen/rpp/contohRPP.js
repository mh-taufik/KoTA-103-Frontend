import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import './rpp.css'
import { Button, Space } from 'antd'
import { useHistory } from 'react-router-dom'
function ContohRPP() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  let history = useHistory()

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

  const HandleButtonKembaliKeHalamanSelanjutnya = () => {
    history.push('/rencanaPenyelesaianProyek')
  }

  return (
    <div className='container'>
           <Button className="btn-pdf" type="primary" onClick={HandleButtonKembaliKeHalamanSelanjutnya}>
        Kembali Ke Halaman Sebelumnya
      </Button>
    <div className="App">
 

      <header className="App-header spacetop">
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
        </Space>
      </header>
      {/* <center>
        <div>
          <Document file="/contohrpp.pdf" onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(
              new Array(numPages),
              (el,index) => (
                <Page 
                  key={`page_${index+1}`}
                  pageNumber={index+1}
                />
              )
            )}
          </Document>
        </div>
      </center> */}
    </div>
    </div>
  )
}

export default ContohRPP
