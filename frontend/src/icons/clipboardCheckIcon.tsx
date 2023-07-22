import { BsClipboardCheck } from "react-icons/bs";

export function ClipboardCheckIcon({size, extraStyles, onClick}:any) {
    return(
        <BsClipboardCheck
            style={{
                fontSize: size,
                ...extraStyles
            }} 
            onClick={onClick}
        />
    )
}