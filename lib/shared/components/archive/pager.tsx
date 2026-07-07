"use client";

import { Flex, chakra } from "@chakra-ui/react";

/** 档案体例翻页器: ‹ 页码 ›。当前页铜边铜底, 首尾/相邻页 + 省略号窗口。 */
export function Pager({
  page,
  pageCount,
  onPage,
}: {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  const tokens = buildTokens(page, pageCount);

  return (
    <Flex align="center" gap="2px">
      <PagerBtn disabled={page <= 1} onClick={() => onPage(page - 1)}>
        ‹
      </PagerBtn>
      {tokens.map((t, i) =>
        t === "…" ? (
          <chakra.span key={`gap-${i}`} fontFamily="mono" fontSize="12px" color="arch.mut" px="6px">
            …
          </chakra.span>
        ) : (
          <PagerBtn key={t} active={t === page} onClick={() => onPage(t as number)}>
            {t}
          </PagerBtn>
        )
      )}
      <PagerBtn disabled={page >= pageCount} onClick={() => onPage(page + 1)}>
        ›
      </PagerBtn>
    </Flex>
  );
}

function PagerBtn({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <chakra.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      fontFamily="mono"
      fontSize="12px"
      letterSpacing="1px"
      color={disabled ? "arch.mut" : "arch.brass"}
      bg={active ? "arch.hov" : "transparent"}
      border="1px solid"
      borderColor={active ? "arch.brass" : "arch.rule"}
      borderRadius="0"
      px="10px"
      py="5px"
      whiteSpace="nowrap"
      cursor={disabled ? "default" : "pointer"}
      transition="background 0.15s"
      _hover={disabled ? {} : { bg: "arch.hov" }}
    >
      {children}
    </chakra.button>
  );
}

/** 生成页码窗口: [1, …, p-1, p, p+1, …, N]。 */
function buildTokens(page: number, count: number): (number | "…")[] {
  const pages = new Set<number>([1, count, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}
