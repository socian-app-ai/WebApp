import ShinyButton from "../../../components/Shinny/ShinnyButton";
import TypeWork, { useTypeEffect } from "../../../components/Shinny/Type/TypeWork";

export default function CafeNew() {

    const { textAreaRef, textValue, handleChange, RenderTextEffect } = useTypeEffect()

    return (
        <div className="pt-8 px-2 min-h-screen">
            <h5 className="text-lg font-semibold">Create New Cafe</h5>
            <ShinyButton />
            <TypeWork />


            <textarea
                onChange={handleChange}
                ref={textAreaRef}
                className="opacity-0 w-0 h-0"
            />
            <RenderTextEffect />
        </div>
    )
}
