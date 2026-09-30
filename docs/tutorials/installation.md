# Installation

BOS is a project like any other, so it lives in the forge, in its scope:

```bash
mkdir -p ~/__WORKSHOP/forge/blacksmith-organization-system
cd ~/__WORKSHOP/forge/blacksmith-organization-system
git clone https://github.com/Sarverott/blacksmith-organizing-system.git bos-skillset
cd bos-skillset
npm install
npm link        # optional: puts `bos` on PATH
```

Without `npm link`, use `node src/cli.mjs <command>` or `task <command>`.

Check it:

```bash
bos locate      # prints the workshop and "forge / blacksmith-organization-system / bos-skillset"
task test
```

Container instead:

```bash
docker compose run --rm bos status      # mounts $BOS_WORKSHOP or ~/__WORKSHOP at /workshop
```

Next: [getting started](GETTING_STARTED.md)
