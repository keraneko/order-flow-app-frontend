export const normalizeNumberString = (s: string) =>
  s.replace(/[０-９]/g, (change) =>
    String.fromCharCode(change.charCodeAt(0) - 0xfee0),
  );
