import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axiosInstance from '../../../config/users/axios.instance'

export default function CourseInfo() {
    const {id} = useParams()

useEffect(()=>{
    console.log("Id here",id)
    if(!id){
        return (<p>No Content for this Id</p>)
    }
    // const res = axiosInstance.get('/api/')
},[])

  return (
    <div className='min-h-screen w-full'>
        <p className='text-lg text-black'>CourseInfo</p>
    </div>
  )
}
