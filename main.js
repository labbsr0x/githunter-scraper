"use strict";

const knownProviders = ["github", "gitlab"];
let provider;

if (process.argv[2]) {
  provider = process.argv[2];
} else {
  console.log("Specify provider.");
  console.log("\tUsage: ");
  console.log("\t\tnode main.js <provider>");
  console.log(`\t\t<provider>: ${knownProviders.join(" | ")}`);
  console.log("\tExample: ");
  console.log("\t\tnode main.js github");
  return;
}

if (!knownProviders.includes(provider)){
  console.log(`Unknown Provider: ${provider}`);
  console.log(`\tKnowns providers: ${knownProviders.join(" | ")}`);
  return;
}

try {
  connectDB();
} catch (error) {
  console.log(error);
}

const theProvider = require(`./${provider}/startup`);
theProvider.run();

function connectDB() {
  const Database = require('./database')
  const db = new Database({config: 'mongodb://localhost:27017/githunter-crawler', logger: console });
  db.connect();
}