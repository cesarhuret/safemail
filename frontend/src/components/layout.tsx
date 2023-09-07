import { NavBar } from "./navbar";
import { Alert, Box, Grid, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Grid minH="100vh" templateRows="auto 1fr auto" bg="#050505">
        <NavBar />
        <Outlet />
        <Alert bg={'#050505'} variant='subtle'>
          <Text as="b" fontSize={'sm'}>Built with ❤️ by <a style={{textDecoration: 'underline'}} href={'https://twitter.com/cesarhuret'}>@cesarhuret</a> and <a style={{textDecoration: 'underline'}} href={'https://twitter.com/leo_ryuta'}>@leo_ryuta</a></Text>
        </Alert>
      </Grid>
    </>
  );
}
