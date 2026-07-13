import { Provider } from "@lib/shared/components/ui/provider";
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
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
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
