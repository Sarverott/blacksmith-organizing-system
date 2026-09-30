// A procedure is an ordered list of named steps sharing one context object.
// Every logicflow is a procedure; every run leaves a trace in context.trace.

export class BasicProcedure {
  constructor(name, steps = [], { description = "" } = {}) {
    this.name = name;
    this.steps = steps;
    this.description = description;
  }

  step(name, action) {
    this.steps.push({ name, action, owner: this.name });
    return this;
  }

  // a new procedure made of this one's steps followed by the other's
  chain(other, name = `${this.name}+${other.name}`) {
    return new BasicProcedure(name, [...this.steps, ...other.steps], { description: this.description });
  }

  async run(context = {}) {
    context.trace ??= [];
    context.changes ??= [];
    for (const { name, action, owner } of this.steps) {
      const started = Date.now();
      try {
        await action(context);
        context.trace.push({ procedure: owner, step: name, ok: true, ms: Date.now() - started });
      } catch (error) {
        context.trace.push({ procedure: owner, step: name, ok: false, error: error.message });
        error.procedure ??= `${owner} › ${name}`;
        throw error;
      }
    }
    return context;
  }
}
