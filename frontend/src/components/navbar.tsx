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
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { providers, utils } from "ethers";
import { useLoaderData, useNavigate } from "react-router-dom";
import { shortenHash } from "../hooks";
import { ProviderType } from "@lit-protocol/constants";
import { GoogleIcon, ArrowRightIcon } from "../icons";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
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

  const { colorMode, toggleColorMode } = useColorMode()

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
      redirectUri: "https://useflame.xyz",
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
    <Modal isCentered={true} size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay 
        bg='blackAlpha.300'
        backdropFilter='blur(10px)'
      />
      <ModalContent
        border={'0'}
        bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}
      >
        <ModalBody bg={'transparent'} mx={0}>
            <Button
              p={0}
              m={0}
              w={'full'}
              variant="ghost"
              size={'lg'}
              alignSelf="center"
              onClick={signIn}
              _hover={{
                bg: colorMode == 'dark' ? "#050505" : '#f5f5f5'
              }}
              leftIcon={<GoogleIcon size={20} />}
            >
              <Text>Sign in with Google</Text>
            </Button>
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
          <Text fontSize="xl" color="#fe9800" fontWeight="bold">
            Flame Wallet
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
          <MenuList bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'} minW="min">
            {chainsList.chains.map((chain: any, index: number) => (
              <MenuItem key={index} bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'} _hover={{bg: colorMode == 'dark' ? "gray.800": 'gray.200'}}
              onClick={()=>{
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
              <MenuList bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}>
                <MenuItem
                  _hover={{bg: colorMode == 'dark' ? "gray.800": 'gray.200'}}
                  _focus={{ bg: "" }}
                  bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}
                  onClick={() => {
                    navigate("/" + loader?.email);
                  }}
                >
                  {email}
                </MenuItem>
                <MenuItem
                  _hover={{bg: colorMode == 'dark' ? "gray.800": 'gray.200'}}
                  _focus={{ bg: "" }}
                  bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}
                >
                  {shortenHash(walletAddress)}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  _hover={{bg: colorMode == 'dark' ? "gray.800": 'gray.200'}}
                  _focus={{ bg: "" }}
                  bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}
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
              <MenuList bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}>
                <MenuItem bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}>{shortenHash(walletAddress)}</MenuItem>
                <MenuDivider />
                <MenuItem bg={colorMode == 'dark' ? "#050505" : '#f5f5f5'}>Sign in with Google</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button variant="solid" bg={'#fe9800'} alignSelf="center" onClick={onOpen}>
              <Text>Sign in</Text>
            </Button>
          )}
        </Box>
        <IconButton
          aria-label="switcher"
          icon={colorMode == 'dark' ? <SunIcon/> : <MoonIcon/>}
          onClick={toggleColorMode}
        />
      </HStack>
    </HStack>
  );
}
