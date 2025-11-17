import { Provider } from "@/lib/components/ui/provider";
import { ClientOnly } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "迷雾档案",
  description: "迷雾档案: 侦探们的摸鱼神器",
  keywords: ["迷雾档案", "侦探游戏", "推理", "解谜"],
  authors: [{ name: "DeepClue", url: "https://deepclue.app" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "迷雾档案",
    description: "迷雾档案: 侦探们的摸鱼神器",
    url: "https://mistcase.app",
    siteName: "迷雾档案"
  }
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientOnly>
          <Provider>
            {children}
          </Provider>
        </ClientOnly>
        <Analytics />
      </body>
    </html>
  );
}
