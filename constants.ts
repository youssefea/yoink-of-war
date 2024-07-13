export const URL = process.env.ENVIRONMENT === 'local' ?
  process.env.LOCALHOST : process.env.PROD_URL

  export const DEBUGGER_HUB_URL =
  process.env.ENVIRONMENT === 'local' ?
    process.env.LOCAL_DEBUGGER_HUB_URL : process.env.PROD_HUB_URL

  export const gameStep=100000000000;

  export const cfaForwarderAddress="0xcfA132E353cB4E398080B9700609bb008eceB125";
  export const tokenAddress="0xD6FAF98BeFA647403cc56bDB598690660D5257d2";