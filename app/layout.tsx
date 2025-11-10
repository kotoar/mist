import { Provider } from "@/lib/components/ui/provider";
import { ClientOnly } from "@chakra-ui/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迷你推理 Demo",
  description: "迷你推理: 一个迷你的 AI 推理游戏。",
  icons: {
    icon: "/icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <ClientOnly>
          <Provider>
            {children}
          </Provider>
        </ClientOnly>
      </body>
    </html>
  );
}
