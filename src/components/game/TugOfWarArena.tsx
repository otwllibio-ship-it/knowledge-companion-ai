import tugOfWarGround from "@/assets/tug-of-war-ground.png";
import tugOfWarPlayers from "@/assets/tug-of-war-players-fixed.png";
import tugOfWarFlag from "@/assets/tug-of-war-flag.png";

type Props = {
  /** -100 (Takım 1 kazandı) .. 0 (merkez) .. +100 (Takım 2 kazandı) */
  ropePosition?: number;
  pulse?: 1 | 2 | null;
};

export function TugOfWarArena({ ropePosition = 0, pulse = null }: Props) {
  const clamped = Math.max(-100, Math.min(100, ropePosition));

  // Öğrenciler ve halat sabit durur; sadece bayrak halat boyunca kayar.
  // Çekiş anında (pulse) bayrak kısa bir ekstra itme alır.
  const flagOffset = clamped * 0.15 + (pulse === 1 ? -0.5 : pulse === 2 ? 0.5 : 0);

  return (
    <div className="relative w-full select-none overflow-hidden bg-panel">
      {/* Sabit katman 1: zemin asla hareket etmez */}
      <img
        src={tugOfWarGround}
        alt=""
        width={1584}
        height={672}
        draggable={false}
        className="block h-auto w-full"
      />

      {/* Sabit merkez çizgisi — zeminin üstünde, halat/bayrağın ALTINDA */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[8%] h-[84%] -translate-x-1/2"
          style={{
            width: "3px",
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--foreground) 0 10px, transparent 10px 20px)",
          }}
        />
      </div>

      {/* Sabit katman 2: öğrenciler ve halat — yeri asla değişmez */}
      <img
        src={tugOfWarPlayers}
        alt="Halatı çeken dört öğrenci"
        width={1584}
        height={672}
        draggable={false}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />

      {/* Hareketli katman: sadece bayrak halat boyunca kayar */}
      <img
        src={tugOfWarFlag}
        alt="Halatın ortasındaki kırmızı bayrak"
        draggable={false}
        className="pointer-events-none absolute"
        style={{
          left: "49.495%",
          top: "31.4%",
          width: "5.177%",
          transform: `translateX(${flagOffset}%)`,
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
