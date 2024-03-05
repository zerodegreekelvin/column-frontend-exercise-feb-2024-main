import React, { useState } from 'react';
import { Input, Button, Heading, Textarea} from '@chakra-ui/react'
import { db } from '../db';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
const Sidebar = ({isAddingNewNotice}) => {
    const [newNotice, setNewNotice] = useState({ title: '', publicationDate: '', content: '' });

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			let updatedNotice = {...newNotice, publicationDate: Timestamp.fromMillis(new Date(newNotice.publicationDate).getTime())}
			const docRef = await addDoc(collection(db, 'notices'), updatedNotice);
            isAddingNewNotice(true);
			setNewNotice({ title: '', publicationDate: '', content: '' });
            
		} catch (error) {
			console.error('Error adding document: ', error);
		}
	};
	return (
	<div>
		<Heading size='md' paddingBottom='10'>
			Add New Notice
		</Heading>
		<form onSubmit={handleFormSubmit}>
			<Input
				type="text"
				placeholder="Title"
				value={newNotice.title}
                data-testId='Title'
				onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
			/>
			<Input
				type="date"
				value={newNotice.publicationDate}
                data-testId="Date"
				onChange={(e) => setNewNotice({ ...newNotice, publicationDate: e.target.value })}
			/>
			<Textarea
				type="text"
				placeholder="Content"
                data-TestId='Content'
				value={newNotice.content}
				onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
			/>
			<Button type="submit">Add Notice</Button>
		</form>
	</div>
	);
}

export default Sidebar;