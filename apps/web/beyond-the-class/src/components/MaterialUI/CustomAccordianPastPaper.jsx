/* eslint-disable react/prop-types */
import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button } from "@mui/material";
import PdfReact from "../PDFreact/PdfReact";
import { useNavigate } from "react-router-dom";




export default function CustomAccordianPastPaper({ t, years, subject }) {

    const navigate = useNavigate();

    const handleDiscussClick = () => {
        navigate('/pastpapers/course/discussion', { state: { years, subject, t } });
    };


    return (
        <Accordion defaultExpanded={false} className=" border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                aria-controls={`${t._id}-content`}
                id={`${t._id}-header`}
                className="bg-gray-100 dark:bg-gray-700"
            >
                <span className="text-gray-800 dark:text-gray-200 font-semibold"> Click</span>
            </AccordionSummary>
            <AccordionDetails className="p-2">
                <div className="h-96 overflow-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                    <PdfReact pdf={t.pdf} />
                </div>
            </AccordionDetails>
            <AccordionActions className="p-2 bg-gray-50 dark:bg-gray-700">
                <Button onClick={handleDiscussClick} variant="outlined" color="primary" className="mr-2">
                    <a target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400">Discuss</a>
                </Button>
                <Button variant="outlined" color="primary">
                    {/* {console.log(`Test url ${import.meta.env.VITE_API_URL}/api${t.pdf}`)} */}
                    <a href={`${import.meta.env.VITE_API_URL}/api${t.pdf}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400">Open PDF</a>
                </Button>
            </AccordionActions>
        </Accordion>
    );
}
