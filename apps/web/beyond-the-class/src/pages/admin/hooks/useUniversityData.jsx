import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, createFilterOptions } from '@mui/material';
import CustomAutocomplete from '../../../components/FilterOption/CustomAutocomplete';


export default function useUniversityData() {

    const [universities, setUniversities] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState([]);
    const [campus, setCampus] = useState([]);


    useEffect(() => {

        const fetch = async () => {
            try {

                const response = await axios.get("/api/university/")
                // console.log(response.data)

                setUniversities(response.data);
                // console.log("universities: ", universities)
            } catch (error) {
                console.error(error.message)
            }
        }
        fetch()

    }, []);


    const handleUniversityChange = (event, value) => {
        // console.log("value", value)
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




    return {
        UniversitySelector:
            <CustomAutocomplete
                options={universities}
                label={"Universities"}
                onChange={handleUniversityChange}
                filterOptions={filterOptionsUniversites}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />
        ,
        campus,
        currentUniversity,
        setCurrentUniversity
    }
}
const filterOptionsUniversites = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.name)
        return option.name
    },
});