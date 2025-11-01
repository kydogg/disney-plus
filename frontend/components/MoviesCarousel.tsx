"use client";
import { Movie } from "@/typings";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";

type Props = {
	title?: string;
	movies: Movie[];
	isVertical?: boolean;
};

function MoviesCarousel({ title, movies, isVertical }: Props) {
	return (
		<div className="z-50">
			<h2>{title}</h2>

			<div
				className={cn(
					"flex space-x-4 overflow-scroll px-5 py-5 scrollbar-hide"
				)}
			>
				{movies?.map((movie) => (
					<MovieCard key={movie.id} movie={movie} />
				))}
			</div>
		</div>
	);
}

export default MoviesCarousel;
