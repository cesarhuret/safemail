import { AiOutlineMail } from 'react-icons/ai';

export function MailIcon({size, extraStyles, onClick}:any) {
    return(
        <AiOutlineMail
            style={{
                fontSize: size,
                color: "#ffffff",
                strokeWidth: "3rem",
                ...extraStyles
            }} 
            onClick={onClick}
        />
    )
}