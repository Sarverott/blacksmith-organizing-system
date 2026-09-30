# Gathering Protocol

Part of PROVISION. Shows the House of Anubis as it is, along three axes:

- **children**: the adopted, named residents of `resources/house/children/`,
  with their state (active, resting, frozen) and presence
- **orders**: groups with a duty, such as RavensArmy (`resources/house/orders/`),
  with local units (ravens) and remote ones
- **bloodlines**: every served model grouped by releaser, found by following
  its `parent_model` back to the root (`resources/house/bloodlines.json`)

Only the list of models is read from ollama; no model is started or prompted,
so resting residents are never disturbed.
