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
  InputGroup,
  InputLeftAddon,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  ModalBody,
  Stack,
  Image,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Logo } from "../Logo";
import { useEffect, useState } from "react";
import { ProviderType } from "@lit-protocol/constants";
import { ArrowRightIcon } from "../icons";
import { execWithLit, getSafeAddress } from "../hooks";
import config from "../config.json";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { utils } from "ethers";
import ERC20ABI from "../utils/ERC20.json";
import tokens from "../utils/tokens.json";
import { BsArrowRight } from "react-icons/bs";

interface TransferData {
  to: string;
  amount: number;
}

export const App = () => {
  const loaderData = useRouteLoaderData("root") as {
    safe: string;
    email: string;
    litNodeClient: any;
    sessionKey: any;
    authMethod: any;
  };

  const navigate = useNavigate();

  const [transferData, setTransferData] = useState<TransferData>({
    to: "",
    amount: 0,
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalIsLoading, setModalIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [tokenChoice, setTokenChoice] = useState<any>(tokens.tokens[0]);

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

  const submitTx = async () => {
    setModalIsLoading(true);

    const toSafeAddress = await getSafeAddress(transferData.to);

    const iface = new utils.Interface(ERC20ABI);

    const encodedData = iface.encodeFunctionData("transfer", [
      toSafeAddress,
      utils.parseEther(transferData.amount.toString()),
    ]);

    const testTx = await execWithLit(config.module, config.factory, {
      from: loaderData?.safe,
      to: "", // erc20 contract address goes here
      value: utils.parseEther("0.0001"),
      data: "0x",
    });

    console.log(testTx);

    setTimeout(() => {
      setModalIsLoading(false);
      onClose();
      successToast(
        "Transaction Submitted",
        `${transferData.amount} ${tokenChoice.symbol} sent to ${transferData.to}`
      );
    }, 2000);
  };

  console.log(loaderData);
  useEffect(() => {
    // setEmail("leonardo.ryuta05@gmail.com");
    console.log(loaderData);
  }, [loaderData]);

  const searchAccount = () => {
    if (search.endsWith("@gmail.com")) {
      navigate("/" + search);
    } else {
      navigate("/" + search + "@gmail.com");
    }
  };

  return (
    <>
      <Box p={3} textAlign="center" fontSize="xl">
        {loaderData?.email ? (
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
              boxShadow="16px 16px 35px #18fc8455, -16px -16px 35px #36efc055"
            >
              <Heading size="lg">Send Funds</Heading>
              <VStack w="100%" alignItems="start" gap={4}>
                <FormControl w="250px">
                  <FormLabel>Email</FormLabel>
                  <Input
                    maxW="250px"
                    type="email"
                    variant="outline"
                    placeholder="Type receiver email"
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
                  <InputGroup variant="unstyled">
                    <InputLeftAddon bg="#050505" p={0}>
                      <Select
                        placeholder=""
                        border=""
                        colorScheme="black"
                        w="100px"
                        bg="#050505"
                        onChange={(e) => {
                          setTokenChoice(JSON.parse(e.target.value));
                        }}
                      >
                        {tokens.tokens.map((token: any, index: number) => (
                          <option key={index} value={JSON.stringify(token)}>
                            {token.symbol}
                          </option>
                        ))}
                      </Select>
                    </InputLeftAddon>
                    <NumberInput
                      w="100%"
                      min={0}
                      variant="outline"
                      placeholder="Amount to be sent"
                      onChange={(e) => {
                        setTransferData({
                          ...transferData,
                          amount: parseInt(e),
                        });
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                </FormControl>
                <Button
                  w="full"
                  mt={5}
                  borderWidth={1}
                  bg={`linear-gradient(#050505, #050505) padding-box, 
                    linear-gradient(135deg, #000000, #36efc055) border-box`}
                  onClick={onOpen}
                >
                  Send
                </Button>
              </VStack>
            </VStack>
          </VStack>
        ) : (
          <VStack
            spacing={8}
            h="100%"
            alignItems="center"
            justifyContent="center"
          >
            <HStack spacing={5}>
              <Image src="/logo.png" w="50px" borderRadius={7} />
              <Text as="b">Welcome to SafeMail</Text>
            </HStack>
            <HStack>
              <Input
                placeholder="Search for a Google Account..."
                onChange={(e: any) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    searchAccount();
                  }
                }}
              />
              <IconButton
                aria-label="search"
                icon={<ArrowRightIcon size={20} />}
                onClick={searchAccount}
              />
            </HStack>
          </VStack>
        )}
      </Box>

      <Modal size="lg" isOpen={isOpen} isCentered={true} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent mx={4} p={10}>
          <ModalCloseButton />
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalBody>
            {modalIsLoading ? (
              <Stack
                w="full"
                h="25vh"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner size="xl" />
              </Stack>
            ) : (
              <>
                <HStack
                  alignItems="center"
                  justifyContent="space-evenly"
                  h="25vh"
                >
                  <VStack>
                    <Image
                      src={`https://noun-api.com/beta/pfp?name=${loaderData?.email}`}
                      borderRadius="10px"
                      w={20}
                    />
                    <Tooltip>
                      <Text>
                        {loaderData?.email?.replace("@gmail.com", "")}
                      </Text>
                    </Tooltip>
                  </VStack>
                  <VStack>
                    <ArrowRightIcon size={20} />
                    <HStack>
                      <Text>{transferData.amount}</Text>
                    </HStack>
                  </VStack>
                  <VStack>
                    <Image
                      src={`https://noun-api.com/beta/pfp?name=${transferData.to}`}
                      borderRadius="10px"
                      w={20}
                    />
                    <Tooltip>
                      <Text>{transferData.to.replace("@gmail.com", "")}</Text>
                    </Tooltip>
                  </VStack>
                </HStack>
                <Button
                  w="full"
                  justifySelf="center"
                  borderWidth={1}
                  onClick={() => {
                    successToast("Success", "Your transaction was successful");
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
