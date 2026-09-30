const MAX_DATABASE_INT = 2_147_483_647;

/** Parses a route parameter as a positive, base-10 Prisma Int ID. */
export function parseId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id <= MAX_DATABASE_INT ? id : null;
}
