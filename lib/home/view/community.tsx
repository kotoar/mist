"use client";

import { Box, Flex, chakra } from "@chakra-ui/react";
import { BracketLink } from "@lib/shared/components/archive/action";

/** 联络卡 · 边框内的求助文案 + 铜色联络方式(列表页复用)。 */
export function CommunityView() {
  return (
    <Box mt="40px" border="1px solid" borderColor="arch.rule" px="22px" py="18px">
      <chakra.p
        fontFamily="serif"
        fontSize="13.5px"
        color="arch.dim"
        lineHeight="1.9"
        m="0"
        whiteSpace="pre-line"
      >
        {`我们仍处于开发的早期阶段。\n任何问题、建议或者想要特定背景的剧本，请随时联系我们！`}
      </chakra.p>
      <Flex gap="18px" wrap="wrap" mt="12px">
        <BracketLink external href="https://xhslink.com/m/3keCJl9wtyp" fontSize="11.5px">
          小红书
        </BracketLink>
        <BracketLink external href="mailto:mistcase@deepclue.app" fontSize="11.5px">
          mistcase@deepclue.app
        </BracketLink>
      </Flex>
    </Box>
  );
}
