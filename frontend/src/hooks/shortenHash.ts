export const shortenHash = (hash: string) => {
    return hash?.slice(0, 6) + "..." + hash?.slice(hash?.length - 4);
};