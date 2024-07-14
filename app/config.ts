import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount, mnemonicToAccount } from 'viem/accounts'
import { base, polygonMumbai, optimismSepolia, arbitrum} from 'viem/chains'

export const walletClient = createWalletClient({
  chain: arbitrum,
  transport:  http(process.env.RPC_URL)
})

export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.RPC_URL)
})

export const account = (index)=> mnemonicToAccount(
    process.env.MNEMONIC as string,
    {
      accountIndex: index
    }
  )

export const accountFromPrivateKey = privateKeyToAccount(`0x${process.env.PVT_KEY}`)