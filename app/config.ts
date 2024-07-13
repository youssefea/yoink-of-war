import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount, mnemonicToAccount } from 'viem/accounts'
import { base, polygonMumbai, optimismSepolia } from 'viem/chains'

export const walletClient = createWalletClient({
  chain: optimismSepolia,
  transport:  http(process.env.RPC_URL)
})

export const publicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(process.env.RPC_URL)
})

export const account = (index)=> mnemonicToAccount(
    process.env.MNEMONIC as string,
    {
      accountIndex: index
    }
  )

export const accountFromPrivateKey = privateKeyToAccount(`0x${process.env.PVT_KEY}`)