export function getMaxDiscount(sanPhamUuDai = []) {
  return Math.max(
    0,
    ...sanPhamUuDai.map((sp) => {
      const giaGoc = Number(sp.giaGoc?.$numberDecimal ?? sp.giaGoc);
      const giaUuDai = Number(
        sp.giaUuDai?.$numberDecimal ??
          sp.giaUuDai ??
          sp.giaFlashSale?.$numberDecimal ??
          sp.giaFlashSale ??
          sp.giaKhuyenMai?.$numberDecimal ??
          sp.giaKhuyenMai,
      );

      if (!(giaGoc > 0) || !(giaUuDai > 0) || giaUuDai >= giaGoc) return 0;
      return Math.max(
        1,
        Math.min(99, Math.round((1 - giaUuDai / giaGoc) * 100)),
      );
    }),
  );
}
