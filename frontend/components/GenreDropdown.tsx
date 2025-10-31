import { Genres } from "@/typings";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

async function GenreDropdown() {
	// Return null if API key is not available (e.g., in CI environment)
	if (!process.env.TMDB_API_KEY) {
		return null;
	}

	const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
	const options: RequestInit = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
		},
		next: {
			revalidate: 60 * 60 * 24, // 24 hours
		},
	};

	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			console.error(`Failed to fetch genres: ${response.status} ${response.statusText}`);
			return null;
		}

		const data = (await response.json()) as Genres;

		return (
			<DropdownMenu>
				<DropdownMenuTrigger className="text-white flex justify-center items-center">
					Genre <ChevronDown className="ml-1" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Select a Genre</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{data.genres.map((genre) => (
						<DropdownMenuItem key={genre.id}>
							<Link href={`/genre/${genre.id}?genre=${genre.name}`}>
								{genre.name}
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	} catch (error) {
		console.error("Error fetching genres:", error);
		return null;
	}
}

export default GenreDropdown;
