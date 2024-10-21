
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useUniversityData from '../hooks/useUniversityData';



export default function AddUniversityPage() {
    const [universities, setUniversities] = useState([]);
    const [universityData, setUniversityData] = useState([])
    const [universityId, setUniversityId] = useState(null)



    const urlParams = useParams()
    console.log(urlParams)

    const { UniversitySelector, campus, currentUniversity, setCurrentUniversity } = useUniversityData()
    if (universityId) {
        universityData.length != 0 && setCurrentUniversity(universityData)
    }

    useEffect(() => {
        // DID CODE FOR CAMPUS , MOVE THIS TO CAMPUS
        const fetch = async () => {
            const res = await axios.get(`/api/university?universityId=${universityId}`)
            setUniversityData(universityData)
        }
        universityId && fetch(universityId)



        // Fetch universities
        // const fetchUniversities = async () => {
        //     try {

        //         const response = await axios.get("/api/university/")
        //         console.log(response.data)

        //         setUniversities(response.data);
        //         // console.log("universities: ", universities)
        //     } catch (error) {
        //         console.error(error.message)
        //     }
        // }
        // fetchUniversities()
    }, [])
    return (
        <div>
            {UniversitySelector}
            <div>
                {(
                    <>
                        <p>Name: {currentUniversity.length != 0 && currentUniversity.name}</p>
                        <p>Main Address: {currentUniversity.length != 0 && currentUniversity.mainLocationAddress}</p>
                        <p>Telephone: {currentUniversity.length != 0 && currentUniversity.telephone}</p>
                        <p>Admin emails: {currentUniversity.length != 0 && currentUniversity.adminEmails}</p>
                    </>
                )
                }
            </div>

        </div>
    )
}

// db data
// name
// mainLocationAddress
// telephone
// adminEmails
// picture
// campuses
// registered
// isRegistered
// registeredBy
// users


// // PSeudo
// <select university> 

// if already selected> 
// university name
// main location
// telephone number
// admin emails 



// Add 1
// campus Name
// campus Location

// patterns 
// teahcer 
// student{
//     domain: @cuilahore.edu.pk
//     reg: fa21-bcs-058 or se,ai,etc
// }
//     <------------>

// Add 2
// campus Name
// campus Location

// patterns 
// teahcer 
// student{
//     domain: @cuilahore.edu.pk
//     reg: fa21-bcs-058 or se,ai,etc
// }


// Next Page
// <SELECT CAMPUS>
// Acadmeic Format :
// 1. Quiz, assignment, midterm , final term
// 2. Quiz, assignment, sessoinal 1+sessoinal 2 , final term
// 3. other?

// Departments
// <ADD Departments>
// <SELECT FROM DEFAULT LIST>


// Subjects

// <Select Departments>
// <ADD Subject>
