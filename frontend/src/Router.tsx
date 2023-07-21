import { createBrowserRouter, Outlet } from "react-router-dom";
import { App } from "./App";
import { Layout } from "./components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        id:"root",
        children:[
            {
                "path": "/",
                "element": <App />,
                "id": "app"
            }
        ]
    }
])

export default router;