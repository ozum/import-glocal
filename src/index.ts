/* eslint-disable no-plusplus, no-await-in-loop */
import { parse, format } from "path";
import importLocal from "./import-local";
import importGlobal from "./import-global";

/**
 * Imports the given module or module prefixed with one of the prefixes. If the module is installed globally,
 * tries to import globally installed modules by `npm` or `yarn`.
 *
 * @typeParam T is the exported value from given module.
 * @param module is the module to import.
 * @param prefix is a prefix or a list of prefixes to get additional module names that begins with a prefix.
 * @param linked is whether to import global modules for linked modules.
 * @param force is whether to import global modules even parent is not a global module.
 * @throws an error if the module or prefixed modules cannot be found locally or globally.
 *
 * @example
 * await importModule("example", { prefix: ["pgen-", "pg-generator-"] }); // Tries to import `example`, `pgen-example`, `pg-generator-example`.
 * await importModule("example", { force: true }); // Import global module even parnet module is not installed globally.
 * await importModule<default: (name: string) => string>("example"); // Type of export.
 */
export default async function importModule<T extends any = any>(
  module: string,
  { prefix = [], linked = true, force }: { prefix?: string | string[]; force?: boolean; linked?: boolean } = {}
): Promise<T> {
  const { root, dir, base } = parse(module);
  const prefixArray = Array.isArray(prefix) ? prefix : [prefix];
  const modules = [module, ...prefixArray.map((pre) => format({ root, dir, base: `${pre}${base}` }))];
  let result = null;

  for (let i = 0; i <= modules.length - 1 && result === null; i++) result = await importLocal<T>(modules[i]);
  for (let i = 0; i <= modules.length - 1 && result === null; i++) result = await importGlobal<T>(modules[i], { linked, force });

  if (result === null) throw new Error(`Cannot find modules: '${modules.join("', '")}'`);

  return result;
}
