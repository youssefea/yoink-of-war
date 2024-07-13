export const URL = process.env.ENVIRONMENT === 'local' ?
  process.env.LOCALHOST : process.env.PROD_URL

  export const DEBUGGER_HUB_URL =
  process.env.ENVIRONMENT === 'local' ?
    process.env.LOCAL_DEBUGGER_HUB_URL : process.env.PROD_HUB_URL

  export const gameStep=100;

  export const cfaForwarderAddress="0xcfA132E353cB4E398080B9700609bb008eceB125";
  export const tokenAddress="0x15DbD2d5f389eC68A3D80E4FBa94dFE4fe1dAB7f";