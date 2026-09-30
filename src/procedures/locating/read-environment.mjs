import { homedir, hostname, userInfo } from "node:os";

export const readEnvironment = (context) => {
  context.env = {
    host: hostname(),
    user: userInfo().username,
    home: homedir(),
    cwd: process.cwd(),
    platform: process.platform,
    unixusat: Date.now(), // unix timestamp in milliseconds
  };
};
