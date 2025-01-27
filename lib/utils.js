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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pascalCase = exports.toUppercaseFirst = exports.createFieldRef = exports.formatTabSpace = exports.descriptionToJSDoc = exports.isBuiltinType = exports.introspectSchemaViaLocalFile = exports.introspectSchema = void 0;
var fs = require("fs");
var path_1 = require("path");
var graphql_1 = require("graphql");
var camelCase = require('camelcase');
/**
 * Send introspection query to a graphql schema
 */
var introspectSchema = function (schema) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, errors;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, graphql_1.graphql({
                    schema: schema, source: graphql_1.getIntrospectionQuery()
                })];
            case 1:
                _a = _b.sent(), data = _a.data, errors = _a.errors;
                if (errors) {
                    throw errors;
                }
                return [2 /*return*/, data];
        }
    });
}); };
exports.introspectSchema = introspectSchema;
function introspectSchemaStr(schemaStr) {
    return __awaiter(this, void 0, void 0, function () {
        var schema;
        return __generator(this, function (_a) {
            schema = graphql_1.buildASTSchema(graphql_1.parse(schemaStr));
            return [2 /*return*/, exports.introspectSchema(schema)];
        });
    });
}
function klawSync(path, filterRegex, fileNames) {
    if (fileNames === void 0) { fileNames = []; }
    var fileStat = fs.statSync(path);
    if (fileStat.isDirectory()) {
        var directory = fs.readdirSync(path);
        directory.forEach(function (f) { return klawSync(path_1.join(path, f), filterRegex, fileNames); });
    }
    else if (filterRegex.test(path)) {
        fileNames.push(path);
    }
    return fileNames;
}
var introspectSchemaViaLocalFile = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var files, allTypeDefs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = klawSync(path, /\.(graphql|gql|graphqls)$/);
                allTypeDefs = files.map(function (filePath) { return fs.readFileSync(filePath, 'utf-8'); }).join('\n');
                return [4 /*yield*/, introspectSchemaStr(allTypeDefs)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.introspectSchemaViaLocalFile = introspectSchemaViaLocalFile;
/**
 * Check if type is a built-in graphql type
 */
var isBuiltinType = function (type) {
    var builtInScalarNames = ['Int', 'Float', 'String', 'Boolean', 'ID'];
    var builtInEnumNames = ['__TypeKind', '__DirectiveLocation'];
    var builtInObjectNames = ['__Schema', '__Type', '__Field', '__InputValue', '__Directive', '__EnumValue'];
    return type.kind === 'SCALAR' && builtInScalarNames.indexOf(type.name) !== -1
        || type.kind === 'ENUM' && builtInEnumNames.indexOf(type.name) !== -1
        || type.kind === 'OBJECT' && builtInObjectNames.indexOf(type.name) !== -1;
};
exports.isBuiltinType = isBuiltinType;
/**
 * Convert description and deprecated directives into JSDoc
 */
var descriptionToJSDoc = function (description) {
    var line = description.description || '';
    var isDeprecated = description.isDeprecated, deprecationReason = description.deprecationReason;
    if (isDeprecated) {
        line += '\n@deprecated';
        if (deprecationReason) {
            line += ' ' + deprecationReason;
        }
    }
    if (!line) {
        return [];
    }
    var lines = line.split('\n').map(function (l) { return ' * ' + l; });
    return __spreadArrays([
        '/**'
    ], lines, [
        ' */'
    ]);
};
exports.descriptionToJSDoc = descriptionToJSDoc;
var formatTabSpace = function (lines, tabSpaces) {
    var result = [];
    var indent = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var trimmed = line.trim();
        if (trimmed.endsWith('}') || trimmed.endsWith('};')) {
            indent -= tabSpaces;
            if (indent < 0) {
                indent = 0;
            }
        }
        result.push(' '.repeat(indent) + line);
        if (trimmed.endsWith('{')) {
            indent += tabSpaces;
        }
    }
    return result;
};
exports.formatTabSpace = formatTabSpace;
var gqlScalarToTS = function (scalarName, typePrefix) {
    switch (scalarName) {
        case 'Int':
        case 'Float':
            return 'number';
        case 'String':
        case 'ID':
            return 'string';
        case 'Boolean':
            return 'boolean';
        default:
            return typePrefix + scalarName;
    }
};
var getTypeToTS = function (field, prefix, nonNullable) {
    if (nonNullable === void 0) { nonNullable = false; }
    var tsType = '';
    if (field.kind === 'NON_NULL') {
        return getTypeToTS(field.ofType, prefix, true);
    }
    if (field.kind === 'LIST') {
        tsType = getTypeToTS(field.ofType, prefix, false);
        tsType = "Array<" + tsType + ">";
    }
    else {
        tsType = gqlScalarToTS(field.name, prefix);
    }
    if (!nonNullable) {
        tsType = tsType + " | null";
    }
    return tsType;
};
var createFieldRef = function (field, prefix, strict) {
    var nullable = field.type.kind !== 'NON_NULL';
    var fieldName = '';
    var fieldType = '';
    if (!strict && nullable) {
        fieldName = field.name + "?";
        fieldType = getTypeToTS(field.type, prefix, true);
    }
    else {
        fieldName = "" + field.name;
        fieldType = getTypeToTS(field.type, prefix, false);
    }
    return { fieldName: fieldName, fieldType: fieldType };
};
exports.createFieldRef = createFieldRef;
var toUppercaseFirst = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};
exports.toUppercaseFirst = toUppercaseFirst;
var pascalCase = function (value) {
    return exports.toUppercaseFirst(camelCase(value));
};
exports.pascalCase = pascalCase;
