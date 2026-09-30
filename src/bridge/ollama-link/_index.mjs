// Local language models through the ollama client (host: options.host, $OLLAMA_HOST
// or http://127.0.0.1:11434). Ravens (resources/ravens/) speak through it.
import { Ollama } from "ollama";

import { BOS } from "../../main.ts";
import { isResting, listRavens, readRaven, resting } from "./ravens.mjs";

export class OllamaLink extends BOS.Bridge {
  static id = "ollama-link";

  connect() {
    return new Ollama({ host: this.options.host ?? process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434" });
  }

  // give up after `ms`, abort the request, and answer null instead of throwing
  async within(ms, work) {
    let timer;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => {
        this.client.abort();
        resolve(null);
      }, ms);
    });
    try {
      return await Promise.race([work(), timeout]);
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async models() {
    return (await this.within(2000, () => this.client.list()))?.models.map((m) => m.name) ?? [];
  }

  async available(model) {
    if (isResting(model)) return false;
    const models = await this.models();
    return model ? models.some((name) => name === model || name === `${model}:latest`) : models.length > 0;
  }

  raven(name) {
    return readRaven(name);
  }
  ravens() {
    return listRavens();
  }

  // one question to one raven; `format` is a JSON schema for structured answers
  // a cold model can take a minute to load; keep_alive keeps it warm for the next calls
  async ask(ravenName, prompt, { format, timeout = 90000, model, keepAlive = "30m" } = {}) {
    const raven = this.raven(ravenName);
    const chosen = model ?? process.env[`BOS_${ravenName.toUpperCase()}_MODEL`] ?? raven.model;
    if (isResting(chosen)) throw new Error(`${chosen} is resting and is not called. ${resting().reason}`);
    const response = await this.within(timeout, () =>
      this.client.chat({
        model: chosen,
        messages: [
          { role: "system", content: raven.system },
          { role: "user", content: prompt },
        ],
        format,
        stream: false,
        keep_alive: keepAlive,
        options: { temperature: 0.2 },
      }),
    );
    return response?.message?.content ?? null;
  }
}

export default OllamaLink;
