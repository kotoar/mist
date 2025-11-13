import { Provider } from "@/lib/components/ui/provider";
import { ClientOnly } from "@chakra-ui/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迷雾档案",
  description: "迷雾档案: 侦探们的摸鱼神器",
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
