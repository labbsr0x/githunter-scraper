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

switch (provider) {
  case knownProviders[0]:
    require("./github/github.startup")();
    break;

  default:
    break;
}
