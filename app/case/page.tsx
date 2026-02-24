"use client";

import { ListView } from "@lib/home/view/list";
import { listViewModel } from "@lib/home/viewmodel";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    listViewModel.fetch("case");
  }, []);

  return (
    <ListView type="case" />
  );
}