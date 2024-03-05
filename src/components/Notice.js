import { Box, Text } from '@chakra-ui/react'

const Notice = ({notice}) => {
    return (
        <Box key={notice.id}>
			<Text size='xs' fontSize='medium'>
				{notice.title}
			</Text>
			<Text pt='2' fontSize='sm'>
				{new Date(notice.publicationDate.seconds* 1000).toUTCString()}
			</Text>
			<Text pt='2' fontSize='sm'>
				{notice.content}
			</Text>
		</Box>
    )
}
export default Notice;