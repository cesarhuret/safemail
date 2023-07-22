import { utils } from 'ethers';
import { executeABI } from '../abi/execute';

export const getSafeTransaction = async ({owner, to, value, data}: any) => {
    const signatures = utils.hexlify(utils.zeroPad(owner, 32)) + utils.hexlify(utils.zeroPad("0x01", 32)).replace("0x", "00")
          
    const iface = new utils.Interface([executeABI])

    const encodedData = iface.encodeFunctionData('execTransaction', [
        to,
        value,
        data,
        0,
        utils.parseUnits("0", "gwei"),
        utils.parseUnits("0", "gwei"),
        utils.parseUnits("0", "gwei"),
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        signatures
      ]
    )

    return { data: encodedData };
}