const path = require('path');
const fs = require('fs');
const Flags = require('./flags/Flags');
const env = require('./env');
const database = require('./database');
const controller = require('./controller');
const server = require('./server/server');
const conductorClient = require('./conductor/client');

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

const scraperLocal = async () => {
  if (!flagsObj.isValid(flags)) {
    console.log(`Required flags are necessary to run locally`);
    console.log(`Required fields: ${optionsFlag.requiredFlags.join(' | ')}`);
    console.log('\tUsage: ');
    console.log('\t\tnode main.js --scraperPoint <scraperPoint>');
    console.log(`\t\t<scraperPoint>: ${knownScraperPoint.join(' | ')}`);
    console.log('\tExample: ');
    console.log('\t\tnode main.js --provider github --scraperPoint trending');

    return false;
  }

  if (!knownScraperPoint.includes(flags.scraperPoint)) {
    console.log(`Required flags are necessary to run locally`);
    console.log(`Unknown scraperPoint: ${flags.scraperPoint}`);
    console.log(`\tKnowns scraperPoint: ${knownScraperPoint.join(' | ')}`);

    return false;
  }

  try {
    controller.run(env.flags);
  } catch (error) {
    console.log(error);
  }
  return true;
};

const run = async () => {
  await database.connectDB();

  if (flags.server) {
    server();
  } else if (flags.conductor) {
    conductorClient();
  } else {
    scraperLocal();
  }
};

run();
