import { create } from "zustand";
import { Subscription } from "@/types/subscription";

export type LanguageSupported =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "hi"
  | "ja"
  | "la"
  | "ru"
  | "zh"
  | "ar";

export const LanguageSupportedMap: Record<LanguageSupported, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  hi: "Hindi",
  ja: "Japanese",
  la: "Latin",
  ru: "Russian",
  zh: "Mandarin",
  ar: "Arabic",
};

interface LanguageState {
  language: LanguageSupported;
  setLanguage: (language: LanguageSupported) => void;
  getLanguages: (isPro: boolean) => LanguageSupported[];
  getNotSupoortedLanguages: (isPro: boolean) => LanguageSupported[];
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",
  setLanguage: (language: LanguageSupported) => set({ language }),
  getLanguages: (isPro: boolean) => {
    const languages = Object.keys(LanguageSupportedMap) as LanguageSupported[];
    return isPro ? languages : languages.slice(0, 2);
  },
  getNotSupoortedLanguages: (isPro: boolean) => {
    const languages = Object.keys(LanguageSupportedMap) as LanguageSupported[];
    return isPro ? [] : languages.slice(2);
  },
}));

interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));
