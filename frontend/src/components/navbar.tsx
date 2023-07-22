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

export function NavBar() {
  const navigate = useNavigate();
  const loader = useLoaderData() as { safe: string; email: string };
  const [walletAddress, setWalletAddress] = useState<string>(loader?.safe);
  const [email, setEmail] = useState<string>(loader?.email || "");
  const [balance, setBalance] = useState<string>("0");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState<string>("");

  const provider = new providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw"
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
      redirectUri: "http://localhost:3000",
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
    <Modal isCentered={true} size="xs" isOpen={isOpen} onClose={onClose}>
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
            <Text> or </Text>
            <Button variant="outline" w="200px" alignSelf="center">
              <Image src="/metamask.svg" h="5" pr={2} />
              <Text>Connect Metamask</Text>
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
                  console.log()
                }
              }}
            />
            <IconButton
              aria-label="navSearch"
              icon={<ArrowRightIcon size={20} />}
              onClick={searchAccount}
            />
            {
              search ? (
                <Avatar
                  size="sm"
                  src={`https://noun-api.com/beta/pfp?name=${search}@gmail.com`}
                />
              ) : (
                <></>
              )
            }
          </HStack>
        ) : (
          <></>
        )}
      </HStack>
      <HStack>
        <Text p="7px" borderRadius={6} borderWidth={1}>
          {balance} ETH
        </Text>
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
                </Flex>
              </MenuButton>
              <MenuList bg={"#050505"}>
                <MenuItem
                  onClick={() => {
                    navigate("/" + loader?.email);
                  }}
                >
                  {email}
                </MenuItem>
                <MenuItem>{shortenHash(walletAddress)}</MenuItem>
                <MenuDivider />
                <MenuItem
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
