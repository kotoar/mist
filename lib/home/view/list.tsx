"use client";

import { Box, Flex, For, Show, chakra } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { listViewModel } from "@lib/home/viewmodel";
import { CommunityView } from "./community";
import { GuideButtonView } from "./guide";
import { Masthead } from "@lib/shared/components/archive/masthead";
import { Colophon } from "@lib/shared/components/archive/colophon";
import { StoryCard, StoryGrid } from "@lib/shared/components/archive/story-card";
import { Pager } from "@lib/shared/components/archive/pager";

const DIFFICULTY: Record<string, string> = { easy: "简单", medium: "中等", hard: "困难" };
const ROWS_PER_PAGE = 3;
const MIN_COL = 280; // 与 StoryGrid minCol 保持一致

/** 首屏就按视口估算列数(容器 maxW 1360, 左右各 padding), 避免测量前闪烁。 */
function estimateCols() {
  if (typeof window === "undefined") return 4;
  const pad = window.innerWidth >= 768 ? 64 : 40;
  const inner = Math.min(window.innerWidth, 1360) - pad;
  return Math.max(1, Math.floor(inner / MIN_COL));
}

export function ListView({ type }: { type: "case" | "mist" }) {
  const viewModel = useSnapshot(listViewModel);
  const items = type === "case" ? viewModel.showCases : viewModel.mists;
  const unit = type === "case" ? "卷" : "篇";

  const [page, setPage] = useState(1);
  // 每页 = 实际列数 × 3 行 (随视口自适应, 手机每行更少 → 每页更少)
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(estimateCols);
  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w < 120) return; // 布局未定, 忽略异常小的瞬时宽度
      setCols(Math.max(1, Math.floor(w / MIN_COL)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 切换分区 / 档案类型时回到第一页(渲染期同步重置, 避免 effect 造成的级联渲染)
  const resetKey = `${type}:${viewModel.caseFilter}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setPage(1);
  }

  const pageSize = cols * ROWS_PER_PAGE;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const start = (safePage - 1) * pageSize;
  const pageCases = type === "case" ? viewModel.showCases.slice(start, start + pageSize) : [];
  const pageMists = type === "mist" ? viewModel.mists.slice(start, start + pageSize) : [];

  function goPage(p: number) {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Box maxW="1360px" mx="auto" px={{ base: "20px", md: "32px" }} minH="100vh">
      <Masthead current={type} />

      {/* 工具行 */}
      <Flex align="center" gap="14px" wrap="wrap" py="22px">
        <GuideButtonView />
        <Show when={type === "case"}>
          <CaseTypeFilter />
        </Show>
        <chakra.span flex="1" minW="10px" />
        <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="2px" color="arch.mut" textTransform="uppercase">
          共 {items.length} {unit}
        </chakra.span>
        <Pager page={safePage} pageCount={pageCount} onPage={goPage} />
      </Flex>

      {/* 卷宗卡格 */}
      <StoryGrid minCol="280px" gridRef={gridRef}>
        <Show when={type === "case"}>
          <For each={pageCases}>
            {(item) => (
              <StoryCard
                key={item.id}
                type={item.game === "case" ? "case" : "detect"}
                index={item.index}
                title={item.title}
                cover={item.cover}
                meta={[item.difficulty ? DIFFICULTY[item.difficulty] : undefined, ...item.tags, item.author]}
                href={`/${item.game}/${item.id}`}
              />
            )}
          </For>
        </Show>
        <Show when={type === "mist"}>
          <For each={pageMists}>
            {(item) => (
              <StoryCard
                key={item.id}
                type="mist"
                index={item.index}
                title={item.title}
                cover={item.cover}
                meta={[item.difficulty ? DIFFICULTY[item.difficulty] : undefined, ...item.tags, item.author]}
                href={`/mist/${item.id}`}
              />
            )}
          </For>
        </Show>
      </StoryGrid>

      {/* 底部翻页 */}
      <Show when={pageCount > 1}>
        <Flex justify="center" py="26px">
          <Pager page={safePage} pageCount={pageCount} onPage={goPage} />
        </Flex>
      </Show>

      <CommunityView />
      <Colophon />
    </Box>
  );
}

function CaseTypeFilter() {
  const viewModel = useSnapshot(listViewModel);
  const options: { label: string; value: "all" | "case" | "detect" }[] = [
    { label: "全部", value: "all" },
    { label: "演绎", value: "case" },
    { label: "探案", value: "detect" },
  ];
  return (
    <Flex align="center" gap="2px">
      <For each={options}>
        {(opt) => (
          <chakra.button
            key={opt.value}
            type="button"
            onClick={() => (listViewModel.caseFilter = opt.value)}
            fontFamily="mono"
            fontSize="12px"
            letterSpacing="1px"
            color="arch.brass"
            bg={viewModel.caseFilter === opt.value ? "arch.hov" : "transparent"}
            border="0"
            px="8px"
            py="3px"
            cursor="pointer"
            whiteSpace="nowrap"
            transition="background 0.15s"
            _hover={{ bg: "arch.hov" }}
          >
            [{opt.label}]
          </chakra.button>
        )}
      </For>
    </Flex>
  );
}
