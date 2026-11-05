"use client";

import { createContext, useContext } from "react";

/** Nomor cadangan kalau API belum sempat merespons (nomor lama R Clean Shoes) */
export const DEFAULT_WA = "6285218221931";

/**
 * Context nomor WhatsApp admin.
 * Diisi sekali dari src/app/page.tsx (fetch /api/services), dipakai semua
 * komponen yang punya tombol chat: header, footer, FAQ, form pesan.
 */
export const WaContext = createContext<string>(DEFAULT_WA);

export const useWaNumber = () => useContext(WaContext);