"use client";

import { notFound } from "next/navigation";

type Props = {
	params: {
		term: string;
	};
};

function SearchPage({ params: { term } }: Props) {
	if (!term) notFound();
	const termToUse = decodeURI(term);

	// TODO: Api call to get the searched movies
	// TODO: API call to get the Popular Movies
	return <div>Welcome to the search page: {term}</div>;
}

export default SearchPage;
