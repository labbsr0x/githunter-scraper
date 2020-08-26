const Flags = require('../flags/Flags');
const env = require('../env');
const controller = require('../controller/controller');

const optionsFlag = {
  requiredFlags: ['scraperPoint'],
};

const controllerConductor = (req, res) => {
  const { args } = req.query;

  if (!args) {
    res.send({ message: 'missing args' });
    return;
  }

  const flagsParser = new Flags(args.split(' '), optionsFlag);
  const flags = flagsParser.parse();
  env.flags = flags;

  if (!flagsParser.isValid(flags)) {
    res.send({ message: 'missing flags' });
    return;
  }

  controller.run();

  res.send(flags);
};

module.exports = controllerConductor;
