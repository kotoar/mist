"use client";

import { Flex, chakra } from "@chakra-ui/react";
import { IMESafeInput } from "@lib/shared/components/IMESafeInput";
import { LoadingView } from "@lib/shared/components/LoadingView";

/**
 * 档案体例讯问输入器: 细线框 + 聚焦转铜边, 内嵌无边 textarea + 铜色 [提交]。
 * 回车提交, Shift+回车换行。
 */
export function ArchiveComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "写下你的回答…(回车提交,Shift+回车换行)",
  disabled = false,
  loading = false,
  rows = 2,
  submitLabel = "提交",
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  rows?: number;
  submitLabel?: string;
  maxLength?: number;
}) {
  const canSubmit = !disabled && !loading && value.trim() !== "";

  return (
    <Flex
      align="flex-end"
      gap="12px"
      border="1px solid"
      borderColor="arch.rule"
      px="14px"
      py="11px"
      transition="border-color 0.15s"
      _focusWithin={{ borderColor: "arch.brass" }}
    >
      <IMESafeInput
        type="textarea"
        value={value}
        onChange={onChange}
        textareaProps={{
          rows,
          placeholder,
          maxLength,
          border: "0",
          background: "transparent",
          resize: "none",
          padding: "0",
          minH: "auto",
          color: "arch.ink",
          fontFamily: "sans",
          fontSize: "14px",
          lineHeight: "1.6",
          _focus: { boxShadow: "none", borderColor: "transparent", outline: "none" },
          _placeholder: { color: "arch.mut" },
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey && value.trim() !== "") {
              e.preventDefault();
              if (!disabled && !loading) onSubmit();
            }
          },
        }}
      />
      <chakra.button
        type="button"
        onClick={() => canSubmit && onSubmit()}
        disabled={!canSubmit}
        display="inline-flex"
        alignItems="center"
        gap="6px"
        fontFamily="mono"
        fontSize="13px"
        letterSpacing="1px"
        color={canSubmit ? "arch.brass" : "arch.mut"}
        background="transparent"
        border="0"
        px="5px"
        py="5px"
        whiteSpace="nowrap"
        cursor={canSubmit ? "pointer" : "default"}
        transition="background 0.15s"
        _hover={canSubmit ? { background: "arch.hov" } : {}}
        flexShrink={0}
      >
        {loading ? <LoadingView /> : null}
        [{submitLabel}]
      </chakra.button>
    </Flex>
  );
}
