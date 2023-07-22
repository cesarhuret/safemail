import {
  Container,
  Flex,
  Box,
  Text,
  HStack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  VStack,
  Image,
  Input,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { providers, utils } from "ethers";
import { useLoaderData, useNavigate } from "react-router-dom";
import { shortenHash } from "../hooks";
import { ProviderType } from "@lit-protocol/constants";
import { GoogleIcon, ArrowRightIcon } from "../icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import chainsList from "../utils/chains.json";

export function NavBar() {
  const navigate = useNavigate();
  const loader = useLoaderData() as { safe: string; email: string };
  const [walletAddress, setWalletAddress] = useState<string>(loader?.safe);
  const [email, setEmail] = useState<string>(loader?.email || "");
  const [balance, setBalance] = useState<string>("0");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState<string>("");
  const [chain, setChain] = useState<any>(JSON.parse(localStorage.getItem("chain") as string) || chainsList.chains[0]);

  const provider = new providers.JsonRpcProvider(
    chain.rpc_endpoint || chainsList.chains[0].rpc_endpoint
  );

  const getBalance = async () => {
    if (!walletAddress) return;
    await provider.getBalance(walletAddress).then((balance) => {
      setBalance(parseFloat(utils.formatEther(balance)).toFixed(2));
    });
  };

  useEffect(() => {
    getBalance();
  }, [walletAddress]);

  const signIn = async () => {
    const client = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: "ec8d2250312234b05e2746aa7e2ebd9d",
      },
    });

    client.initProvider(ProviderType.Google, {
      redirectUri: "https://safemail-beta.vercel.app",
      // redirectUri: "http://localhost:3000",
    });

    const litNodeClient = new LitNodeClient({
      litNetwork: "serrano",
      debug: false,
    });
    await litNodeClient.connect();

    const litProvider: any = client.getProvider(ProviderType.Google);

    if (litProvider != null) await litProvider.signIn();
  };

  const SignInModal = () => (
    <Modal isCentered={true} size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody mx={0} my={20}>
          <VStack gap={5}>
            <Button
              variant="outline"
              w="200px"
              alignSelf="center"
              onClick={signIn}
              leftIcon={<GoogleIcon size={20} />}
            >
              <Text>Sign in with Google</Text>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  const searchAccount = () => {
    if (search.endsWith("@gmail.com")) {
      navigate("/" + search);
    } else {
      navigate("/" + search + "@gmail.com");
    }
  };

  return (
    <HStack borderRadius="md" p={2} w="full" justifyContent="space-between">
      <SignInModal />
      <HStack>
        <HStack as={"button"} onClick={() => navigate("/")}>
          <Image src="/logo.png" w="10" borderRadius={7} />
          <Text fontSize="xl" color="#12FF80" fontWeight="bold">
            SafeMail
          </Text>
        </HStack>
        {email !== "" && walletAddress ? (
          <HStack ml={4}>
            <Input
              placeholder={"Search for a Google Account..."}
              onChange={(e: any) => setSearch(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  searchAccount();
                  console.log();
                }
              }}
            />
            <IconButton
              aria-label="navSearch"
              icon={<ArrowRightIcon size={20} />}
              onClick={searchAccount}
            />
            {search ? (
              <Avatar
                size="sm"
                src={ search.endsWith("@gmail.com") ? `https://noun-api.com/beta/pfp?name=${search}` : `https://noun-api.com/beta/pfp?name=${search}@gmail.com`}              />
            ) : (
              <></>
            )}
          </HStack>
        ) : (
          <></>
        )}
      </HStack>
      <HStack>
        <Menu>
          <MenuButton border="1px solid #393838" p={2} borderRadius="10px">
            <Avatar size="xs" src={chain.image_url} name={chain.name} mr={4}/>
            {chain.name}
            <ChevronDownIcon />
          </MenuButton>
          <MenuList bg="#050505" minW="min">
            {chainsList.chains.map((chain: any, index: number) => (
              <MenuItem key={index} bg="#050505" _hover={{bg:"gray.800"}} onClick={()=>{
                setChain(chainsList.chains[index])
                localStorage.setItem("chain", JSON.stringify(chainsList.chains[index]))
              }}>
                <Avatar size="xs" src={chain.image_url} name={chain.name} mr={4}/>
                {chain.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Box>
          {email !== "" ? (
            <Menu>
              <MenuButton as={Button}>
                <Flex gap={2} alignItems="center">
                  <Image
                    src={`https://noun-api.com/beta/pfp?name=${email}`}
                    borderRadius="10px"
                    w={5}
                  />
                  <Text>{email?.replace("@gmail.com", "")}</Text>
                  <Text p="7px" borderRadius={6} borderWidth={1}>
                    {balance} ETH
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList bg={"#050505"}>
                <MenuItem
                  _hover={{ bg: "gray.800" }}
                  _focus={{ bg: "" }}
                  bg={"#050505"}
                  onClick={() => {
                    navigate("/" + loader?.email);
                  }}
                >
                  {email}
                </MenuItem>
                <MenuItem
                  _hover={{ bg: "gray.800" }}
                  _focus={{ bg: "" }}
                  bg={"#050505"}
                >
                  {shortenHash(walletAddress)}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  _hover={{ bg: "gray.800" }}
                  _focus={{ bg: "" }}
                  bg={"#050505"}
                  onClick={() => {
                    localStorage.removeItem("google");
                    localStorage.removeItem("authMethod");
                    navigate(0);
                  }}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : walletAddress ? (
            <Menu>
              <MenuButton>
                {shortenHash(walletAddress)}
                <ChevronDownIcon />
              </MenuButton>
              <MenuList bg={"#050505"}>
                <MenuItem bg={"#050505"}>{shortenHash(walletAddress)}</MenuItem>
                <MenuDivider />
                <MenuItem bg={"#050505"}>Sign in with Google</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button variant="outline" alignSelf="center" onClick={onOpen}>
              <Text>Sign in</Text>
            </Button>
          )}
        </Box>
      </HStack>
    </HStack>
  );
}
