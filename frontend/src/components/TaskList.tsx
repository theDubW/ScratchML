import React, { FC } from 'react';
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

interface TaskProps {
    title: string;
    description: string;
    completion: number;
}

const Task: FC<TaskProps> = ({title, description, completion}) => {
    return (
    <AccordionItem className="mb-2 border-blue-800 border-2 border-b-4 rounded font-lilitaOne">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        <CircularProgress value={completion} size='25px' className="mr-2" color="green.400"/>
                        <Link to="/lessonOne" className="hover:underline">{title}</Link>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel className="pb-4">
                {description} 
                </AccordionPanel>
           </AccordionItem>
    )
}

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
                    <Task title={"Lesson One: Sample Size"}
                    completion={100}
                    description={"In this lesson you'll learn why talking to more friends, or having a bigger group, helps us make better guesses about the whole town. It's like taking a peek at more ice cream preferences to discover the real favorites!"}/>

                    <Task title={"Lesson Two: Feature Selection"}
                    completion={100}
                    description={"Explore the process of identifying the most relevant features for training machine learning models, enhancing model performace, and reducing complexity."}
                    />

                    <Task title={"Lesson Three: Data Preprocessing"}
                    completion={100}
                    description={"Understand the steps needed to clean and prepare data for machine learning, including handling missing values, normalization, and data encoding."}/>

                    <Task title={"Lesson Four: Model Types"}
                    completion={40}
                    description={"Get introduced to different types of machine learning models (e.g., linear regression, decision trees, neural networks) and their appropriate use cases."}/>

                    <Task title={"Lesson Five: Model Evaluation"}
                    completion={0}
                    description={"Discover how to assess the performance of machine learning models using metrics like accuracy, precision, recall, and the confusion matrix."}/>
        
                    <Task title={"Lesson Six: Overfitting and Underfitting:"}
                    completion={0}
                    description={"Learn about the challenges of overfitting and underfitting, including strategies to balance model complexity and training data size for optimal performance."}/>

                    <Task title={"Lesson Seven: Cross-validation"} completion={0}
                    description={"Explore cross-validation techniques to ensure a model's performance is reliable and will generalize well to unseen data."}/>

                    <Task title={"Lesson Eight: Hyperparameter Tuning"} completion={0}
                    description={"Understand how to optimize model parameters to improve performance and the use of techniques like grid search and random search."}/>

                    <Task title={"Lesson Nine: Ensemble Methods"}   completion={0}
                    description={"Learn about combining multiple models to improve predictions, including methods like bagging, boosting, and stacking."}/>

                    <Task title={"Lesson Ten: Introduction to Deep Learning"} completion={0}
                    description={"Get a basic understanding of deep learning and neural networks, including the architecture of a simple neural network."}/>

                    <Task title={"Lesson Eleven: Convolutional Neural Networks (CNNs)"} completion={0}
                    description={"Explore the basics of CNNs and their use in image recognition and processing tasks."}/>

                    <Task title={"Lesson Twelve: Recurrent Neural Networks (RNNs)"} completion={0}
                    description={"Learn about RNNs and their applications in sequence analysis, such as natural language processing and time series forecasting."}/>

                    <Task title={"Lesson Thirteen: Unsupervised Learning"} completion={0}
                    description={"Understand unsupervised learning techniques, including clustering and dimensionality reduction, and their use cases."}/>

                    <Task title={"Lesson Fourteen: Reinforcement Learning"}    completion={0}
                    description={"Get introduced to the fundamentals of reinforcement learning, where models learn to make decisions through trial and error."}/>

                    <Task title={"Lesson FIfteen: Ethics in AI"} completion={0}
                    description={"Discuss the ethical considerations in AI and machine learning, including bias, fairness, and the impact of AI technologies on society."}/>   
        </Accordion>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
        </div>
    )
};

export default TaskList;