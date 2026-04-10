import type { Metadata, Viewport } from "next";
import "./styles/app.scss";
import "./styles/header.scss";
import "./styles/footer.scss";
import "./styles/home.scss";
import "./styles/market.scss";
import "./styles/winninganimation.scss";
import "./styles/profile.scss";
import "./styles/modals.scss";
import "./styles/exploredetail.scss";
import "./styles/comments.scss";
import { ToastContainer } from "react-toastify";
import Web3Provider from "@/app/providers/Web3Provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Speed Markets — Fast Crypto Predictions",
    template: "%s | Speed Markets",
  },
  description:
    "Make fast predictions on crypto price movements. Win 2x your stake in minutes with Speed Markets.",
  authors: [{ name: "Speed Markets" }],
  creator: "Speed Markets",
  metadataBase: new URL("https://dev-speedmarket.rain.one"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dev-speedmarket.rain.one",
    siteName: "Speed Markets",
    title: "Speed Markets — Fast Crypto Predictions",
    description:
      "Make fast predictions on crypto price movements. Win 2x your stake in minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Speed Markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speed Markets — Fast Crypto Predictions",
    description:
      "Make fast predictions on crypto price movements. Win 2x your stake in minutes.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
        {children}
        </Web3Provider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          toastClassName="custom-toast"
        />
      </body>
    </html>
  );
}