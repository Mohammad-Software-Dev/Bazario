import { useTranslation } from "react-i18next";

export function SponsoredBadge() {
  const { t } = useTranslation();

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-700">
      {t("ads.sponsored")}
    </span>
  );
}
