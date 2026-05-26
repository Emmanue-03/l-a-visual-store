export function getServerEnv(name: string): string | undefined {
  const globalRecord = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return globalRecord.process?.env?.[name];
}

export function requiredServerEnv(name: string): string {
  const value = getServerEnv(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
