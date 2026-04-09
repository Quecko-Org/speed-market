import type { Metadata } from "next";

interface SharePageProps {
  searchParams: Promise<Record<string, string>>;
}

function decodeShareData(d?: string): Record<string, string> {
  if (!d) return {};
  try {
    return JSON.parse(Buffer.from(d, "base64").toString("utf-8"));
  } catch {
    return {};
  }
}

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const params = rawParams.d ? decodeShareData(rawParams.d) : rawParams;

  const symbol = params.symbol ?? "BTC";
  const betType = params.betType ?? "UP";
  const result = params.result ?? "WIN";
  const earned = params.earned ?? "0";
  const amount = params.amount ?? "0";

  const title = `${result === "WIN" ? "Won" : "Lost"} $${earned} on ${symbol}/USDT | Rain Speed Markets`;
  const description = `${betType} prediction of $${amount} on ${symbol}/USDT. Trade on Rain Speed Markets!`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dev-speedmarket.rain.one";
  const ogParams = new URLSearchParams(params).toString();
  const ogImageUrl = `${baseUrl}/api/og?${ogParams}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Rain Speed Markets",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const rawParams = await searchParams;
  const params = rawParams.d ? decodeShareData(rawParams.d) : rawParams;

  const symbol = params.symbol ?? "BTC";
  const result = params.result ?? "WIN";
  const earned = params.earned ?? "0";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1B1C31", color: "#fff", fontFamily: "sans-serif", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Rain Speed Markets</h1>
      <p style={{ color: "#74728B", margin: 0 }}>
        {result === "WIN" ? "Won" : "Lost"} ${earned} on {symbol}/USDT
      </p>
      <a href="/" style={{ color: "#EC8711", fontSize: 16, textDecoration: "none", marginTop: 8 }}>
        Go to Rain Speed Markets →
      </a>
    </div>
  );
}
