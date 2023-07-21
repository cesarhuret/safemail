import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Container,
  Flex
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { ProviderType } from "@lit-protocol/constants";

export const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const toast = useToast();

  const successToast = (Title: string, Desc: string) => {
    toast({
      title: Title,
      description: Desc,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const signIn = async () => {

    const client = new LitAuthClient({
        litRelayConfig: {
          relayApiKey: "ec8d2250312234b05e2746aa7e2ebd9d",
        },
      });
  
      client.initProvider(ProviderType.Google, {
        redirectUri: 'http://localhost:3000/ok',
      });
  
      const litNodeClient = new LitNodeClient({
        litNetwork: "serrano",
        debug: false,
      });
      await litNodeClient.connect();
  
      const litProvider: any = client.getProvider(ProviderType.Google);
  
      if (litProvider != null) await litProvider.signIn();

  }

  const errorToast = (Title: string, Desc: string) => {
    toast({
      title: Title,
      description: Desc,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      {isLoading ? (
        <Container
          as={Flex}
          h="100%"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl"/>
        </Container>
      ) : (
        <Box w="100%" h="100%">
          <VStack>
            <Heading> Send Funds </Heading>
            <VStack>
              {/* <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Email" />
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input type="number" placeholder="Amount" />
              </FormControl> */}
              <Button
                onClick={signIn}
              >Sign In</Button>
            </VStack>
          </VStack>
        </Box>
      )}
    </>
  );
};
