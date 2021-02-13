/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { join } from "path";
import isInstalledGlobally from "is-installed-globally";
import globalDirs from "global-dirs";
import isLinked from "is-linked";

/**
 * If the parent is installed globally, imports the globally installed module. Returns `null` if not found. Supports `npm` and `yarn` global installs.
 *
 * @param module is the name of the module to import.
 * @param linked is whether to import global modules for linked modules.
 * @param force is whether to import global modules even parent is not a global module.
 * @returns module export.
 *
 * @example
 * const get = importGlobal<() => any>("lodash.get");
 */
export default async function importGlobal<T extends any = any>(module: string, { linked = true, force = false } = {}): Promise<T | null> {
  const allowLinked = linked && (await isLinked(module));
  if (!force && !isInstalledGlobally && !allowLinked) return null;
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
