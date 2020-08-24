const defaultOptions = {
  delimiter: '-',
  requiredFlags: [],
};

class Flags {
  constructor(args, options = {}) {
    this.args = args;
    this.options = Object.assign(defaultOptions, options);
  }

  parse() {
    const flagsParsed = {};
    const flags = this.args.filter(item => this.isFlag(item));

    flags.forEach((theFlag, flagIndex) => {
      let nextValue;
      if (this.hasNextValue(this.args[flagIndex + 1])) {
        nextValue = this.args[flagIndex + 1];
        flagsParsed[this.removeTagNotation(theFlag)] = this.isFlag(nextValue)
          ? true
          : nextValue;
      } else {
        flagsParsed[this.removeTagNotation(theFlag)] = true;
      }
    });

    return flagsParsed;
  }

  isValid(flagsParsed) {
    const exitingFlags = Object.keys(flagsParsed);
    const difference = this.options.requiredFlags.filter(
      x => !exitingFlags.includes(x),
    );
    return difference.length === 0;
  }

  static hasNextValue(value) {
    return value;
  }

  isFlag(value) {
    return value && value.startsWith(`${this.options.delimiter}`);
  }

  removeTagNotation(tag) {
    const regex = new RegExp(`${this.options.delimiter}*`, 'g');
    return tag.replace(regex, '');
  }
}

module.exports = Flags;
