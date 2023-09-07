import { InputProps, PropsOf, TextProps, color, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: { 
    primaryFontColor: "white", 
    secondaryFontColor: "white"
  },
  semanticTokens: {
    colors:  ({colorMode} : {colorMode: string}) => ({
      'chakra-body-text': { _light: colorMode == 'dark' ? "#fff" : '#000' },
      'chakra-placeholder-color': { _light: colorMode == 'dark' ? "#fff" : '#000' },
    }),
  },
  style: {
    global: ({colorMode}: any) => ({
      body: {
        backgroundColor: colorMode == 'dark' ? "#000" : '#f5f5f5',
      },
      "::-webkit-scrollbar": {
        width: "5px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#444",
      },
    }),
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Text: {
      baseStyle: ({colorMode}: any) => ({
        color: colorMode == 'dark' ? "#fff" : '#000',
      }),
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "#102c34",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
    Modal: {
        baseStyle: ({colorMode}: {colorMode: string}) => ({
            dialog: {
                boxShadow: "-14px 14px 35px #fe980055, 14px -14px 35px #af2e0455",
                bg: colorMode == 'dark' ? "#050505" : '#f5f5f5',
                borderWidth: "0.1rem",
                borderRadius: 15
            }
        })
    }
  },
});

export default theme;
