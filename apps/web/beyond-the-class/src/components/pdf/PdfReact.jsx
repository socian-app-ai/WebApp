import { useState } from "react";

import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


// eslint-disable-next-line react/prop-types
export default function PdfReact({ pdf }) {
    // console.log("PDF", pdf)
    const [numPages, setNumPages] = useState();
    const [scale, setScale] = useState(1);
    // const [pageNumber, setPageNumber] = useState(1);


    function onDocumentLoadSuccess({ numPages }) {
        // console.log(numPages)
        setNumPages(numPages);
    }


    const handleDoubleClick = () => {
        setScale(prevScale => prevScale === 1 ? 1.5 : 1);
    };


    return (
        <div onDoubleClick={handleDoubleClick} style={{ cursor: 'pointer' }}>
            {/* {console.log("PDF file naem ", pdf)} */}
            {/* <Document file={decodeURIComponent(`${import.meta.env.VITE_API_URL}/api${pdf}`)} onLoadSuccess={onDocumentLoadSuccess}> */}
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages)).map((x, i) => i + 1).map((page, idx) => {
                    return (<Page className="pb-5 " key={idx} scale={scale} pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />)

                })}

            </Document>

        </div>
    )
}