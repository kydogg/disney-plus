"use client";

import { notFound } from "next/navigation";
import { use } from "react";

type Props = {
	params: Promise<{
		term: string;
	}>;
};

function SearchPage({ params }: Props) {
	const { term } = use(params);
	if (!term) notFound();
	const termToUse = decodeURI(term);

	// TODO: Api call to get the searched movies
	// TODO: API call to get the Popular Movies
	return <div>Welcome to the search page: {termToUse}</div>;
}

export default SearchPage;
