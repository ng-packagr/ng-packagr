/** Common call signature for a command */
export interface Command<Arguments, Result> {
  (args?: Arguments): Result | Promise<Result>
}


export function execute<A, R>(command: Command<A, R>, args?: A): Promise<R> {

  const result = args ? command(args) : command();
  if (result instanceof Promise) {
    return result;
  } else {
    return Promise.resolve(result);
  }
}
