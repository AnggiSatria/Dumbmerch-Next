import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/lib/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dumbmerch",
  description: "Dumbmerch Web App",
   icons: {
    icon: "/Frame.png", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen lg:min-h-[720px] bg-[#0a0a0a]`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
