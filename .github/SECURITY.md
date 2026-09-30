# Security

## Reporting

Report vulnerabilities privately through a GitHub security advisory
(*Security → Report a vulnerability*), not in public issues.

## What BOS protects

- `.BOS/setup/` holds SSH keys, VPN and routing setup, and tokens. It must never
  be committed, published or copied off the host unencrypted.
- `.BOS/storylines/ttystories/` holds shell history, which can contain secrets.
  Treat it like `setup/`.
- Manifests (`manifest.json`, `.manifest.json`) keep checksums;
  `bos verify <dir>` detects tampering.
- BOS creates only what is missing and never overwrites or deletes.
