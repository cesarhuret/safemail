import { BsClipboardPlus } from "react-icons/bs";

export function ClipboardAddIcon({size, extraStyles, onClick}:any) {
    return(
        <BsClipboardPlus
            style={{
                fontSize: size,
                ...extraStyles
            }} 
            onClick={onClick}
        />
    )
}