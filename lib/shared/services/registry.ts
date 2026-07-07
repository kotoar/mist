"use client";

import { useEffect, useState } from "react";
import { caseList, mistList } from "@lib/home/service/case-list";

export interface Registry {
  case: number;
  mist: number;
  puzzle: number;
}

/** 解谜数量: 目前解谜为静态清单(见 lib/pages/puzzles.tsx), 暂以常量维护。 */
export const PUZZLE_COUNT = 1;

// 会话级缓存: 首次拉取后跨页复用, 避免每个报头重复请求。
let valueCache: Registry | null = null;
let promiseCache: Promise<Registry> | null = null;

function loadRegistry(): Promise<Registry> {
  if (!promiseCache) {
    promiseCache = Promise.all([caseList(), mistList()])
      .then(([cases, mists]) => {
        valueCache = { case: cases.length, mist: mists.length, puzzle: PUZZLE_COUNT };
        return valueCache;
      })
      .catch(() => {
        promiseCache = null; // 失败允许下次重试
        return { case: 0, mist: 0, puzzle: PUZZLE_COUNT };
      });
  }
  return promiseCache;
}

/** 报头登记行的真实册数。已缓存则同步返回, 否则拉取后更新。 */
export function useRegistryCounts(): Registry {
  const [counts, setCounts] = useState<Registry>(
    valueCache ?? { case: 0, mist: 0, puzzle: PUZZLE_COUNT }
  );
  useEffect(() => {
    let alive = true;
    loadRegistry().then((c) => {
      if (alive) setCounts(c);
    });
    return () => {
      alive = false;
    };
  }, []);
  return counts;
}
