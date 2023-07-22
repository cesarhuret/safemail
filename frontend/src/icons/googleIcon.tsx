import { FcGoogle } from "react-icons/fc";

export function GoogleIcon ({size, extraStyles, onClick}:any) {
    return(
        <FcGoogle
            style={{
                fontSize: size,
                ...extraStyles
            }} 
            onClick={onClick}
        />
    )
}