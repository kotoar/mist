"use client";

import { HomeView } from "@/lib/client/view/list/list";
import { listViewModel } from "@/lib/client/viewmodel/list";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    listViewModel.fetch();
  }, []);

  return (
    <HomeView />
  );
}
