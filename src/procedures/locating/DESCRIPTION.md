# Locating Protocol

Reads who, where and when (host, user, home, cwd, unixusat), then finds the
active workshop. The first rule that answers wins: `--workshop`,
`$BOS_WORKSHOP`, the nearest parent `__WORKSHOP`, the workshop BOS is installed
in, `~/__WORKSHOP`. Finally it finds where BOS itself sits. Every other protocol starts here.
