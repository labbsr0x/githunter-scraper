"use strict";

const server = require("./server/server")
const Flags = require('./flags/Flags');
const env = require("./env");

const knownProviders = ["github", "gitlab"];
const knownScraperPoint = ["trending"];

const optionsFlag = {
  requiredFlags: [
    "provider",
    "scraperPoint"
  ]
}

const flagsObj = new Flags(process.argv, optionsFlag);
const flags = flagsObj.parse();
env.flags = flags; 

if (flags.server){
  server();
  return;
}

if (!flagsObj.isValid(flags)) {
  console.log(`Required fields: ${optionsFlag.requiredFlags.join(" | ")}`);
  console.log("\tUsage: ");
  console.log("\t\tnode main.js  --provider <provider> --scraperPoint <scraperPoint>");
  console.log(`\t\t<provider>: ${knownProviders.join(" | ")}`);
  console.log(`\t\t<scraperPoint>: ${knownScraperPoint.join(" | ")}`);
  console.log("\tExample: ");
  console.log("\t\tnode main.js --provider github --scraperPoint trending");
  return;
}

if (!knownProviders.includes(flags.provider)){
  console.log(`Unknown Provider: ${flags.provider}`);
  console.log(`\tKnowns providers: ${knownProviders.join(" | ")}`);
  return;
}

if (!knownScraperPoint.includes(flags.scraperPoint)){
  console.log(`Unknown scraperPoint: ${flags.scraperPoint}`);
  console.log(`\tKnowns scraperPoint: ${knownScraperPoint.join(" | ")}`);
  return;
}

const scraper = async () => {
  try {
    await connectDB();
    const theProvider = require(`./${flags.provider}/startup`);
    theProvider.run(flags);
  } catch (error) {
    console.log(error);
  }
}

const connectDB = () => {
  const database = require('./database');
  return database.connectDB();
} 

scraper();
