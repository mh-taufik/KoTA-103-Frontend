import React from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Space, Upload } from 'antd'
import '../rpp/rpp.css'
import Text from 'antd/lib/typography/Text'

const UploadLaporanKPPKL = () => {
  return (
    <>
      <div className="container">
        <h4 className='title-s'>Laporan KP dan PKL</h4>
        <Text type="warning">* Laporan KP / PKL dikumpulkan hanya satu file <br/> * Laporan dapat dikumpulkan kembali selama belum mencapai deadline</Text>
        <div className='spacing'></div>
        <Space
          direction="vertical"
          style={{
            width: '100%',
          }}
          size="large"
        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined /> }>Upload Dokumen Laporan KP dan PKL (Max: 1)</Button>
          </Upload>
        </Space>
      </div>
    </>
  )
}

export default UploadLaporanKPPKL
