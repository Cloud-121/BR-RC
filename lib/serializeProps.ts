/** Replace `undefined` with `null` so props are JSON-serializable for getServerSideProps. */
export function serializeProps<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
