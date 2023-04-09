import "server-only";
import React from "react";
import '../styles/global.css';


export const revalidate = 0;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className=" bg-white dark:bg-zinc-900">
    {children}
      </body>
    </html>
  );
}
