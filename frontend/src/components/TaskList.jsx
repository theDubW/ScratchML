import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button, 
    useDisclosure, 
    CircularProgress
} from '@chakra-ui/react'
import { IoMdMenu } from "react-icons/io";
import {Link} from 'react-router-dom';

const TaskList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div className="">
        <Button colorScheme='blackAlpha' leftIcon={<IoMdMenu />} onClick={onOpen} className="font-lilitaOne absolute left-0 top-0 z-10 m-2 border-white border-2 border-b-4 font-indieFlower">
            See tasks
        </Button>
        <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size={'md'}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader className='justify-between font-lilitaOne'>Tasks <DrawerCloseButton/></DrawerHeader>
                <DrawerBody>
                <Accordion allowToggle >
            <AccordionItem className="mb-2 border-blue-800 border-2 border-b-4 rounded font-lilitaOne">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        <CircularProgress value={100} size='25px' className="mr-2" color="green.400"/>
                        <Link to="/lessonOne" className="hover:underline">Lesson One: Sample Size</Link>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel className="pb-4">
                In this lesson you'll learn why talking to more friends, or having a bigger group, helps us make better guesses about the whole town. It's like taking a peek at more ice cream preferences to discover the real favorites!                </AccordionPanel>
            </AccordionItem>

            <AccordionItem className="mb-2 border-2 border-blue-800 border-b-4 rounded font-lilitaOne">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        <CircularProgress value={100} size='25px' className="mr-2" color="green.400"/>
                            Lesson Two: something
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel className="pb-4">
                Classification is the task of “classifying things” into sub-categories. Classification is part of supervised machine learning in which we put labeled data for training.
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem className="mb-2 border-2 border-blue-800 border-b-4 rounded font-lilitaOne">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        <CircularProgress value={65} size='25px' className="mr-2"/>
                            Clustering
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel className="pb-4">
                Clustering is the task of dividing the population or data points into a number of groups such that data points in the same groups are more similar to other data points in the same group and dissimilar to the data points in other groups. It is basically a collection of objects on the basis of similarity and dissimilarity between them. 
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
        </div>
    )
};

export default TaskList;