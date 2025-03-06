import { AppleMap } from "@/components/AppleMap/AppleMap";

export default function Home() {
  return (
    <div className="p-2 w-full h-[90dvh]">
      <h1 className="text-2xl font-bold">福岡県</h1>
      {/* <Link href="/fukuokashi" className="text-xl font-bold">福岡市を見る</Link> */}
      <AppleMap />
    </div>
  );
}
