export const URL = process.env.ENVIRONMENT === 'local' ?
  process.env.LOCALHOST : process.env.PROD_URL

  export const DEBUGGER_HUB_URL =
  process.env.ENVIRONMENT === 'local' ?
    process.env.LOCAL_DEBUGGER_HUB_URL : process.env.PROD_HUB_URL

  export const gameStep=100000000000;

  export const cfaForwarderAddress="0xcfA132E353cB4E398080B9700609bb008eceB125";
  export const tokenAddress="0x9CaCD0108DED0041B7Ff6763769F2Ca68d2845Ae";