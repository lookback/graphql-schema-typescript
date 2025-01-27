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
exports.TypeScriptGenerator = void 0;
var typescript_1 = require("typescript");
var utils_1 = require("./utils");
var TypeScriptGenerator = /** @class */ (function () {
    function TypeScriptGenerator(options, introspectResult, outputPath) {
        this.options = options;
        this.introspectResult = introspectResult;
        this.outputPath = outputPath;
    }
    TypeScriptGenerator.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var introspectResult, gqlTypes;
            var _this = this;
            return __generator(this, function (_a) {
                introspectResult = this.introspectResult;
                gqlTypes = introspectResult.__schema.types.filter(function (type) { return !utils_1.isBuiltinType(type); });
                return [2 /*return*/, gqlTypes.reduce(function (prevTypescriptDefs, gqlType) {
                        var jsDoc = utils_1.descriptionToJSDoc({ description: gqlType.description });
                        var typeScriptDefs = [].concat(jsDoc);
                        switch (gqlType.kind) {
                            case 'SCALAR': {
                                typeScriptDefs = typeScriptDefs.concat(_this.generateCustomScalarType(gqlType));
                                break;
                            }
                            case 'ENUM': {
                                typeScriptDefs = typeScriptDefs.concat(_this.generateEnumType(gqlType));
                                break;
                            }
                            case 'OBJECT':
                            case 'INPUT_OBJECT':
                            case 'INTERFACE': {
                                typeScriptDefs = typeScriptDefs.concat(_this.generateObjectType(gqlType, gqlTypes));
                                break;
                            }
                            case 'UNION': {
                                typeScriptDefs = typeScriptDefs.concat(_this.generateUnionType(gqlType));
                                break;
                            }
                            default: {
                                throw new Error("Unknown type kind " + gqlType.kind);
                            }
                        }
                        typeScriptDefs.push('');
                        return prevTypescriptDefs.concat(typeScriptDefs);
                    }, [])];
            });
        });
    };
    TypeScriptGenerator.prototype.generateCustomScalarType = function (scalarType) {
        var customScalarType = this.options.customScalarType || {};
        if (customScalarType[scalarType.name]) {
            return ["export type " + this.options.typePrefix + scalarType.name + " = " + customScalarType[scalarType.name] + ";"];
        }
        return ["export type " + this.options.typePrefix + scalarType.name + " = any;"];
    };
    TypeScriptGenerator.prototype.isStringEnumSupported = function () {
        var _a = typescript_1.versionMajorMinor.split('.').map(function (v) { return +v; }), major = _a[0], minor = _a[1];
        return (major === 2 && minor >= 5) || major > 2;
    };
    TypeScriptGenerator.prototype.generateEnumType = function (enumType) {
        var _this = this;
        // if using old typescript, which doesn't support string enum: convert enum to string union
        if (!this.isStringEnumSupported() || this.options.noStringEnum) {
            return this.createUnionType(enumType.name, enumType.enumValues.map(function (v) { return "'" + v.name + "'"; }));
        }
        var enumBody = enumType.enumValues.reduce(function (prevTypescriptDefs, enumValue, index) {
            var typescriptDefs = [];
            var enumValueJsDoc = utils_1.descriptionToJSDoc(enumValue);
            var isLastEnum = index === enumType.enumValues.length - 1;
            var graphQlEnumValueName = enumValue.name;
            var typescriptEnumValueName = _this.generateEnumValueName(graphQlEnumValueName);
            if (!isLastEnum) {
                typescriptDefs = __spreadArrays(enumValueJsDoc, [typescriptEnumValueName + " = '" + graphQlEnumValueName + "',"]);
            }
            else {
                typescriptDefs = __spreadArrays(enumValueJsDoc, [typescriptEnumValueName + " = '" + graphQlEnumValueName + "'"]);
            }
            if (enumValueJsDoc.length > 0) {
                typescriptDefs = __spreadArrays([''], typescriptDefs);
            }
            return prevTypescriptDefs.concat(typescriptDefs);
        }, []);
        // if code is generated as type declaration, better use export const enum instead
        // of just export enum
        var isGeneratingDeclaration = this.options.global
            || !!this.options.namespace
            || this.outputPath.endsWith('.d.ts');
        var enumModifier = isGeneratingDeclaration ? ' const ' : ' ';
        return __spreadArrays([
            "export" + enumModifier + "enum " + this.options.typePrefix + enumType.name + " {"
        ], enumBody, [
            '}'
        ]);
    };
    TypeScriptGenerator.prototype.generateEnumValueName = function (graphQlName) {
        if (this.options.enumsAsPascalCase) {
            return utils_1.pascalCase(graphQlName);
        }
        else {
            return graphQlName;
        }
    };
    TypeScriptGenerator.prototype.generateObjectType = function (objectType, allGQLTypes) {
        var _this = this;
        var fields = objectType.kind === 'INPUT_OBJECT' ? objectType.inputFields : objectType.fields;
        var extendTypes = objectType.kind === 'OBJECT'
            ? objectType.interfaces.map(function (i) { return i.name; })
            : [];
        var extendGqlTypes = allGQLTypes.filter(function (t) { return extendTypes.indexOf(t.name) !== -1; });
        var extendFields = extendGqlTypes.reduce(function (prevFieldNames, gqlType) {
            return prevFieldNames.concat(gqlType.fields.map(function (f) { return f.name; }));
        }, []);
        var objectFields = fields.reduce(function (prevTypescriptDefs, field, index) {
            if (extendFields.indexOf(field.name) !== -1 && _this.options.minimizeInterfaceImplementation) {
                return prevTypescriptDefs;
            }
            var fieldJsDoc = utils_1.descriptionToJSDoc(field);
            var _a = utils_1.createFieldRef(field, _this.options.typePrefix, _this.options.strictNulls), fieldName = _a.fieldName, fieldType = _a.fieldType;
            var fieldNameAndType = fieldName + ": " + fieldType + ";";
            var typescriptDefs = __spreadArrays(fieldJsDoc, [fieldNameAndType]);
            if (fieldJsDoc.length > 0) {
                typescriptDefs = __spreadArrays([''], typescriptDefs);
            }
            return prevTypescriptDefs.concat(typescriptDefs);
        }, []);
        var possibleTypeNames = [];
        var possibleTypeNamesMap = [];
        if (objectType.kind === 'INTERFACE') {
            possibleTypeNames.push.apply(possibleTypeNames, __spreadArrays([
                '',
                "/** Use this to resolve interface type " + objectType.name + " */"
            ], this.createUnionType("Possible" + objectType.name + "TypeNames", objectType.possibleTypes.map(function (pt) { return "'" + pt.name + "'"; }))));
            possibleTypeNamesMap.push.apply(possibleTypeNamesMap, __spreadArrays([
                '',
                "export interface " + this.options.typePrefix + objectType.name + "NameMap {",
                objectType.name + ": " + this.options.typePrefix + objectType.name + ";"
            ], objectType.possibleTypes.map(function (pt) {
                return pt.name + ": " + _this.options.typePrefix + pt.name + ";";
            }), [
                '}'
            ]));
        }
        var extendStr = extendTypes.length === 0
            ? ''
            : "extends " + extendTypes.map(function (t) { return _this.options.typePrefix + t; }).join(', ') + " ";
        return __spreadArrays([
            "export interface " + this.options.typePrefix + objectType.name + " " + extendStr + "{"
        ], objectFields, [
            '}'
        ], possibleTypeNames, possibleTypeNamesMap);
    };
    TypeScriptGenerator.prototype.generateUnionType = function (unionType) {
        var _this = this;
        var typePrefix = this.options.typePrefix;
        var possibleTypesNames = __spreadArrays([
            '',
            "/** Use this to resolve union type " + unionType.name + " */"
        ], this.createUnionType("Possible" + unionType.name + "TypeNames", unionType.possibleTypes.map(function (pt) { return "'" + pt.name + "'"; })));
        var possibleTypeNamesMap = __spreadArrays([
            '',
            "export interface " + this.options.typePrefix + unionType.name + "NameMap {",
            unionType.name + ": " + this.options.typePrefix + unionType.name + ";"
        ], unionType.possibleTypes.map(function (pt) {
            return pt.name + ": " + _this.options.typePrefix + pt.name + ";";
        }), [
            '}'
        ]);
        var unionTypeTSDefs = this.createUnionType(unionType.name, unionType.possibleTypes.map(function (type) {
            if (utils_1.isBuiltinType(type)) {
                return type.name;
            }
            else {
                return typePrefix + type.name;
            }
        }));
        return __spreadArrays(unionTypeTSDefs, possibleTypesNames, possibleTypeNamesMap);
    };
    /**
     * Create a union type e.g: type Color = 'Red' | 'Green' | 'Blue' | ...
     * Also, if the type is too long to fit in one line, split them info multiple lines
     * => type Color = 'Red'
     *      | 'Green'
     *      | 'Blue'
     *      | ...
     */
    TypeScriptGenerator.prototype.createUnionType = function (typeName, possibleTypes) {
        var result = "export type " + this.options.typePrefix + typeName + " = " + possibleTypes.join(' | ') + ";";
        if (result.length <= 80) {
            return [result];
        }
        var _a = result.split('='), firstLine = _a[0], rest = _a[1];
        return __spreadArrays([
            firstLine + '='
        ], rest
            .replace(/ \| /g, ' |\n')
            .split('\n')
            .map(function (line) { return line.trim(); }));
    };
    return TypeScriptGenerator;
}());
exports.TypeScriptGenerator = TypeScriptGenerator;
