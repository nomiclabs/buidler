import { BN, bufferToInt, fromSigned } from "ethereumjs-util";

import {
  CallMessageTrace,
  EvmMessageTrace,
  isCallTrace,
  isEvmStep,
  isPrecompileTrace,
  MessageTrace
} from "./message-trace";

const Uint = "Uint";

export class ConsoleLogger {
  private _consoleLogs: {
    [key: number]: string[];
  } = {};

  constructor() {
    this._consoleLogs[4163653873] = [Uint];
  }

  public printLogs(maybeDecodedMessageTrace: MessageTrace) {
    if (isPrecompileTrace(maybeDecodedMessageTrace)) {
      return;
    }

    this._printExecutionLogs(maybeDecodedMessageTrace);
  }

  private _printExecutionLogs(trace: EvmMessageTrace) {
    for (const messageTrace of trace.steps) {
      if (isEvmStep(messageTrace) || !isCallTrace(messageTrace)) {
        continue;
      }

      const log = this._maybeConsoleLog(messageTrace);
      if (log !== undefined) {
        console.log(log);
        continue;
      }

      this._printExecutionLogs(messageTrace);
    }
  }

  private _maybeConsoleLog(
    call: CallMessageTrace
  ): ConsoleLogEntry | undefined {
    const sig = bufferToInt(call.calldata.slice(0, 4));
    const parameters = call.calldata.slice(4);

    const types = this._consoleLogs[sig];
    if (types === undefined) {
      return;
    }

    return this._decode(parameters, types);
  }

  private _decode(data: Buffer, types: string[]): ConsoleLogEntry {
    const logs: ConsoleLogs = [];

    let offset = 0;

    for (const type of types) {
      switch (type) {
        case Uint:
          logs.push({
            // TODO: investigate deprecation warning.
            value: fromSigned(data.slice(offset, 32))
          });
          offset += 32;
          break;
      }
    }

    return logs;
  }
}

export interface ConsoleLogUintEntry {
  value: BN;
}

interface ConsoleLogArray extends Array<ConsoleLogEntry> {}

export type ConsoleLogEntry = ConsoleLogUintEntry | ConsoleLogArray;

export type ConsoleLogs = ConsoleLogEntry[];
