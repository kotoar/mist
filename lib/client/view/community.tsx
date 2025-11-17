import { Wrap, Button, Icon, Blockquote, VStack, Text } from "@chakra-ui/react";
import { FaEnvelope } from "react-icons/fa";
import { SiXiaohongshu } from "react-icons/si";

export function CommunityView() {
  return (
    <VStack align="stretch" gap={4}>
      <Blockquote.Root>
        <Blockquote.Content>
          <VStack gap="10px">
            <Text fontSize="sm" whiteSpace="pre-wrap">
              我们仍处于开发的早期阶段。
              如果您有任何问题、建议或只是想聊天，请随时联系我们！
            </Text>
            <ContactDetailsView />
          </VStack>
        </Blockquote.Content>
      </Blockquote.Root>
    </VStack>
  );
}

function ContactDetailsView() {
  return (
    <Wrap width="full" justify="start" gap={4}>
      <Button
          size={{ md: "sm", base: "xs" }}
          variant="outline"
          onClick={() => window.open('https://xhslink.com/m/3keCJl9wtyp', '_blank', 'noopener,noreferrer')}
        >
          <Icon as={SiXiaohongshu } />
          小红书
        </Button>
      <Button
        size={{ md: "sm", base: "xs" }}
        variant="outline"
        onClick={() => window.open('mailto:mistcase@deepclue.app', '_blank', 'noopener,noreferrer')}
      >
        <Icon as={FaEnvelope} />
        mistcase@deepclue.app
      </Button>
    </Wrap>
  );
}
