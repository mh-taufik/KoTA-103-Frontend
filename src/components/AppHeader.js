import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const getRole = (role) => {
    let nameRole="";
    if(role === "0"){
      if(localStorage.getItem('id_prodi') === "0"){
        nameRole="Panitia KP"
      }else{
        nameRole="Panitia PKL"
      } 
    }else if(role === "1"){
      if(localStorage.getItem('id_prodi') === "0"){
        nameRole="Mahasiswa D3"
      }else{
        nameRole="Mahasiswa D4"
      } 
    }else if(role === "2"){
      nameRole="Perusahaan"
    }else if(role === "3"){
      if(localStorage.getItem('id_prodi') === "0"){
        nameRole="Ketua Program Studi D3"
      }else{
        nameRole="Ketua Program Studi D4"
      } 
    } 
    return nameRole
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
        <b style={{paddingTop:"10px"}}>{`Halo, ${localStorage.getItem('name')} (${getRole(localStorage.getItem('id_role'))})`}</b>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
