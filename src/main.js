const pupeeteer = require("puppeteer");
const apiKey = "533d87fa746448c15d9e3800f4a0cb4e";
const secretKey = "0f488d637befba6499ef04423dcf2872";
const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
  apiKey: apiKey,
  apiSecret: secretKey,
});
const axios = require("axios");
const fetchInfoFromPage = async () => {
  const browser = await pupeeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--start-maximized", "--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.tarot.to/lending-pool/250/0xd0ad79e5acc51afdf4693d8304f40a1a221abe9e"
  );
  // wait for network
  await page.waitForSelector("button");
  await page.click("button");
  // check if  "#root > div > main > div > div:nth-child(1) > div > div.grid.grid-cols-4.gap-x-4.gap-y-3.mt-5 > div:nth-child(3) > span.self-center.justify-self-end" available
  await page.waitForSelector(
    "#root > div > main > div > div:nth-child(1) > div > div.grid.grid-cols-4.gap-x-4.gap-y-3.mt-5 > div:nth-child(3) > span.self-center.justify-self-start"
  );

  const innerText = await page.evaluate(() => {
    return document.querySelector(
      "#root > div > main > div > div:nth-child(1) > div > div.grid.grid-cols-4.gap-x-4.gap-y-3.mt-5 > div:nth-child(3) > span.self-center.justify-self-start"
    ).innerText;
  });
  console.log(`Utilization :	${innerText}`);

  await browser.close();
  return {
    utilization: innerText,
    value: parseFloat(innerText.split("%")[0]),
  };
};

const sendEmail = async (utilization) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "hussain2000.rizvi@gmail.com",
          Name: "Tarot",
        },
        To: [
          {
            Email: "srizvi.bscs18seecs@seecs.edu.pk",
            Name: "Hussain Rizvi",
          },
          {
            Email: "hamzajafar110@gmail.com",
            Name: "Hamza Jafar",
          },
        ],
        Subject: "Utilization",
        HTMLPart: `<h1>Utilization is <b>${utilization}</b></h1> <br />`,
      },
    ],
  });

  request
    .then((result) => {
      console.log("Email sent Successfully");
    })
    .catch((err) => {});
};

// (async () => {
//   const startTime = Date.now();
//   const { utilization } = await fetchInfoFromPage();
//   // utlizaztion is a string like "0.00%"
//   // parse string to float
//   utilization.split("%")[0]; // 0.00
//   const utilizationFloat = parseFloat(utilization.split("%")[0]);
//   if (utilizationFloat > 90) sendEmail(utilization);

//   const endTime = Date.now();
//   const timeTaken = (endTime - startTime) / 1000;
//   console.log(`Time taken : ${timeTaken} seconds`);
// })();

module.exports = {
  fetchInfoFromPage,
  sendEmail,
};
