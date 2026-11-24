"use client";
import dynamic from "next/dynamic";

// WebGL only runs in the browser.
export const BackdropLoader = dynamic(() => import("./Backdrop"), { ssr: false });
