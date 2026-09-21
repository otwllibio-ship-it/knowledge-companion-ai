import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { createRoom } from "@/lib/game.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Halat Yarışı — 2 Takımlı Türkçe Bilgi Yarışması" },
      {
        name: "description",
        content:
          "Sınıf için gerçek zamanlı halat çekme bilgi yarışması. QR kod ile katıl, doğru cevapla halatı takımına çek.",
      },
      { property: "og:title", content: "Halat Yarışı — 2 Takımlı Türkçe Bilgi Yarışması" },
      {
        property: "og:description",
        content: "QR kod ile katıl, doğru cevapla halatı kendi takımına çek.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const create = useServerFn(createRoom);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await create();
      void navigate({ to: "/host/$code", params: { code: res.code } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-2xl rounded-[var(--radius)] bg-panel p-8 text-center shadow-[var(--shadow-panel)] sm:p-14">
        <p className="text-xs font-semibold tracking-[0.35em] text-muted-foreground">
          SINIF YARIŞMASI
        </p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          HALAT YARIŞI
        </h1>
        <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-muted-foreground sm:text-base">
          2 TAKIM • TÜRKÇE BİLGİ YARIŞMASI
        </p>

        <Link
          to="/sorular"
          className="mt-10 block w-full rounded-2xl bg-foreground px-8 py-5 text-lg font-bold tracking-wide text-background transition-transform hover:scale-[1.01]"
        >
          1. SORULARI HAZIRLA
        </Link>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">
          Önce soru havuzunu oluştur, sonra yarışmaya geç.
        </p>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-4 w-full rounded-2xl border-2 border-border bg-panel px-8 py-4 text-base font-bold tracking-wide text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {loading ? "OLUŞTURULUYOR..." : "2. YARIŞMAYI BAŞLAT"}
        </button>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Oyuncu musunuz? Oda kodunu yazın
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABX729"
              className="flex-1 rounded-2xl border-2 border-border bg-background px-5 py-4 text-center text-xl font-bold tracking-[0.3em] outline-none focus:border-team1"
            />
            <button
              onClick={() => code.length >= 4 && navigate({ to: "/play/$code", params: { code } })}
              className="rounded-2xl bg-team1 px-6 py-4 text-base font-bold text-panel"
            >
              KATIL
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm font-semibold text-destructive">{error}</p>}
      </div>
    </main>
  );
}

