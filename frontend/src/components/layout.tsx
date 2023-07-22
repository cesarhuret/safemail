import { NavBar } from "./navbar";
import { Box, Grid } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Grid minH="100vh" templateRows="auto 1fr auto" bg="#050505">
        <NavBar />
        <Outlet />
      </Grid>
      <Box position="absolute" bottom="0" w="100%" h="100%" bg="#050505" zIndex={-1} transform="translateY(5rem)">
      </Box> 
    </>
  );
}
