import MoviesCarousel from "@/components/MoviesCarousel";
import {
	getPopularMovies,
	getTopRatedMovies,
	getUpComingMovies,
} from "@/lib/getMovies";

export default async function Home() {
	const upcomingMovies = await getUpComingMovies();
	const topRatedMovies = await getTopRatedMovies();
	const popularMovies = await getPopularMovies();
	return (
		<main className="">
			{/* TODO: Carousel banner */}
			<div className="flex flex-column space-y-2 xl:-mt-48">
				<MoviesCarousel movies={upcomingMovies} title="Upcoming..." />
				<MoviesCarousel movies={topRatedMovies} title="Top Rated..." />
				<MoviesCarousel movies={popularMovies} title="Popular..." />
			</div>
		</main>
	);
}
