"use client";

import { Box } from "@chakra-ui/react";
import type { SystemStyleObject } from "@chakra-ui/react";
import Markdown from "react-markdown";

/**
 * 档案体例的 Markdown 渲染: 衬线正文、墨色粗体、等宽全大写分节标头、
 * 左线明细列表。用于案卷正文 / 结局故事 / 讯问回答等。
 */
const proseCss: SystemStyleObject = {
  fontFamily: "serif",
  color: "arch.dim",
  lineHeight: "1.95",
  "& h1": {
    fontFamily: "serif",
    fontWeight: "900",
    fontSize: "clamp(24px,2.6vw,32px)",
    letterSpacing: "2px",
    color: "arch.ink",
    margin: "0 0 14px",
  },
  "& h2": {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: "19px",
    letterSpacing: "1.5px",
    color: "arch.ink",
    margin: "24px 0 12px",
  },
  "& h3": {
    fontFamily: "mono",
    fontSize: "12px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "arch.mut",
    margin: "24px 0 10px",
    paddingTop: "16px",
    borderTop: "1px solid",
    borderColor: "arch.ruleSoft",
  },
  "& h4, & h5, & h6": {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: "15.5px",
    color: "arch.ink",
    margin: "18px 0 8px",
  },
  "& p": {
    fontFamily: "serif",
    fontSize: "15px",
    lineHeight: "1.95",
    color: "arch.dim",
    margin: "0 0 12px",
  },
  "& strong, & b": { color: "arch.ink", fontWeight: "700" },
  "& em": { fontStyle: "italic" },
  "& a": {
    color: "arch.brass",
    textDecoration: "none",
    _hover: { background: "arch.hov" },
  },
  "& ul, & ol": {
    listStyle: "none",
    margin: "0 0 12px",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  "& li": {
    fontFamily: "serif",
    fontSize: "14.5px",
    lineHeight: "1.9",
    color: "arch.dim",
    padding: "4px 0 4px 14px",
    borderLeft: "2px solid",
    borderColor: "arch.rule",
  },
  "& li > strong:first-of-type, & li > b:first-of-type": { color: "arch.ink" },
  "& blockquote": {
    borderLeft: "2px solid",
    borderColor: "arch.rule",
    paddingLeft: "16px",
    margin: "0 0 14px",
    color: "arch.dim",
    fontStyle: "normal",
  },
  "& hr": {
    border: "0",
    borderTop: "1px solid",
    borderColor: "arch.rule",
    margin: "22px 0",
  },
  "& code": {
    fontFamily: "mono",
    fontSize: "0.9em",
    background: "arch.hov",
    padding: "1px 5px",
  },
  "& pre": {
    fontFamily: "mono",
    fontSize: "13px",
    background: "arch.panel",
    border: "1px solid",
    borderColor: "arch.rule",
    padding: "12px 14px",
    overflowX: "auto",
    margin: "0 0 14px",
  },
  "& pre code": { background: "transparent", padding: "0" },
  "& img": { maxWidth: "100%", height: "auto" },
  "& table": { borderCollapse: "collapse", width: "100%", margin: "0 0 14px" },
  "& th, & td": {
    border: "1px solid",
    borderColor: "arch.rule",
    padding: "7px 10px",
    fontFamily: "sans",
    fontSize: "13.5px",
    textAlign: "left",
  },
  "& th": { color: "arch.ink", fontWeight: "600" },
};

export function ArchiveMarkdown({ children }: { children?: string }) {
  return (
    <Box css={proseCss}>
      <Markdown>{children ?? ""}</Markdown>
    </Box>
  );
}
