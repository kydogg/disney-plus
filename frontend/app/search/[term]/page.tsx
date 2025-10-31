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
	// TODO: API call to get the Popular Movies
	return <div>Welcome to the search page: {termToUse}</div>;
}

export default SearchPage;
