const blacklist = require("metro").createBlacklist;

module.exports = {
  getBlacklistRE() {
    return blacklist([/tests\/.*/, /storybook\/.*/]);
  }
};
