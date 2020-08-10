const Flags = require("../flags/Flags");
const env = require("../env");


const optionsFlag = {
    requiredFlags: [
      "provider",
      "scraperPoint"
    ]
  }

const controller = (req, res) => {
    const { args } = req.query;

    if (!args) {
        res.send({message: "missing args"});
        return;
    }

    const flagsParser = new Flags(args.split(" "), optionsFlag);
    const flags = flagsParser.parse();
    env.flags = flags;

    if (!flagsParser.isValid(flags)) {
        res.send({message: "missing flags"});
        return;
    }

    const theProvider = require(`../${flags.provider}/startup`);
    theProvider.run();

    res.send(flags);

}

module.exports = controller