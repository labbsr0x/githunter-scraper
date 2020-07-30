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


const main = async () => {
  try {
    await connectDB();
    const theProvider = require(`./${provider}/startup`);
    theProvider.run();
  } catch (error) {
    console.log(error);
  }
  
  
}


const connectDB = () => {
  const database = require('./database');
  return database.connectDB();
} 

main();