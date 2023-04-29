import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';


const EachTitle = (props) => {
  return (
    <Box my={2} sx={{width:'112%'}} ml={-8}>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography className="title" variant="h6" color="inherit" component="div">
          {/* <button onClick={print(props)}>t</button> */}
            {/* {props.title} */}
           Judul
        </Typography>
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default  EachTitle ;
