import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, createFilterOptions } from '@mui/material';
import CustomAutocomplete from '../../../components/FilterOption/CustomAutocomplete';
import axiosInstance from '../../../config/users/axios.instance';


export default function useUniversityData() {

    const [universities, setUniversities] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);


    const [currentUniversity, setCurrentUniversity] = useState([]);
    const [currentCampus, setCurrentCampus] = useState([]);
    const [currentDepartment, setCurrentDepartment] = useState([]);
    const [currentSubject, setCurrentSubject] = useState([]);
    const [currentTeacher, setCurrentTeacher] = useState([]);


    const [campus, setCampus] = useState([]);


    useEffect(() => {

        const fetch = async () => {
            try {

                const response = await axiosInstance.get("/api/super/university/")
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
            setCampuses(courseList)

            // console.log("Selected Campus:", courseList);
        } else {
            setCampus([]);
            setCampuses([]);
            setCurrentUniversity([])
        }
    };


    const handleCampusesChange = (event, value) => {
        // console.log("CAMPUS", value)
        setCurrentCampus(value)
        setDepartments(value.departments)
        setTeachers(value.teachers)
    }

    const handleDepartmentChange = (event, value) => {
        // console.log("Department", value)
        setCurrentDepartment(value)
        setSubjects(value.subjects)
    }


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
        CampusSelector:
            <CustomAutocomplete
                options={campuses}
                label={"Campuses"}
                onChange={handleCampusesChange}
                filterOptions={filterOptionsCampuses}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />
        ,
        DepartmentSelector:
            <CustomAutocomplete
                options={departments}
                label={"Departments"}
                onChange={handleDepartmentChange}
                filterOptions={filterOptionsDepartments}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />,

        SubjectSelector:
            <CustomAutocomplete
                options={subjects}
                label={"Subjects"}
                onChange={(event, value) => setCurrentSubject(value)}
                filterOptions={filterOptionsSubjects}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />,

        TeacherSelector:
            <CustomAutocomplete
                options={teachers}
                label={"Teachers"}
                onChange={(event, value) => setCurrentTeacher(value)}
                filterOptions={filterOptionsTeachers}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />,
        currentUniversity,
        setCurrentUniversity,

        campus,
        currentCampus,


        currentDepartment,
        setCurrentDepartment,

        currentSubject,
        setCurrentSubject,

        teachers,
        currentTeacher

    }
}
const filterOptionsUniversites = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.name)
        return option.name
    },
});
const filterOptionsCampuses = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options:c ", option.name)
        return option.name
    },
});
const filterOptionsDepartments = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.name)
        return option.name
    },
});
const filterOptionsSubjects = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.name)
        return option.name
    },
});
const filterOptionsTeachers = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option.name)
        return option.name
    },
});