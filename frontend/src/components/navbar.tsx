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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { providers, utils } from "ethers";
import { useNavigate } from "react-router-dom";
import { shortenHash } from "../hooks";
import { ProviderType } from "@lit-protocol/constants";
import { GoogleIcon } from "../icons";

export function NavBar() {
  const navigate = useNavigate();
  const mockData = {
    // email: "leonardo.ryuta05@gmail.com",
    // wallet: "0x2346ac3Bc15656D4dE1da99384B5498A75f128a2",
    email: "",
    wallet: "",
  };
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    setWalletAddress(mockData.wallet);
    setEmail(mockData.email);
    getBalance();
  }, [walletAddress]);

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
                leftIcon={<GoogleIcon size={20}/>}
            >
              <Text>Sign in with google</Text>
            </Button>
            <Text> or </Text>
            <Button
                variant="outline"
                w="200px"
                alignSelf="center"
            >
              <Image src="/metamask.svg" h="5" pr={2}/>
              <Text>Sign in with Metamask</Text>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <HStack borderRadius="md" p={2} w="full" justifyContent="space-between">
      <SignInModal />
      <HStack as={"button"} onClick={() => navigate("/")}>
        <Text>SafeMail</Text>
      </HStack>
      <HStack>
        <Text p="7px" borderRadius={6} borderWidth={1}>
            {balance} ETH
        </Text>
        <Box>
          {email !== "" ? (
            <Menu>
              <MenuButton as={Button}>
                <Text>{email.replace("@gmail.com", "")}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem>{email}</MenuItem>
                <MenuItem>{shortenHash(walletAddress)}</MenuItem>
                <MenuDivider />
                <MenuItem>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : walletAddress ? (
            <Menu>
              <MenuButton>{shortenHash(walletAddress)}</MenuButton>
              <MenuList>
                <MenuItem>{shortenHash(walletAddress)}</MenuItem>
                <MenuDivider />
                <MenuItem>Sign in with Google</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button onClick={onOpen}>
              <Text>Sign in</Text>
            </Button>
          )}
        </Box>
      </HStack>
    </HStack>
  );
}
