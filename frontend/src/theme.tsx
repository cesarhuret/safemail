import {color, extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    style = {
        global: (props: any) => ({
            body: {
                bg: "#050505",
            },
        })
    },
    fonts: {
        heading: `"Inter, sans-serif"`,
        body: `"Inter, sans-serif"`,
    }
});

export default theme;