import React, { Fragment } from 'react';
import API from 'src/services'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Table } from '@mui/material';
import '../../../../scss/dahmor.scss'
import { AppHeader } from 'src/components';
import EachTitle from '../../component/eachTitle';
const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );



const a = "121"
const card = (

    <React.Fragment>
      <CardContent>
        <Typography variant="h4" component="div">
         DATA MAHASISWA 
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Kerja Praktik (KP)
        </Typography>
        <Typography variant="body2">
            <table>
                <tr className='headdash'>
                    <td >NAMA</td>
                    <td>{localStorage.name}</td>
                </tr>
                <tr className='headdash'>
                    <td>NIM</td>
                    <td>{localStorage.username}</td>
                </tr>
                <tr className='headdash'>
                    <td>Lokasi Kerja Praktik</td>
                    <td>CV Bima Inspira Solusindo</td>
                </tr>
            </table>
        </Typography>
      </CardContent>
    </React.Fragment>
  );
  
  export default function HeadDashboard() {
    return (
     <Fragment>
        <EachTitle title={a}/>
         <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined">{card}</Card>
      </Box>
     </Fragment>
    );
  }



// class HeadDashboard extends Component{
//     state= {
//         pembimbing : [],
//     }
    
//     getInformationArtifakCard = () => {
        
//     }

//     getRole = (role) => {
//         console.log('role', localStorage)
//       }

    
//     componentDidMount(){
//         this.getRole()
//     }

    
// const bull = (
//     <Box
//       component="span"
//       sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//     >
//       •
//     </Box>
//   );
  

//     render () {
//         return (
          
//             <Fragment>
//                <div className='tada-participant'>

//                </div>


//           </Fragment>
//         )
//     }
// }

//   export default HeadDashboard
  