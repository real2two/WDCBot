export function validSnowflake(value: string) {
  return /^(\d{17,21})$/.test(value);
}
