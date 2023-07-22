import { GoLinkExternal } from 'react-icons/go';

export function ExtrenalLinkIcon({size, extraStyles, onClick}:any) {
    return(
        <GoLinkExternal
            style={{
                fontSize: size,
                ...extraStyles
            }} 
            onClick={onClick}
        />
    )
}