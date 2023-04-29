import axios from "axios";
import React from "react";
const FAKE_API = ' http://localhost:3004'

const Get = (path)  =>  {
    const promise = new Promise((resolve, reject)=>{
        axios.get( `${FAKE_API}/${path}`)
        .then((result) => {
                resolve(result.data);
        },(err) => {
            reject(err);
        })
    })
    return promise
} 




//sementara data get nama pembimbing
const getDataArtifak = () => Get('pembimbing');


const API = {
    getDataArtifak
}

export default API