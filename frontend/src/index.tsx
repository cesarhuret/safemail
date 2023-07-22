import { ColorModeScript, ChakraProvider, Flex, Spinner } from "@chakra-ui/react"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { App } from "./pages/App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { RouterProvider } from "react-router-dom"
import router from "./Router"
import theme from "./theme"

const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container)

const FullSpinner = () => (
	<Flex w={'100vw'} h={'100vh'} bg={'#050505'} justifyContent={'center'} alignItems={'center'}>
		<Spinner/>
	</Flex>
)


root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} fallbackElement={<FullSpinner/>}/>
    </ChakraProvider>
  </React.StrictMode>,
)

serviceWorker.unregister()
reportWebVitals()

