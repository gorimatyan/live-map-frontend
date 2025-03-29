import { Metadata } from "next"
import { GuideSections } from "@/components/Guide/GuideSections"

export const metadata: Metadata = {
  title: "福岡の地域情報をリアルタイムで | ライブマップ.NET",
  description:
    "福岡の最新ニュース・事件・火災・救急情報をリアルタイムでお届け。地図上で簡単に地域の出来事をチェック。初めての方でも分かりやすい無料サービスです。",
}

export default function GuidePage() {
  return <GuideSections />
}
