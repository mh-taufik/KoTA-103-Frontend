import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && <div style={{width: "15px", textAlign:"center"}}>{icon}</div>}
        {name && icon && <div style={{paddingLeft: "30px"}} id="nama">{name}</div>}
        {name && !icon && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
          <Component
            style={icon ? {paddingLeft: "22px", whiteSpace:'normal'} : !rest.to ? {paddingLeft: "22px", whiteSpace:'normal'} : {paddingLeft: "3.6rem", whiteSpace:'normal'}}
            {...(rest.to &&
              !rest.items && {
                component: NavLink,
                activeClassName: 'active',
              })}
            key={index}
            {...rest}
          >
            {navLink(name, icon, badge)}
          </Component>
    )
  }
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
          <Component
            style={{paddingLeft: "8px"}}
            idx={String(index)}
            key={index}
            toggler={navLink(name, icon)}
            visible={location.pathname.startsWith(to)}
            {...rest}
          >
            {item.items?.map((item) =>
              item.items ? navGroup(item, item.index) : navItem(item, item.index),
            )}
          </Component>
    )
  }

  return (
    <>
    {items && items.filter(item => item.role === localStorage.getItem('id_role')).map((item) => (
      <React.Fragment key={item.index}>
        {item.items ? navGroup(item, item.index) : navItem(item, item.index)}
      </React.Fragment>
    ))}
    </>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
