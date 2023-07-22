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
import { getSafeAddress, shortenHash } from "../hooks";
import {
  MailIcon,
  ClipboardCheckIcon,
  ClipboardAddIcon,
  ExtrenalLinkIcon,
} from "../icons";

init(config.airStack.apiKey);

export const Dashboard = () => {
  const [email, setEmail] = useState<string>(useParams().email || "");
  const [balance, setBalance] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [nftList, setNftList] = useState<any[]>([]);
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [internalTransactions, setInternalTransactions]: any = useState(null);
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/75qiyn1_EpxCn93X5tD7yEtmcXUM_Udw"
  );

  const query = `
  query tokens($address: Identity!) {
    erc20: TokenBalances(
      input: {filter: {owner: {_in: [$address]}, tokenType: {_in: [ERC20]}}, limit: 10, blockchain: ethereum}
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
  }`;

  const variables = {
    address: walletAddress,
  };

  const { data, loading, error } = useQuery(query, variables, { cache: false });

  const getInternalTransactions = async () => {
    if (!walletAddress) return;
    console.log(walletAddress)
    const response = await fetch(
      `https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${config.etherScan.apiKey}`
    );
    const data = await response.json();
    console.log(data.result);
    setInternalTransactions(data.result);
  };

  const getBalance = async () => {
    if (!walletAddress) return;
    await provider.getBalance(walletAddress).then((balance) => {
      setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(2));
    });
  };

  useEffect(() => {
    if (!loading && data) {
      setTokenList(data.erc20.data);
      setNftList(data.erc721.data);
      console.log(data);
      getInternalTransactions();
    }
  }, [loading]);

  useEffect(() => {
    (async () => {
      setWalletAddress(await getSafeAddress(email));
    })();
  }, []);

  console.log(internalTransactions)

  useEffect(() => {
    getBalance();
  }, [walletAddress]);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
  };

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
          <Avatar
            size="2xl"
            name={email}
            src={`https://noun-api.com/beta/pfp?name=${email}`}
          />
          <Container
            bg="#050505"
            borderRadius={15}
            p={4}
            boxShadow="-10px -10px 10px 0px #36efc055, 10px 10px 10px 0px #18fc8455"
          >
            <VStack gap={4}>
              <Flex alignItems="center" gap={2}>
                <MailIcon size={20} />
                <Text as="b">{email}</Text>
              </Flex>
              <VStack>
                <VStack mb={6} gap={0}>
                  <Text color="gray.600">Total Balance:</Text>
                  <Text>{balance} ETH</Text>
                </VStack>
                <Button onClick={copyAddress} gap={2}>
                  {shortenHash(walletAddress)}
                  {isCopied ? (
                    <ClipboardCheckIcon size={20} />
                  ) : (
                    <ClipboardAddIcon size={20} />
                  )}
                </Button>
              </VStack>
            </VStack>
          </Container>
          <Container
            bg="#050505"
            p={4}
            borderRadius={15}
            boxShadow="-10px -10px 10px 0px #36efc055, 10px 10px 10px 0px #18fc8455"
          >
            <Tabs>
              <TabList>
                <Tab w="50%" color="#95ff91cc">
                  Tokens
                </Tab>
                <Tab w="50%" color="#95ff91cc">
                  NFTs
                </Tab>
                <Tab w="50%" color="#95ff91cc">
                  Transactions
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Skeleton isLoaded={!loading}>
                    {tokenList ? (
                      <VStack>
                        {tokenList.map((token, index) => (
                          <Flex
                            key={index}
                            p={4}
                            borderRadius="md"
                            bg="black"
                            justifyContent="space-between"
                            w="100%"
                          >
                            <Text>{token.token.symbol}</Text>
                            <Text>{token.formattedAmount.toFixed(2)}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    ) : (
                      <Text>No tokens found</Text>
                    )}
                  </Skeleton>
                  <Skeleton isLoaded={!loading} h="20px" my={2} />
                  <Skeleton isLoaded={!loading} h="20px" my={2} />
                </TabPanel>
                <TabPanel>
                  <Skeleton isLoaded={!loading}>
                    {nftList ? (
                      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                        {nftList.map((nft: any) => (
                          <Container
                            key={nft.tokenId}
                            p={4}
                            borderRadius="md"
                            bg="black"
                          >
                            <Image
                              src={nft.tokenNfts.contentValue.image.original}
                            />
                            <Text>{nft.tokenNfts.metaData.name}</Text>
                          </Container>
                        ))}
                      </Grid>
                    ) : (
                      <Text>No NFTs Found</Text>
                    )}
                  </Skeleton>
                  <Skeleton isLoaded={!loading} h="20px" my={2} />
                  <Skeleton isLoaded={!loading} h="20px" my={2} />
                </TabPanel>
                <TabPanel>
                  <Skeleton isLoaded={!loading}>
                    {internalTransactions ? (
                      <VStack>
                        {internalTransactions.map(
                          (internalTransaction: any, index: number) => (
                            <Flex
                              key={index}
                              p={2}
                              borderRadius="md"
                              bg="black"
                              justifyContent="space-between"
                              alignItems="center"
                              w="100%"
                              gap={4}
                            >
                              <Text>
                                From: {shortenHash(internalTransaction.from)}
                              </Text>
                              <Text>
                                To: {shortenHash(internalTransaction.to)}
                              </Text>
                              <Text>
                                Value:{" "}
                                {parseFloat(
                                  ethers.utils.formatEther(
                                    internalTransaction.value
                                  )
                                ).toFixed(2)}
                              </Text>
                              <Link
                                href={`https://goerli.etherscan.io//tx/${internalTransaction.hash}`}
                                isExternal
                              >
                                <Button>
                                  <ExtrenalLinkIcon size={15} />
                                </Button>
                              </Link>
                            </Flex>
                          )
                        )}
                      </VStack>
                    ) : (
                      <Text>No transactions found</Text>
                    )}
                  </Skeleton>
                  <Skeleton isLoaded={!loading} h="20px" my={2} />
                  <Skeleton isLoaded={!loading} h="20px" my={2} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </>
      )}
    </Box>
  );
};
