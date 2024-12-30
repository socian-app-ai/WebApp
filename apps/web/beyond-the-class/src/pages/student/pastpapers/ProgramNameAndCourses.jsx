import { Box, createFilterOptions, Divider, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/users/axios.instance";
import { CustomAutocompleteSearchStyle } from '../../../components/FilterOption/CustomAutocomplete';



// const departmentCourses = {
//     "Computer Science And Software Engineering": [
//         "Web Technologies",
//         "Data Structure and Algorithm",
//         "Discrete Structures",
//         "Professional practices in IT (PPIT)",
//         "Digital logic design (DLD)",
//         "Data communications and computer networks",
//         "Mobile application development",
//         "ICT",
//         "Visual programming",
//         "Communication skills",
//         "Discrete Mathematics",
//         "Electricity magnetism and optics",
//         "Linear algebra",
//         "Operating system",
//         "Computer Architecture",
//         "Corpus Linguistics",
//         "Intro to Bio Informatics",
//         "Machine learning",
//         "Research Methodology",
//         "Software engineering concepts",
//         "Testing and Evaluation",
//         "Introduction to Bioinformatics",
//         "Scripting languages",
//         "Pak Studies",
//         "Software testing",
//         "Object oriented software engineering",
//         "Artificial intelligence",
//         "Database I",
//         "M&AL",
//         "Sociology",
//         "Design and analysis of algorithm",
//         "English comprehension and composition",
//         "Introduction to Computing",
//         "Programming fundamental",
//         "Software project management",
//         "Theory of automata",
//         "Differential equations",
//         "Human computer interaction (HCI)",
//         "Numerical Computing",
//         "Database II",
//         "Multivariable calculus",
//         "Software quality engineering",
//         "Applied Physics for engineer",
//         "Electric circuit analysis",
//         "Human resource management",
//         "ITCP",
//         "Report writing skills",
//         "Calculus"
//     ],
//     "Management Sciences": [
//         "Statistical Inference",
//         "Management theory and practice",
//         "Operation management",
//         "Advance microeconomics past paper",
//         "International Financial Management",
//         "Macro Economics",
//         "Monetary Economics",
//         "Communication skills",
//         "Business Mathematics and statistics",
//         "Managerial accounting",
//         "Corporate law",
//         "Introduction to statistics",
//         "Economics of environmental and natural resource",
//         "Corporate governance",
//         "Cost accounting",
//         "Intro to management",
//         "Business Law"
//     ],
//     "Humanities Department": [
//         "Academic Reading and Writing",
//         "Classical & Neo-Classical Poetry",
//         "LFM",
//         "Modern Critical Theory",
//         "Postcolonial Literature",
//         "Literary forms and movement",
//         "Business English",
//         "18th & 19th century Novel",
//         "Classics in Drama",
//         "International Relations",
//         "Language Skills",
//         "Pak Studies",
//         "Research Methodology",
//         "American Literature",
//         "Active Citizen",
//         "Introduction to Anthropology",
//         "Phonetics and Phonology",
//         "Report writing skills",
//         "Call",
//         "Classical Poetry",
//         "History of the US",
//         "Introduction to Linguistics",
//         "Introduction to Philosophy",
//         "Romantic and Victorian",
//         "Introduction to Fiction and Nonfiction"
//     ],
//     "Mathematics": [
//         "Differential equations",
//         "Mathematical Statistics",
//         "Statistical Inference",
//         "Analytical Number theory",
//         "Functional Analysis",
//         "Set Topology",
//         "Electricity and magnetism",
//         "Numerical Computing",
//         "Abstract algebra",
//         "Discrete Mathematics",
//         "Multivariable calculus",
//         "Analytical dynamics",
//         "Graph Theory",
//         "Introduction to Quantum Mechanics",
//         "Partial Differential Equations",
//         "Chinese",
//         "Introduction to computer programming",
//         "Linear algebra",
//         "Statistics and probability theory",
//         "Complex analysis",
//         "Real Analysis II",
//         "Mechanics-I",
//         "ICP",
//         "Calculus 1",
//         "Set theory and logics",
//         "Introduction to Computing",
//         "Algorithm"
//     ],
//     "Environmental Science": [
//         "Fundamental of Biology"
//     ]
// };

export default function ProgramNameAndCourses() {
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);

    const [currentDepartment, setCurrentDepartment] = useState([]);

    useEffect(() => {

        const fetch = async () => {
            try {

                const response = await axiosInstance.get("/api/department/with-subjects-by-campus")
                // console.log(JSON.stringify(response.data))

                const allDepartments = response.data.flatMap(campus => campus.departments);
                // console.log("Flattened Departments:", allDepartments);

                setDepartments(allDepartments);

                // setCourses(allDepartments[3].subjects.map(v => v))
                // console.log("Departments: ", departments)
            } catch (error) {
                console.error(error.message)
            }
        }
        fetch()

    }, []);



    const handleDepartmentChange = (event, value) => {
        // console.log("value", value)
        setCurrentDepartment(value.name)
        // console.log("courses: --", value.subjects.map(_ => console.log(_)))
        if (value) {
            const courseList = value.subjects.map(subject => subject);
            setCourses(courseList);
            setFilteredCourses(courseList);

            // console.log("Selected Courses:", courseList);
        } else {
            setCourses([]);
            setFilteredCourses([]);
            setCurrentDepartment([])
        }
    };

    const handleFilter = (event, value) => {
        const filterValue = value?.toLowerCase() || '';
        const filtered = courses.filter(course =>
            course.name.toLowerCase().includes(filterValue)
        );
        setFilteredCourses(filtered);
    };

    return (
        <Box className='w-full min-h-svh relative px-2 pt-8'>
            <div>
                <div className="flex flex-col md:flex-row">
                    <Box className="flex flex-col lg:flex-row w-full lg:items-center">
                        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>
                            Department:
                        </Typography>
                        <div className="px-3 py-2 w-full">
                            <CustomAutocompleteSearchStyle
                                options={departments}
                                label={"Department"}
                                onChange={handleDepartmentChange}
                                filterOptions={filterOptionsDepartment}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                            />
                        </div>
                    </Box>




                    <Box className="flex flex-col lg:flex-row w-full lg:items-center py-2">
                        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>
                            Courses:
                        </Typography>
                        <div className="px-3 py-2 w-full">
                            <CustomAutocompleteSearchStyle
                                options={courses}
                                label={"Courses"}
                                filterOptions={filterOptionsCouses}
                                onInputChange={handleFilter}
                                onBlur={(event) => handleFilter(event, event.target.value)}
                                isOptionEqualToValue={(option, value) => option._id === value._id}

                            />
                        </div>
                    </Box>

                </div>
                <Divider className="bg-gray-300  dark:bg-white" />

                <Box className="p-8 md:p-10">
                    <Grid container spacing={3}>
                        {filteredCourses && filteredCourses.map((course, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index} >
                                <Link key={course._id} to={`/student/course-info/${course._id}`}
                                    className="flex text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {course.name}
                                    {/* <PastPaper
                                        courseName={course.name}
                                        subjectId={course._id}
                                        department={currentDepartment}
                                    /> */}
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
            <div className="absolute bottom-2 right-2">
                <a href='/pastpapers/upload/consent' className="text-lg">Upload more documents?</a>
            </div>
        </Box>
    );
}

const filterOptionsDepartment = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option)
        return option.name
    },
});
const filterOptionsCouses = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => {
        // console.log("Options: ", option)
        return option.name
    },
});