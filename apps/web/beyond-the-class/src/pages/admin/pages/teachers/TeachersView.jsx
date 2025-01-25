import React, { useEffect } from 'react'
import axiosInstance from '../../../../config/users/axios.instance'
import { routesForApi } from '../../../../utils/routes/routesForLinks'

export default function TeachersView() {
    useEffect(
        ()=>{
            const fetch = async ()=>{
                const response = await axiosInstance.get(routesForApi.super.teachersAll)
                    // '/api/super/teacher-all
                console.log(response)
            } 
            fetch()
        },
        []
    )


  return (
    <div className='min-h-screen pt-8 px-2'>
        TeachersView
        </div>
  )
}
