import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"

const TypeWork = () => {
    const textAreaRef = useRef(null)
    const [textValue, setTextValue] = useState("")

    // const rotateValue = Math.floor(Math.random() * 201) - 100

    console.log("Text Value", textValue)
    return (
        <main className="p-5 flex flex-col">
            <textarea
                onChange={(e) => setTextValue(e.target.value)}
                ref={textAreaRef}
                className="opacity-0 w-0 h-0"
            />
            <div
                onClick={() => textAreaRef.current.focus()}
                className="min-h-60 bg-neutral-900 text-slate-100 font-spaceGrotesk whitespace-pre-wrap text-xl min-w-full p-5 overflow-x-hidden"
            >
                <AnimatePresence>
                    {textValue.split("").map((letter, index) => {
                        return (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}

                                transition={{ duration: 0.5, ease: "easeIn" }}
                                key={index}
                                className={letter !== "\n" ? "inline-block mr-0.5" : "inline"}
                            >
                                {letter}
                            </motion.span>
                        )
                    })}
                </AnimatePresence>
            </div>
        </main>
    )
}

export default TypeWork;




// export const useTypeEffect = () => {
//     const textAreaRef = useRef(null)
//     const [textValue, setTextValue] = useState("")

//     const handleChange = (e) => setTextValue(e.target.value)

//     return {
//         textAreaRef,
//         textValue,
//         handleChange,
//         RenderTextEffect: () => (
//             <div
//                 onClick={() => textAreaRef.current.focus()}
//                 className="min-h-60 bg-neutral-900 text-slate-100 font-spaceGrotesk whitespace-pre-wrap text-xl min-w-full p-5 overflow-x-hidden"
//             >
//                 <AnimatePresence>
//                     {textValue.split("").map((letter, index) => (
//                         <motion.span
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.5, ease: "easeIn" }}
//                             key={index}
//                             className={letter !== "\n" ? "inline-block mr-0.5" : "inline"}
//                         >
//                             {letter}
//                         </motion.span>
//                     ))}
//                 </AnimatePresence>
//             </div>
//         ),
//     }
// }

export const useTypeEffect = () => {
    const textAreaRef = useRef(null)
    const [textValue, setTextValue] = useState("")
    const [displayedText, setDisplayedText] = useState([])

    useEffect(() => {
        if (textValue.length > displayedText.length) {
            // Add only the new character
            setDisplayedText([...displayedText, textValue[textValue.length - 1]])
        } else if (textValue.length < displayedText.length) {
            // Handle backspace (remove last character)
            setDisplayedText(textValue.split(""))
        }
    }, [textValue])

    const handleChange = (e) => setTextValue(e.target.value)

    return {
        textAreaRef,
        textValue,
        handleChange,
        RenderTextEffect: () => (
            <div
                onClick={() => textAreaRef.current.focus()}
                className="min-h-60 bg-neutral-900 text-slate-100 font-spaceGrotesk whitespace-pre-wrap text-xl min-w-full p-5 overflow-x-hidden"
            >
                {displayedText.map((letter, index) => (
                    <motion.span
                        key={index}
                        initial={index === displayedText.length - 1 ? { opacity: 0 } : {}}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9, ease: "easeIn" }}
                        className={letter !== "\n" ? "inline-block mr-0.5" : "inline"}
                    >
                        {letter}
                    </motion.span>
                ))}
            </div>
        ),
    }
}





export const TypeWorkDownUp = () => {
    const textAreaRef = useRef(null)
    const [textValue, setTextValue] = useState("")

    const rotateValue = Math.floor(Math.random() * 201) - 100

    return (
        <main className="p-5 flex flex-col">
            <textarea
                onChange={(e) => setTextValue(e.target.value)}
                ref={textAreaRef}
                className="opacity-0 w-0 h-0"
            />
            <div
                onClick={() => textAreaRef.current.focus()}
                className="min-h-60 bg-neutral-900 text-slate-100 font-spaceGrotesk whitespace-pre-wrap text-xl min-w-full p-5 overflow-x-hidden"
            >
                <AnimatePresence>
                    {textValue.split("").map((letter, index) => {
                        return (
                            <motion.span
                                initial={{ opacity: 0, y: 100, rotate: rotateValue }}
                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                exit={{
                                    opacity: 0,
                                    y: 100,
                                    transition: {
                                        duration: 0.15,
                                    },
                                    rotate: rotateValue,
                                }}
                                transition={{ duration: 0.5, ease: "easeIn" }}
                                key={index}
                                className={letter !== "\n" ? "inline-block mr-0.5" : "inline"}
                            >
                                {letter}
                            </motion.span>
                        )
                    })}
                </AnimatePresence>
            </div>
        </main>
    )
}




