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

	return (
		<div>
			Welcome to the genre with ID: {id} and name: {genre}
		</div>
	);
}

export default GenrePage;
