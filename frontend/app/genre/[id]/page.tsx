import MoviesCarousel from "@/components/MoviesCarousel";
import { getDiscoverMovies } from "@/lib/getMovies";

type Props = {
	params: Promise<{
		id: string;
	}>;

	searchParams: Promise<{
		genre: string;
	}>;
};

async function GenrePage({ params, searchParams }: Props) {
	const { id } = await params;
	const { genre } = await searchParams;
	const movies = await getDiscoverMovies(id);

	return (
		<div className="max-w-7xl mx-auto">
			{/* //TODO: AI OPEN AI azure suggestion */}

			<div className="flex flex-col space-y-5 mt-32 xl:mt-42">
				<h1 className="text-6xl font-bold px-10">Results for {genre}</h1>
			</div>
			<MoviesCarousel title={`Genre`} movies={movies} isVertical />
		</div>
	);
}

export default GenrePage;
