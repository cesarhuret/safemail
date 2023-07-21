import { NavBar } from "./navbar"
import { Footer } from "./footer"
import { Grid } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

export function Layout() {
    return (
        <Grid minH="100vh" templateRows="auto 1fr auto">
            <NavBar />
            <Outlet />
            <Footer />
        </Grid>
    )
}