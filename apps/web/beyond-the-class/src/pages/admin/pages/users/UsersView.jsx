import React from 'react'
import axiosInstance from '../../../../config/users/axios.instance'
import { useState } from 'react'

export default function UsersView() {
    const [allUsers, setAllUsers] = useState([])

    React.useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axiosInstance.get('/api/super/all-users')
                setAllUsers(res.data)
                console.table(res.data)
            } catch (error) {
                console.error(error)
                setAllUsers([])
            }
        }
        fetchAllUsers()
    }, [])
    return (
        <div className='flex flex-col font-thin'>
            {allUsers.map((user) => (
                <div className='flex flex-row space-x-3 bg-gray-600 rounded-lg my-1' key={user._id}>
                    <div className='w-10 h-10 rounded-md overflow-hidden'>
                        <img src={user?.profile?.picture} className='w-full h-full' />
                    </div>

                    <h6 className='text-md font-bold'>{user?.name || 'No name'}</h6>
                    <p className='text-gray-300'>{user?.username || 'No username'}</p>
                    <span className='text-fuchsia-100 font-semibold'>{user?.role || 'No Role'}</span>
                </div>
            ))}

        </div>
    )
}
