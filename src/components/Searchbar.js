import { Stack, Input, Radio, RadioGroup } from '@chakra-ui/react'


const Searchbar = ({setStartDate, setEndDate, setSearchMethod, word, startDate, endDate, searchMethod, setLoading, setWord }) => {
	const handleSearchMethod = (event) => {
		setSearchMethod(event.target.value);
		if(event.target.value === 'title') {
			setStartDate(null);
			setEndDate(null);
		}
	}
	const handleSearch = (event) => {
		setLoading(true);
		setWord(event.target.value)
	}
    return (
        <Stack className="search-container" direction='row'>
			<RadioGroup display='flex' defaultValue='title' paddingLeft='5'>
				<Stack spacing={5} direction='row'>
					<Radio colorScheme='red' value='title' onChange={handleSearchMethod}>
						Title
					</Radio>
					<Radio colorScheme='green' value='date' onChange={handleSearchMethod}>
						Date
					</Radio>
				</Stack>
			</RadioGroup>
			{searchMethod === 'title' ?<Input
				type="text"
				placeholder="Search by title..."
				data-testId='searchTitle'
				value={word}
				onChange={handleSearch}
			/> :
			<Stack direction='row'>
				<Input
					type="date"
					data-testId='startDate'
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
				/>
				<Input
					type="date"
					data-testId='endDate'
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
				/>
			</Stack>}
		</Stack>
    )
}
export default Searchbar;