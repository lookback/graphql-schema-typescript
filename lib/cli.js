#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var path = require("path");
var index_1 = require("./index");
var types_1 = require("./types");
// Make sure unhandled errors in async code are propagated correctly
process.on('unhandledRejection', function (error) { throw error; });
function handleError(message, error) {
    if (error === void 0) { error = new Error(message); }
    console.log('Message: ', message);
    console.log('Error: ', error);
    process.exit(1);
}
var globalOpt = 'global';
var typePrefix = 'typePrefix';
var namespaceOpt = 'namespace';
var miminizeInterface = 'minimizeInterfaceImplementation';
var contextType = 'contextType';
var importStatements = 'importStatements';
var strictNulls = 'strictNulls';
var smartTResult = 'smartTResult';
var smartTParent = 'smartTParent';
var asyncResult = 'asyncResult';
var requireResolverTypes = 'requireResolverTypes';
var noStringEnum = 'noStringEnum';
var optionalResolverInfo = 'optionalResolverInfo';
yargs
    .option(globalOpt, {
    desc: 'Generate types as global',
    boolean: true,
    default: types_1.defaultOptions[globalOpt]
})
    .option(typePrefix, {
    desc: 'A prefix to every generated types',
    string: true,
    default: types_1.defaultOptions[typePrefix]
})
    .option(namespaceOpt, {
    desc: 'Add types under a namespace',
    string: true,
    default: types_1.defaultOptions[namespaceOpt]
})
    .option(miminizeInterface, {
    desc: 'Ignore copying of interface keys to type implementation',
    boolean: true,
    default: types_1.defaultOptions[miminizeInterface]
})
    .options(contextType, {
    desc: 'Name of your graphql context type',
    string: true,
    default: types_1.defaultOptions[contextType]
})
    .option(importStatements, {
    desc: 'Import statements at the top of the generated file that import your custom scalar type and context type',
    array: true
})
    .option(strictNulls, {
    desc: 'Set optional fields as nullable instead of undefined',
    boolean: true,
})
    .option(smartTResult, {
    desc: 'Apply appropriate default TResult to resolver',
    boolean: true
})
    .option(smartTParent, {
    desc: 'Apply appropriate default TParent to resolver',
    boolean: true
})
    .option(asyncResult, {
    desc: 'Set return type of resolver to `TResult | Promise<TResult>`',
    choices: [true, 'always']
})
    .option(requireResolverTypes, {
    desc: 'Set resolvers to be required. Useful to ensure no resolvers is missing',
    boolean: true
})
    .option(noStringEnum, {
    desc: "Generate enum type as string union instead of TypeScript's string enum",
    boolean: true
})
    .option(optionalResolverInfo, {
    desc: "Set the info argument of generated resolvers as optional.",
    boolean: false
})
    .option('output', {
    desc: 'Output path for Typescript definitions file',
    string: true,
    demand: true,
    default: 'graphqlTypes.d.ts',
    normalize: true,
    coerce: path.resolve
})
    .command('generate-ts <folderPath>', 'Generate typescript definitions from a local folder that cointains `.graphql` type definitions', {}, function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var folderPath, output, options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                folderPath = argv.folderPath, output = argv.output;
                options = {};
                options[globalOpt] = argv[globalOpt];
                options[typePrefix] = argv[typePrefix];
                options[namespaceOpt] = argv[namespaceOpt];
                options[miminizeInterface] = argv[miminizeInterface];
                options[contextType] = argv[contextType];
                options[importStatements] = argv[importStatements];
                options[strictNulls] = argv[strictNulls];
                options[smartTResult] = argv[smartTResult];
                options[smartTParent] = argv[smartTParent];
                options[asyncResult] = argv[asyncResult];
                options[requireResolverTypes] = argv[requireResolverTypes];
                options[noStringEnum] = argv[noStringEnum];
                options[optionalResolverInfo] = argv[optionalResolverInfo];
                return [4 /*yield*/, index_1.generateTypeScriptTypes(folderPath, path.resolve(output), options)];
            case 1:
                _a.sent();
                if (process.env.NODE_ENV !== 'test') {
                    console.log("Typescript generated at: " + output);
                }
                return [2 /*return*/];
        }
    });
}); })
    .fail(function (message, error) {
    handleError(message, error);
    process.exit(1);
})
    .help()
    .version()
    .strict()
    // tslint:disable-next-line
    .argv;
