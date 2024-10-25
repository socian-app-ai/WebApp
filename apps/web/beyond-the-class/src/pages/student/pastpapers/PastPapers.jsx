import { useEffect, useState } from "react"
import CustomAccordianPastPaper from "../../components/MaterialUI/CustomAccordianPastPaper"
import { useNavigate } from "react-router-dom"
import { ArrowBack } from "@mui/icons-material"
import axiosInstance from "../../config/axios.instance"



export default function PastPapers() {
    const [years, setYears] = useState([])
    const [subjectName, setSubjectName] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        // PDF of all Year of specific paper then href to another comment page

        const params_CourseName = new URLSearchParams(location.search).get('name')
        const params_SubjectId = new URLSearchParams(location.search).get('id')
        const params_CourseDepartment = new URLSearchParams(location.search).get('dep')

        // console.log(params_CourseDepartment, params_CourseName, params_SubjectId)

        const fetch = async () => {
            const response = await axiosInstance.get(`/api/subject/pdf-all-years/${params_SubjectId}`)
            // console.log(response.data.subjects)
            const subjects = response.data.subjects
            setSubjectName(subjects.name)
            setYears(subjects.years)
        }
        fetch()
    }, [])


    const renderPapers = (papers, title) => (
        <div className="w-full flex flex-col">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</p>
            {papers.theory.length > 0 && papers.theory.map(t => (
                <CustomAccordianPastPaper key={t._id} t={t} years={years} subject={subjectName} />
            ))}
            {papers.lab.length > 0 && papers.lab.map(l => (
                <CustomAccordianPastPaper key={l._id} t={l} years={years} subject={subjectName} />
                // <object key={l._id} data={`/api/${l.pdf}`} type="application/pdf" width="100%" height="100%">
                //     <p>Alternative text - include a link <a key={l._id} href={`/api/${l.pdf}`} target="_blank" rel="noopener noreferrer">to the PDF!</a></p>
                // </object>
            ))}
        </div>
    );


    return (
        <div className="p-4 pt-20 bg-gray-50 dark:bg-gray-900 min-h-svh">

            <div className="flex items-center">
                <ArrowBack onClick={() => { navigate(-1) }} />
                <h6 className="text-2xl font-bold p-2 text-gray-800 dark:text-gray-200">{subjectName}</h6>

            </div>
            <div className="w-full ">
                {years && years.map((data) => (
                    <div key={data._id} className="flex flex-col w-full my-4 border dark:bg-gray-800 bg-white rounded-lg shadow-lg">
                        <p className="w-full text-lg font-bold pr-4 text-end p-3 bg-slate-500 dark:bg-gray-700 text-white rounded-t-lg">{data.year}</p>
                        {data.fall && (data.fall.final.theory.length > 0 || data.fall.final.lab.length > 0 || data.fall.mid.theory.length > 0 || data.fall.mid.lab.length > 0) && (
                            <div className="p-4">
                                <h6 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Fall</h6>
                                <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
                                    {renderPapers(data.fall.final, "Final")}
                                    {renderPapers(data.fall.mid, "Mid")}
                                </div>
                            </div>
                        )}
                        {data.spring && (data.spring.final.theory.length > 0 || data.spring.final.lab.length > 0 || data.spring.mid.theory.length > 0 || data.spring.mid.lab.length > 0) && (
                            <div className="p-4">
                                <h6 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Spring</h6>
                                <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
                                    {renderPapers(data.spring.final, "Final")}
                                    {renderPapers(data.spring.mid, "Mid")}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}


