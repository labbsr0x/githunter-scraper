const path = require('path');
const fs = require('fs');
const server = require('./server/server');
const Flags = require('./flags/Flags');
const env = require('./env');
const database = require('./database');
const controller = require('./controller/controller');

const getScraperPoints = () => {
  const scraperDirectory = './controller/scraper';
  return fs
    .readdirSync(scraperDirectory)
    .filter(file =>
      fs.statSync(path.join(scraperDirectory, file)).isDirectory(),
    );
};

const knownScraperPoint = getScraperPoints();

const optionsFlag = {
  requiredFlags: ['scraperPoint'],
};

const flagsObj = new Flags(process.argv, optionsFlag);
const flags = flagsObj.parse();
env.flags = flags;

if (flags.server) {
  server();
}

if (!flagsObj.isValid(flags)) {
  console.log(`Required fields: ${optionsFlag.requiredFlags.join(' | ')}`);
  console.log('\tUsage: ');
  console.log('\t\tnode main.js --scraperPoint <scraperPoint>');
  console.log(`\t\t<scraperPoint>: ${knownScraperPoint.join(' | ')}`);
  console.log('\tExample: ');
  console.log('\t\tnode main.js --provider github --scraperPoint trending');

  process.exit(0);
}

if (!knownScraperPoint.includes(flags.scraperPoint)) {
  console.log(`Unknown scraperPoint: ${flags.scraperPoint}`);
  console.log(`\tKnowns scraperPoint: ${knownScraperPoint.join(' | ')}`);

  process.exit(0);
}

const scraper = async () => {
  try {
    await database.connectDB();
    controller.run();
  } catch (error) {
    console.log(error);
  }
};

scraper();
