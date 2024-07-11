const answers=process.env.ANSWERS?.split(",");
export const questions = [
    {
        question: "Which one of these is a famous $DEGEN community member?",
        options: ["Wake", "Bake", "Fake", "Stake"],
        image: "https://i.imgur.com/RWbKTSN.png",
        answer: answers?Number(answers[0]):undefined,
    },
    {
        question: "What is the name of the emoji of $DEGEN?",
        options: ["🧢", "👒", "🎓","🎩"],
        image: "https://i.imgur.com/9BQa6Eo.png",
        answer: answers?Number(answers[1]):undefined,
    },
    {
        question: "What token do you subscribe with on AlfaFrens?",
        options: ["ALFA", "DEGEN", "YOINK","BODEN"],
        image: "https://i.imgur.com/Gke7t2K.png",
        answer: answers?Number(answers[2]):undefined,
    },
    {
        question: "What's the reward token of AlfaFrens?",
        options: ["DEGEN", "WIF", "ETH","ALFA"],
        image: "https://i.imgur.com/BWoGEVH.png",
        answer: answers?Number(answers[3]):undefined,
    },
    {
        question: "What token protocol powers AlfaFrens?",
        options: ["Uniswap", "Ethereum","Superfluid", "CumRocket"],
        image: "https://i.imgur.com/qof5D8g.png",
        answer: answers?Number(answers[4]):undefined,
    },
    {
        question: "What is the name of $DEGEN lead?",
        options: ["Jesse", "Jacek","Vijay", "Vitalik"],
        image: "https://i.imgur.com/1VKBQaJ.png",
        answer: answers?Number(answers[5]):undefined,
    },
];
