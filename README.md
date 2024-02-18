**TL:DR**; It’s hard and _important_ to learn machine learning and data science; we’re making it easier than ever.

## Inspiration

We’re students ranging in various levels of machine learning experience, but we all started the same way; working through infamous online courses and filling out starter code with lines we don’t understand.  Although we eventually were able to mature our understanding of machine learning, through ScratchML, we are changing the ML education paradigm from our shared experiences and struggles to creating a platform where kids can develop intuition on data analysis and machine learning that abstracts away the parts that make it difficult. Instead of “learning” by filling out lines of PyTorch code that aren’t self-evident, we want kids to start thinking about the richness of data around us, what it can be used for, and how to leverage models to infer things about the world around us. We are from the generation that was inspired by Scratch, where drag-and-drop code helped us to make toy games and develop our intuition to code even before we learned our first programming language. ScratchML aims to take a similar approach, creating a learning platform that's easy-to-use and develops our way of thinking and intuition behind the scenes. 

## What it does

Our platform is designed to teach machine learning and data analysis principles. The challenge is two-fold: making the learning fun and engaging while also providing a high-quality curriculum developed around experiential learning. ScratchML delivers on both aspects by providing a reliable drag-and-drop interface used just like Scratch for model development and data experimentation, and through engineered datasets where the student is guided through exploring the data and reporting findings, students will be much more engaged through trying out a bunch of different approaches to accomplish a mission.

Each lesson comes with a workspace, where students can drag-and-drop models and other blocks to create a no-code, data analysis pipeline. A personalized tutor system is designed to guide the learning process, offering explanations and tips to guide the learning process. This system leverages the Prediction Guard LLM API to provide real-time insights into user decisions and outcomes within lessons. It employs state management to ensure continuous progress while fostering a sandbox-style learning environment.

## How we built it

The tech stack for the project consisted of:
* React for the frontend, utilizing the Chakra UI component library and tailwindcss for styling.
* A Flask server that runs and trains models based on the layout specified by the user.
* We also used Intels extension for Scikit-learn/PyTorch to deliver faster training and inference time critical for making the user experience on the site seamless.
* Firebase database for storing user data and storage of models that can be evaluated on the fly.
* APIs: Prediction Guard LLM API to provide personalized real-time feedback using Neural-Chat-7B.
* Models: Scikit-learn and PyTorch
* Dev tools: Intel's Developer Cloud for constructing and testing the sandbox model, leveraging the PyTorch optimizations from Intel.

## Challenges we ran into

## Accomplishments that we're proud of

## What we learned

## What's next for ScratchML
