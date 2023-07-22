import { shortenHash } from "../hooks"
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

export function NavBar() {
    const mockData = { email: "leonardo.ryuta05@gmail.com", wallet: "0x2346ac3Bc15656D4dE1da99384B5498A75f128a2"}
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const provider = new providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw");

    const getBalance = async () => {
        if (!walletAddress) return;
        await provider.getBalance(walletAddress).then((balance) => {
            setBalance(parseFloat(utils.formatEther(balance)).toFixed(2));
        });
    }

    useEffect(() => {
        setWalletAddress(mockData.wallet);
        getBalance();
    }, [walletAddress])

    const SignInModal = () => (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton/>
                <ModalBody>
                    <VStack>
                        <Button>
                            <Text>Sign in with google</Text>
                        </Button>
                        <Text> or </Text>
                        <Button>
                            <Text>Sign in with Metamask</Text>
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

    return (
        <HStack
            borderRadius="md"
            p={2}
            w="full"
            justifyContent="space-between"
        >
            <SignInModal/>
            <HStack>
                <Text>
                    SafeMail
                </Text>
            </HStack>
            <HStack>
                <Text>
                    {shortenHash(walletAddress)} - {balance} ETH
                </Text>

                <Button onClick={onOpen}>
                    <Text>Sign in</Text>
                </Button>
            </HStack>
        </HStack>
    )
}