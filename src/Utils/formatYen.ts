export const formatYen = (num: number) =>
  Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    num,
  );
