import React from 'react';
import { Component } from 'react';
import './monitoringDashboard.css'
import API from 'src/services'; 
import { Fragment } from 'react';
import axios from 'axios';
import HeadDashboard from './component/headDashboard';
import EachTitle from '../component/eachTitle';
//   const MonitoringPelaksanaan = () => {
//     let [infoArtifak, setInfoArtifak] = React.useState('')

//     const
//   }
  


class MonitoringPelaksanaan extends Component{
  constructor(props) {
    super(props);
  }
    state= {
        pembimbing : [],
    }
    
    getInformationArtifakCard = () => {
        
    }

    getRole = (role) => {
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

    
    componentDidMount(){

        
      
        API.getDataArtifak().then(result => {
            this.setState({
                pembimbing:result
            },()=>{
                console.log(this.state.pembimbing)
            })
    
        })

     

    }


    render () {
        return (
          
            <Fragment>
            <HeadDashboard />
            <EachTitle  title='ayam'/>
            <div id="root">
            <div className="container pt-5">
              <div className="row align-items-stretch">
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">    
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Portfolio Balance<svg
                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                      </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count"></span>
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Rental income<svg
                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                      </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">€500</span><span
                      className="hind-font caption-12 c-dashboardInfo__subInfo">Last month: €30</span>
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Available funds<svg
                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                      </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">€5000</span>
                  </div>
                </div>
                <div className="c-dashboardInfo col-lg-3 col-md-6">
                  <div className="wrap">
                    <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Rental return<svg
                        className="MuiSvgIcon-root-19" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                      </svg></h4><span className="hind-font caption-12 c-dashboardInfo__count">6,40%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EachTitle/>
          </Fragment>
        )
    }
}

  export default MonitoringPelaksanaan 
  