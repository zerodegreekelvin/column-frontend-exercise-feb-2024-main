import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './db'; // Import this line to use the Firestore database connection
import { Text, Spinner, Flex, Box, Stack, Input } from '@chakra-ui/react'
import { collection, query, orderBy, getDocs, limit, where } from 'firebase/firestore'
import Notices from './components/Notices';
function App() {
	const [notices, setNotices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
  	const [word, setWord] = useState('');
	useEffect(() => {
	const fetchNotices = async () => {
		setLoading(true);
		try {
			const noticesRef = collection(db, 'notices');
			//firebase has a builtin pagination
			let q = query(noticesRef, orderBy('publicationDate', 'desc'), limit(10));
			if (searchTerm) {
				q = query(noticesRef, where('title', '==', searchTerm), orderBy('publicationDate', 'desc'));
			}
			const querySnapshot = await getDocs(q);
			console.log('querySnapshot', querySnapshot)
			const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setNotices(data);
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};
	fetchNotices();
	}, [searchTerm]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setSearchTerm(word)
		}, 500);
			return () => clearTimeout(timeout)
		}, [word])
		const handleSearch = (event) => {
		setLoading(true);
		setWord(event.target.value)
	}
  if (error) return <div>There has been an error please try again later</div>;
  return (
    <Flex className="container">
		<Box>
			<Stack className="search-container" direction='row'>
				<Input
					type="text"
					placeholder="Search by title..."
					value={word}
					onChange={handleSearch}
				/>
			</Stack>
			{loading && <Spinner data-testid="loading-spinner"/>}
			{!loading && notices.length === 0 &&
			<Text>Looks like there's no notices</Text>
			}
			{!loading && notices.length > 0 &&
			<Notices notices={notices}/>}
		</Box>
	</Flex>
  );
}

export default App;
