import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  Container,
  Button,
  Grid,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Skeleton,
  Avatar,
  Link,
} from "@chakra-ui/react";
import { ethers } from "ethers";

export const Dashboard = () => {
  const mockData = {
    email: "leonardo.ryuta05@gmail.com",
    address: "0x2346ac3Bc15656D4dE1da99384B5498A75f128a2",
  };
  const [email, setEmail] = useState<string>(useParams().email || "");
  const [balance, setBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw"
  );

  const getBalance = async () => {
    await provider.getBalance(walletAddress).then((balance) => {
      setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(2));
    });
  };

  useEffect(() => {
    setEmail(mockData.email);
    setWalletAddress(mockData.address);
  }, [email]);

  useEffect(() => {
    getBalance();
  }, [walletAddress]);

  return (
    <Box
      maxW="100vw"
      minH="100%"
      as={Flex}
      justifyContent="center"
      alignItems="center"
      direction="column"
      gap={12}
      mt="5vh"
    >
      {email === "" ? (
        <Box>
          <Text>User could not be found</Text>
        </Box>
      ) : (
        <>
          <Container p={4} border="2px solid white">
            <VStack>
              <Flex>
                <Text as="b">{email}</Text>
              </Flex>
              <VStack>
                <VStack>
                  <Text>Total Balance:</Text>
                  <Text>{balance} ETH</Text>
                </VStack>
              </VStack>
            </VStack>
          </Container>
          <Container>
            <Tabs>
              <TabList>
                <Tab>Tokens</Tab>
                <Tab>NFTs</Tab>
                <Tab>Transactions</Tab>
              </TabList>
              <TabPanels>
                <TabPanel></TabPanel>
                <TabPanel>
                  <Skeleton isLoaded={!loading}></Skeleton>
                </TabPanel>
                <TabPanel>
                  <Flex direction="column" gap={4}>
                    <Box>
                      <Text as="b">Wallet Address:</Text>
                      <Text>{walletAddress}</Text>
                    </Box>
                    <Box>
                      <Text as="b">Wallet Balance:</Text>
                      <Text>{balance} ETH</Text>
                    </Box>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </>
      )}
    </Box>
  );
};
