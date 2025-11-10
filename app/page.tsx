"use client";

import { ListView } from "@/lib/client/view/list";
import { listViewModel } from "@/lib/client/viewmodel/list";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    listViewModel.fetch();
  }, []);

  return (
    <ListView />
  );
}
