"use client";

import { ListView } from "@client/view/list/list";
import { listViewModel } from "@client/viewmodel/list";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    listViewModel.fetch("mist");
  }, []);

  return (
    <ListView type="mist" />
  );
}