const fs = require("fs");
const path = require("path");

const escape = require("escape-string-regexp");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const root = path.resolve(__dirname, "..");
const rootPak = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

const modules = [
  "@babel/runtime",
  ...Object.keys({
    ...rootPak.dependencies,
    ...rootPak.peerDependencies,
  }),
];

module.exports = {
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    blacklistRE: exclusionList([
      new RegExp(`^${escape(path.join(root, "node_modules"))}\\/.*$`),
    ]),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, "node_modules", name);
      return acc;
    }, {}),
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
