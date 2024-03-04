import { Stack, Card, CardHeader, CardBody, Input,Heading, StackDivider } from '@chakra-ui/react'
import Notice from './Notice';
const Notices = ({notices}) => {
    return (
        <Card>
          <CardHeader>
            <Heading size='md'>Public Notices</Heading>
          </CardHeader>
          <CardBody>
            <Stack className="notice-list" divider={<StackDivider />} spacing='4'>
            {
              notices.map(notice => (
                <Notice key={notice.id} notice={notice}/>
              ))
            }
          </Stack>
          </CardBody>  
        </Card>
    )
}

export default Notices;