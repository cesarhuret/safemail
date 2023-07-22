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
import { ethers, providers } from "ethers";
import { init, useQuery } from "@airstack/airstack-react";
import config from "../config.json";

init(config.airStack.apiKey);

export const Dashboard = () => {
  const mockData = {
    email: "leonardo.ryuta05@gmail.com",
    address: "0x2346ac3Bc15656D4dE1da99384B5498A75f128a2",
  };
  const [email, setEmail] = useState<string>(useParams().email || "");
  const [balance, setBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [nftList, setNftList] = useState<any[]>([]);
  const [tokenList, setTokenList] = useState<any[]>([]);
  const provider = new providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw"
  );

  const query = `
  query tokens($address: Identity!) {
    erc20: TokenBalances(
      input: {filter: {owner: {_in: [$address]}, tokenType: {_in: [ERC20]}}, limit: 10, blockchain: goerli}
    ) {
      data:TokenBalance {
        amount
        formattedAmount
        chainId
        id
        tokenAddress
        tokenId
        tokenType
        token {
          name
          symbol
        }
      }
    }
    erc721: TokenBalances(
      input: {filter: {owner: {_in: [$address]}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
    ) {
      data:TokenBalance {
        amount
        chainId
        id
        tokenAddress
        tokenId
        tokenType
        token {
          name
          symbol
        }
        tokenNfts {
          tokenId
          metaData {
            name
          }
          contentValue {
            image {
              medium
              extraSmall
              large
              original
              small
            }
          }
        }
      }
    }
    poap: TokenBalances(
      input: {filter: {owner: {_in: [$address]}, tokenAddress: {_eq: "0x22C1f6050E56d2876009903609a2cC3fEf83B415"}}, limit: 10, blockchain: ethereum}
    ) {
      data:TokenBalance {
        amount
        tokenAddress
        tokenId
        tokenType
        token {
          name
          symbol
        }
        tokenNfts {
          metaData {
            name
          }
          tokenURI
        }
      }
    }
  }`;

  const variables = {
    address: walletAddress,
  };

  const { data, loading, error } = useQuery(query, variables, {cache: false});

  const getBalance = async () => {
    await provider.getBalance(walletAddress).then((balance) => {
      setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(2));
    });
  };

  useEffect(() => {
    if (!loading && data) {
      setTokenList(data.erc20.data);
      setNftList(data.erc721.data);
      console.log(data)
    }
  }, [loading]);

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
                  <Skeleton isLoaded={!loading}>
                    {
                      tokenList ?
                      <VStack>
                        {
                          tokenList.map((token) => (
                            <Flex
                              key={token.tokenId}
                              p={4}
                              border="2px solid white"
                              borderRadius="md"
                              w="100%"
                            >
                              <Text>{token.token.symbol}</Text>
                              <Text>{token.formattedAmount.toFixed(2)}</Text>
                            </Flex>
                          ))
                        }
                      </VStack>
                      :
                      <Text>No tokens found</Text>
                    }
                  </Skeleton>
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
