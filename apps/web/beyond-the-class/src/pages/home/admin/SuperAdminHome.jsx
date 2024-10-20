
import CustomAutocomplete from '../../../components/FilterOption/CustomAutocomplete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { createFilterOptions } from '@mui/material';

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
        setCurrentUniversity(value.name)
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

            <h6>
                {currentUniversity}
            </h6>
            <div>
                {
                    campus.map(
                        campus => (<p key={campus._id}>{campus.name}</p>)
                    )
                }
            </div>


        </div>
    )
}
const filterOptionsUniversites = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.subjects)
        return option.name
    },
});