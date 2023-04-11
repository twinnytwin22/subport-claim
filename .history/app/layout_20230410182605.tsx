import React from "react";
import '../styles/global.css';
import Providers from "../lib/providers";


export const revalidate = 0;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="bg-black">
        <Providers>
    {children}
    </Providers>
      </body>
    </html>
  );
}
