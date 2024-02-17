import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from '@chakra-ui/react'

const TaskList = () => {

    return (
        <div className="basis-2/5 h-full border-2 rounded m-2">
        <Accordion allowToggle >
            <AccordionItem className="m-2 border rounded">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                            Regression
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel className="pb-4">
                Regression is a statistical approach used to analyze the relationship between a dependent variable (target variable) and one or more independent variables (predictor variables). The objective is to determine the most suitable function that characterizes the connection between these variables.
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem className="m-2 border rounded">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                            Classification
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel className="pb-4">
                Classification is the task of “classifying things” into sub-categories. Classification is part of supervised machine learning in which we put labeled data for training.
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem className="m-2 border rounded">
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
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
        </div>
    )
};

export default TaskList;