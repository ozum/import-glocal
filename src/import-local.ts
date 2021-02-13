/**
 * Import the given module and ignores the error if the module cannot be found and returns `null`.
 *
 * @param module is the module name to import.
 * @returns module export.
 */
export default async function importLocal<T extends any = any>(module: string): Promise<T | null> {
  try {
    return await import(module);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") return null;
    throw error;
  }
}
