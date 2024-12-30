/* eslint-disable react/prop-types */
import React from 'react'
import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import { useEffect } from 'react';
import axiosInstance from '../../../config/users/axios.instance';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';



export default function SocitiesDropDown({ title, isOpenParam }) {
    const [isOpen, setIsOpen] = useState(isOpenParam ?? false);
    const [data, setData] = useState(null)
    const { authUser } = useAuthContext()

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const res = await axiosInstance.get('/api/user/subscribedSocieties', {
                    params: { id: authUser._id }
                });
                setData(res.data.joinedSocieties)
                // console.log(res)

            } catch (error) {
                console.error(error)
            }

        }
        fetchSocieties()
    }, [])


    const navigate = useNavigate()
    // console.log("HI", data);

    return (
        <div className="text-[#787878] px-2">
            {/* Dropdown Header */}
            <div
                className="flex items-center  py-1  cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span
                    className={`transform  transition-transform ${isOpen ? "rotate-90" : "rotate-0"
                        }`}
                >
                    <ChevronRight size={18} />
                </span>
                <p className="text-sm">{title}</p>
            </div>

            {/* Dropdown Items */}
            {isOpen && (
                < >
                    {data?.length &&
                        data.length > 0 &&
                        data.map((society, index) => (
                            <li onClick={() => navigate(`${authUser.role}/society/${society._id}`)}
                                key={index} className="w-full  flex items-center p-2 cursor-pointer">
                                <span className="mr-1">
                                    {society?.icon ? society.icon : "🟣"}
                                </span>
                                <span className="text-sm">{society.name}</span>
                                {/* {society.notification && (
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-auto"></span>
                )} */}
                            </li>
                        ))}
                </>
            )}
        </div>
    );
}
