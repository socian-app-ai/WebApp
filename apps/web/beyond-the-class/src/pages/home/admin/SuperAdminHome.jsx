
import CustomAutocomplete from '../../../components/FilterOption/CustomAutocomplete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, createFilterOptions } from '@mui/material';

export default function SuperAdminHome() {

    const [universities, setUniversities] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState([]);
    const [campus, setCampus] = useState([]);


    useEffect(() => {

        const fetch = async () => {
            try {

                const response = await axios.get("/api/university/")
                console.log(response.data)

                setUniversities(response.data);
                // console.log("universities: ", universities)
            } catch (error) {
                console.error(error.message)
            }
        }
        fetch()

    }, []);


    const handleUniversityChange = (event, value) => {
        console.log("value", value)
        setCurrentUniversity(value)

        if (value) {
            const courseList = value.campuses.map(subject => subject);
            setCampus(courseList);

            // console.log("Selected Campus:", courseList);
        } else {
            setCampus([]);
            setCurrentUniversity([])
        }
    };




    return (
        <div className='min-h-screen w-full '>


            <CustomAutocomplete
                options={universities}
                label={"Universities"}
                onChange={handleUniversityChange}
                filterOptions={filterOptionsUniversites}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />

            {
                currentUniversity.length !== 0 ?
                    <div className='space-y-5 mt-5 pr-10'>
                        <div>

                            <h1 className='text-2xl'>University</h1>

                            <div className='w-full flex flex-row my-2'>
                                <Avatar src={currentUniversity.picture} />
                                <h6 className='ml-2 text-2xl'>{currentUniversity.name}</h6>
                            </div>

                        </div>

                        <div>
                            <h1 className='text-2xl'>Campus</h1>
                            <div>
                                {
                                    campus.map(
                                        campus => (<div
                                            className='flex flex-row justify-between items-center w-full border-2 rounded-md p-2 my-3 bg-slate-100 dark:bg-black'
                                            key={campus._id}>
                                            <div className='flex flex-row items-center'>
                                                {/* <span style={{ color: campus.registered.isRegistered ? 'red' : '' }} >●</span> */}
                                                <div className={`w-2 h-2 rounded-full mr-2 ${campus.registered.isRegistered ? 'bg-green-300' : 'bg-red-500'}`}></div>

                                                <p className='text-lg'>{campus.name}</p>
                                            </div>

                                            <button className='border px-1 bg-gray-100 hover:bg-gray-300 rounded-lg text-sm'>view all</button>
                                        </div>)
                                    )
                                }
                            </div>
                        </div>

                    </div> :
                    <></>
            }

        </div>
    )
}
const filterOptionsUniversites = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.name)
        return option.name
    },
});