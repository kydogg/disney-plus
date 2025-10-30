import Image from "next/image";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";

function Header() {
	return (
		<header>
			<Link href="/home">
				<Image
					src="https://links.papareact.com/a943ae"
					alt=""
					width={120}
					height={100}
					className="cursor-pointer invert"
				/>
			</Link>

			<div className="flex space-x-2">
				{/* GenreDropdown */}

				{/* SearchInput */}

				<ThemeToggler />
			</div>
		</header>
	);
}

export default Header;
