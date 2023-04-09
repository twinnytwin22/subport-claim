import "server-only";
import React from "react";

export const revalidate = 0;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className=" bg-white dark:bg-slate-900">
      

    {children}
      </body>
    </html>
  );
}
