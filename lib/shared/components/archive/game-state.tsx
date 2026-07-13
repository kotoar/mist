"use client";

import { Box, VStack, chakra } from "@chakra-ui/react";
import { BracketLink } from "./action";

/** 卷宗调阅状态: 载入中 / 就绪 / 缺失(404) / 读取失败。 */
export type GameLoadStatus = "loading" | "ready" | "missing" | "error";

const COPY: Record<Exclude<GameLoadStatus, "ready">, { tag: string; title: string; desc: string }> = {
  loading: {
    tag: "调阅中",
    title: "正在调阅卷宗……",
    desc: "档案室正在检索该卷宗，请稍候。",
  },
  missing: {
    tag: "404 · 档案缺失",
    title: "未找到此卷宗",
    desc: "该档案可能尚未归档，或链接有误。",
  },
  error: {
    tag: "错误 · 调阅失败",
    title: "卷宗调阅失败",
    desc: "档案室暂时无法读取该卷宗，请稍后再试。",
  },
};

/**
 * 满屏档案体例状态页: 游戏详情页在 status !== "ready" 时早退渲染,
 * 同时被 app/not-found 与 app/error 复用, 保证坏链接/后端故障也有档案风格兜底。
 */
export function GameStateNotice({
  status,
  onRetry,
}: {
  status: Exclude<GameLoadStatus, "ready">;
  onRetry?: () => void;
}) {
  const copy = COPY[status];
  const loading = status === "loading";

  return (
    <Box
      minH="100vh"
      bg="arch.bg"
      color="arch.ink"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="24px"
    >
      <VStack align="center" gap="16px" maxW="440px" textAlign="center">
        <chakra.div
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="3px"
          textTransform="uppercase"
          color={status === "error" ? "arch.red" : "arch.mut"}
        >
          {copy.tag}
        </chakra.div>
        <chakra.h1
          fontFamily="serif"
          fontWeight="700"
          fontSize="clamp(24px,4vw,32px)"
          letterSpacing="2px"
          color="arch.ink"
          m="0"
        >
          {copy.title}
        </chakra.h1>
        <chakra.p fontFamily="serif" fontSize="14px" lineHeight="1.9" color="arch.dim" m="0">
          {copy.desc}
        </chakra.p>
        {!loading && (
          <Box display="flex" gap="16px" mt="6px">
            <BracketLink href="/">返回主页</BracketLink>
            {status === "error" && (
              <chakra.button
                type="button"
                onClick={() => (onRetry ? onRetry() : window.location.reload())}
                fontFamily="mono"
                fontSize="12.5px"
                letterSpacing="1px"
                color="arch.brass"
                bg="transparent"
                px="8px"
                py="3px"
                cursor="pointer"
                transition="background 0.15s"
                _hover={{ bg: "arch.hov" }}
              >
                [重新载入]
              </chakra.button>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
}
