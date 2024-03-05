import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './db'; // Import this line to use the Firestore database connection
import { Text, Spinner, Flex, Box, Stack, Button } from '@chakra-ui/react'
import { collection, query, orderBy, getDocs, limit, where, startAfter, endBefore, Timestamp } from 'firebase/firestore'
import Notices from './components/Notices';
import Sidebar from './components/Sidebar';
import Searchbar from './components/Searchbar'
function App() {
	const [notices, setNotices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [pageDirection, setPageDirection] = useState('');
  	const [word, setWord] = useState('');
	const [addNewNotice, isAddingNewNotice] = useState(false);
	const [searchMethod, setSearchMethod] = useState('title');
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	useEffect(() => {
		const fetchNotices = async () => {
			setLoading(true);
			try {
				const noticesRef = collection(db, 'notices');
				//firebase has a builtin pagination
				let q;
				if (startDate && endDate) {
					console.log('inside second')
					q = query(
						noticesRef,
						where('publicationDate', '>=', Timestamp.fromMillis(new Date(startDate).getTime())),
						where('publicationDate', '<=', Timestamp.fromMillis(new Date(endDate).getTime())),
						orderBy('publicationDate', 'desc')
					);

				}
				else if(currentPage === 1 || addNewNotice) {
					console.log('inside first')
					console.log('addNewNotice', addNewNotice)
					q = query(noticesRef, orderBy('publicationDate', 'desc'), limit(10));
				}
				
				else if (pageDirection === 'next') {
					console.log('inside third')
					const lastNotice = notices[notices.length - 1];
					q = query(noticesRef, orderBy('publicationDate', 'desc'), startAfter(lastNotice.publicationDate), limit(10));
				}
				else {
					console.log('inside inside fourth')
					const firstNotice = notices[0];
					q = query(noticesRef, orderBy('publicationDate', 'desc'), endBefore(firstNotice.publicationDate), limit(10));
				}
				if (searchTerm) {
					console.log('inside fifth')
					q = query(noticesRef, where('title', '==', searchTerm), orderBy('publicationDate', 'desc'));
				}
				const querySnapshot = await getDocs(q);
				const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				console.log(data);
				setNotices(data);
				setLoading(false);
				isAddingNewNotice(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		fetchNotices();
	}, [searchTerm, currentPage, pageDirection, addNewNotice, endDate, startDate]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setSearchTerm(word)
		}, 500);
			return () => clearTimeout(timeout)
	}, [word])
	const handlePagination = direction => {
		if (direction === 'prev' && currentPage > 1) {
		  setPageDirection('prev');
		  setCurrentPage(prevPage => prevPage - 1);
		} else if (direction === 'next') {
		  setPageDirection('next');
		  setCurrentPage(prevPage => prevPage + 1);
		}
	};
  	if (error) return <div>There has been an error please try again later</div>;
  	return (
		<Flex className="container">
			<Box className='sidebar-container' width='25%' pt='10' paddingLeft='10px'>
				<Sidebar isAddingNewNotice={isAddingNewNotice} />
			</Box>
			<Box width='75%'>
				<Searchbar setStartDate={setStartDate} setEndDate={setEndDate} setSearchMethod={setSearchMethod} word={word} startDate={startDate} endDate={endDate} searchMethod={searchMethod} setLoading={setLoading} setWord={setWord} />
				{loading && <Spinner data-testid="loading-spinner"/>}
				{!loading && notices.length === 0 &&
				<Text>Looks like there's no notices</Text>
				}
				{!loading && notices.length > 0 &&
				<Notices notices={notices}/>}
				<Stack direction='row'>
					<Button data-testId='previous-button' onClick={() => handlePagination('prev')} isDisabled={currentPage === 1}>
						Prev
					</Button>
					<Text pt='2' fontSize='sm'>{`Page ${currentPage}`}</Text>
					<Button data-testId='next-button' onClick={() => handlePagination('next')} isDisabled={notices.length<10}>
						Next
					</Button >
				</Stack>
			</Box>
		</Flex>
  	);
}

export default App;
