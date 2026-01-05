"use client";

import { Button, Container, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NewsLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <Container maxW="container.md" paddingY={8}>
      {children}
      <Link href="/">
        <Button variant="ghost">
          <Icon as={FaArrowLeft} size="sm" />
          返回首页
        </Button>
      </Link>
    </Container>
  );
}