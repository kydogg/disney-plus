import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvder } from "@/components/ThemeProvider";

export const metadata: Metadata = {
	title: "Disney Plus Clone",
	description: "A streaming platform clone built with Next.js",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-white dark:bg-[#1A1C29]">
				<ThemeProvder
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					{children}
				</ThemeProvder>
			</body>
		</html>
	);
}
