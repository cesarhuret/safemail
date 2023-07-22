import { color, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
};

const theme = extendTheme({
  config: {
    initialColorMode: 'dark'
  },
  style: {
    global: (props: any) => ({
      body: {
        backgroundColor: "#050505",
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
        baseStyle: {
            dialog: {
                boxShadow: "-14px 14px 35px #18fc8455, 14px -14px 35px #36efc055",
                bg: "#050505",
                borderWidth: "0.1rem",
                borderRadius: 15
            }
        }
    }
  },
});

export default theme;
