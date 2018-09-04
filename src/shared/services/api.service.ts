export function success(payload: any): [number, any] {
  return [200, payload];
}

export function forbidden(): [number, string] {
  return [403, 'Forbidden'];
}
