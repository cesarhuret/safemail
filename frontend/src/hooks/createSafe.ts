export const createSafe = async ({ owner, wallet, salt }: any) => {
  const signedTransactionRequest  = await wallet.signTransaction({
    to: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    data: `0x1688f0b90000000000000000000000003e5c63644e683549055b9be8653de26e0b4cd36e0000000000000000000000000000000000000000000000000000000000000060${salt.slice(
      2
    )}0000000000000000000000000000000000000000000000000000000000000164b63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000${owner.slice(
      2
    )}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`,
  });

  const createSafe = await wallet.sendTransaction(signedTransactionRequest);

  console.log(await createSafe.wait());

  const safeAddress = (await createSafe.wait()).logs[0].address;

  return safeAddress;
};