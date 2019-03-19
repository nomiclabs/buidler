import {TASK_FLATTEN_GET_FLATTENED_SOURCE, TASK_COMPILE_GET_DEPENDENCY_GRAPH} from "@nomiclabs/buidler/builtin-tasks/task-names";
import {extendEnvironment} from "@nomiclabs/buidler/config";
import {task} from "@nomiclabs/buidler/internal/core/config/config-env";
import {BuidlerPluginError, lazyObject} from "@nomiclabs/buidler/plugins";
import EtherscanVerifyContractRequest from "./etherscan/EtherscanVerifyContractRequest";
import EtherscanService from "./etherscan/EtherscanService";
import SolcVersions from "./solc/SolcVersions";

export class EtherscanBuidlerEnvironment {
    constructor(
        public readonly url: string = "https://api.etherscan.io/api",
        public readonly token: string = ""
    ) {
    }
}

declare module "@nomiclabs/buidler/types" {
    export interface BuidlerRuntimeEnvironment {
        etherscan: EtherscanBuidlerEnvironment;
    }

    export interface ResolvedBuidlerConfig {
        etherscan: {
            url?: string;
            token?: string;
        };
    }

    export interface SolcConfig {
        fullVersion: string;
    }
}

extendEnvironment(env => {
    env.etherscan = lazyObject(
        () =>
            new EtherscanBuidlerEnvironment(
                env.config.etherscan.url,
                env.config.etherscan.token
            )
    );
});

task("verify-contract", "Verifies contract on etherscan")
    .addParam("contractName", "Name of the deployed contract")
    .addParam("address", "Deployed address of smart contract")
    .addOptionalParam(
        "libraries",
        'Stringified JSON object in format of {library1: "0x2956356cd2a2bf3202f771f50d3d14a367b48071"}'
    )
    .addOptionalVariadicPositionalParam(
        "constructorArguments",
        "arguments for contract constructor"
    )
    .setAction(
        async (
            taskArgs: { contractName: string, address: string, libraries: string, constructorArguments: Array<string> },
            {etherscan, config, run}
        ) => {
            if (!etherscan.token || !etherscan.token.trim()) {
                throw new BuidlerPluginError(
                    "Please provide etherscan api token via buidler.config.js (etherscan.token)"
                );
            }
            const flattenedSource = await run(TASK_FLATTEN_GET_FLATTENED_SOURCE);
            config.solc.fullVersion = await SolcVersions.toLong(config.solc.version);
            const request = new EtherscanVerifyContractRequest(
                etherscan,
                config.solc,
                taskArgs.contractName,
                taskArgs.address,
                taskArgs.libraries,
                flattenedSource,
                taskArgs.constructorArguments
            );
            console.log(request.serialize());
            console.log(await new EtherscanService(etherscan.url).verifyContract(request));
        });
