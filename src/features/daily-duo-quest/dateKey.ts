const dateKeyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = dateKeyPattern.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return year >= 1
    && month >= 1
    && month <= 12
    && day >= 1
    && day <= daysInMonth(year, month);
}

export function assertDateKey(value: unknown): string {
  if (!isDateKey(value)) {
    throw new RangeError(`Invalid Daily Duo Quest date key: ${String(value)}`);
  }
  return value;
}

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateKey(date: string, offset: number): string {
  assertDateKey(date);
  const milliseconds = Date.parse(`${date}T00:00:00Z`) + offset * 86_400_000;
  return new Date(milliseconds).toISOString().slice(0, 10);
}
