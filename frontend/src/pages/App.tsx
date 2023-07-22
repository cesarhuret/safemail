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
  Flex,
  HStack,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Logo } from "../Logo";
import { useEffect, useState } from "react";
import { ProviderType } from "@lit-protocol/constants";

interface TransferData {
  to: string;
  amount: number;
}

export const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [transferData, setTransferData] = useState<TransferData>({
    to: "",
    amount: 0,
  });
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

  const errorToast = (Title: string, Desc: string) => {
    toast({
      title: Title,
      description: Desc,
      status: "error",
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
      redirectUri: "http://localhost:3000/ok",
    });

    const litNodeClient = new LitNodeClient({
      litNetwork: "serrano",
      debug: false,
    });
    await litNodeClient.connect();

    const litProvider: any = client.getProvider(ProviderType.Google);

    if (litProvider != null) await litProvider.signIn();
  };

  useEffect(() => {
    setEmail("leonardo.ryuta05@gmail.com");
  });

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
          <Spinner size="xl" />
        </Container>
      ) : (
        <Box p={3} textAlign="center" fontSize="xl">
          {email !== "" ? (
            <VStack
              spacing={8}
              h="100%"
              alignItems="center"
              justifyContent="center"
            >
              <VStack
                gap={6}
                px={10}
                pt={16}
                pb={8}
                minW="10%"
                alignItems="flex-start"
                borderRadius={15}
                bg="#050505"
              >
                <Heading size="lg"> Send Funds </Heading>
                <VStack w="100%" alignItems="start" gap={4}>
                  <FormControl w="250px">
                    <FormLabel>Email</FormLabel>
                    <Input
                      maxW="250px"
                      type="email"
                      variant="outline"
                      onChange={(e) => {
                        setTransferData({
                          ...transferData,
                          to: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl w="250px">
                    <FormLabel>Amount</FormLabel>
                    <Input type="number" placeholder="Amount" />
                  </FormControl>
                  <Button>Send</Button>
                  {/* <Button
                  onClick={signIn}
                >Sign In</Button> */}
                </VStack>
              </VStack>
            </VStack>
          ) : (
            <VStack>
              <HStack>
                <Text>Welcome to SafeMail</Text>
              </HStack>
            </VStack>
          )}
        </Box>
      )}
    </>
  );
};
