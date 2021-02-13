/* eslint-disable no-await-in-loop, no-plusplus, no-restricted-syntax */
import { promises as fs } from "fs";
import { parse, join, format } from "path";
import isInstalledGlobally from "is-installed-globally";
import globalDirs from "global-dirs";

/**
 * Returns whether this module (`pg-generator`) is npm linked.
 */
async function isNpmLinked(): Promise<boolean> {
  try {
    await fs.lstat(join(globalDirs.npm.packages, "pg-generator"));
  } catch (npmError) {
    try {
      if (npmError.code === "ENOENT") await fs.lstat(join(globalDirs.yarn.packages, "pg-generator"));
      throw npmError;
    } catch (yarnError) {
      if (yarnError.code === "ENOENT") return false;
      throw yarnError;
    }
  }
  return true;
}

/**
 * Tries to import the given module and ignores the error if the module cannot be found.
 *
 * @param module is the module name to import.
 * @returns module export.
 */
async function importLocal(module: string): Promise<any> {
  try {
    return await import(module);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") return null;
    throw error;
  }
}

/**
 * Tries to import the given module from `npm` or `yarn` globally and ignores the error if the module cannot be found.
 *
 * @param module is the module name to import.
 * @returns module export.
 */
async function importGlobal(module: string): Promise<any> {
  if (!isInstalledGlobally && !(await isNpmLinked())) return null;
  try {
    return await import(join(globalDirs.npm.packages, module));
  } catch (npmError) {
    try {
      if (npmError.code === "MODULE_NOT_FOUND") return await import(join(globalDirs.yarn.packages, module));
      throw npmError;
    } catch (yarnError) {
      if (yarnError.code === "MODULE_NOT_FOUND") return null;
      throw yarnError;
    }
  }
}

/**
 * Imports the given module or module prefixed with the prefixes. If this module (`pg-generator`)
 * is installed globally, also tries to import from `npm` or `yarn` globally.
 *
 * @param module is the module to import.
 * @param prefixes are prefixes to get additional module names.
 *
 * @example
 * await importModule("example", ["pgen-", "pg-generator-"]); // Tries to import `example`, `pgen-example`, `pg-generator-example`.
 */
export default async function importModule<T extends any>(module: string, prefixes: string | string[] = []): Promise<T> {
  const { root, dir, base } = parse(module);
  const prefixArray = Array.isArray(prefixes) ? prefixes : [prefixes];
  const modules = [module, ...prefixArray.map((prefix) => format({ root, dir, base: `${prefix}${base}` }))];
  let result = null;

  for (let i = 0; i <= modules.length - 1 && result === null; i++) {
    result = await importLocal(modules[i]);
  }
  for (let i = 0; i <= modules.length - 1 && result === null; i++) {
    result = await importGlobal(modules[i]);
  }
  if (result === null) throw new Error(`Cannot find modules: '${modules.join("', '")}'`);

  return result;
}
