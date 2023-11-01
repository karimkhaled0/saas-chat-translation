"use client";
import {
  LanguageSupported,
  LanguageSupportedMap,
  useLanguageStore,
  useSubscriptionStore,
} from "@/store/store";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

type Props = {
  page: string;
};

const LanguageSelect = ({ page }: Props) => {
  const [language, setLanguage, getLanguages, getNotSupoortedLanguages] =
    useLanguageStore((state) => [
      state.language,
      state.setLanguage,
      state.getLanguages,
      state.getNotSupoortedLanguages,
    ]);

  const subscription = useSubscriptionStore((state) => state.subscription);
  const isPro =
    subscription?.role === "pro" && subscription?.status === "active";

  const pathName = usePathname();
  const isChatPage = pathName.includes(page);

  return (
    isChatPage && (
      <div className="my-5">
        <Select
          onValueChange={(value: LanguageSupported) => setLanguage(value)}
        >
          <SelectTrigger className="w-[150px] text-black dark:text-white">
            <SelectValue placeholder={LanguageSupportedMap[language]} />
          </SelectTrigger>
          <SelectContent>
            {subscription === undefined ? (
              <LoadingSpinner />
            ) : (
              <>
                {getLanguages(isPro).map((language) => (
                  <SelectItem key={language} value={language}>
                    {LanguageSupportedMap[language]}
                  </SelectItem>
                ))}
                {getNotSupoortedLanguages(isPro).map((language) => (
                  <Link href={"/register"} key={language} prefetch={false}>
                    <SelectItem
                      key={language}
                      value={language}
                      disabled
                      className="bg-gray-300/50 text-gray-500 dark:text-white py-2 my-1"
                    >
                      {LanguageSupportedMap[language]} (PRO)
                    </SelectItem>
                  </Link>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    )
  );
};

export default LanguageSelect;
