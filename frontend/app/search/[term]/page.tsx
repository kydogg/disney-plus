import AISuggestion from "@/components/AISuggestion";
import MoviesCarousel from "@/components/MoviesCarousel";
import { getPopularMovies, getSearchedMovies } from "@/lib/getMovies";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		term: string;
	}>;
};

async function SearchPage({ params }: Props) {
	const { term } = await params;
	if (!term) notFound();

	const termToUse = decodeURI(term);
	// TODO: Api call to get the searched movies
	const movies = await getSearchedMovies(termToUse);
	const popularMovies = await getPopularMovies();
	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex flex-col space-y-4 mt-32 xl:mt-42 ">
				<h1 className="text-6xl font-bold px-10"> Results for {termToUse}</h1>
				<AISuggestion term={termToUse} />

				<MoviesCarousel title="Movies" movies={movies} isVertical />
				<MoviesCarousel
					title="You may also like"
					isVertical
					movies={popularMovies}
				/>
			</div>
		</div>
	);
}

export default SearchPage;
