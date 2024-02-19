TL:DR; It’s hard and important to learn machine learning and data science; we’re making it easier than ever.

## Inspiration

We’re students ranging in various levels of machine learning experience, but we all started the same way; working through infamous online courses and filling out starter code with lines we don’t understand. Although we eventually were able to mature our understanding of machine learning, through ScratchML, we are changing the ML education paradigm from our shared experiences and struggles to creating a platform where kids can develop intuition on data analysis and machine learning that abstracts away the parts that make it difficult. Instead of “learning” by filling out lines of pytorch code that aren’t self evident, we want kids to start thinking about the richness of data around us, what it can be used for, and how to leverage models to infer things about the world around us. We are from the generation that was inspired by Scratch, where drag-and-drop code helped us to make toy games and develop our intuition to code even before we learned our first programming language. ScratchML aims to take a similar approach, creating a learning platform that's easy-to-use and develops our way of thinking and intuition behind the scenes.

![img1](https://github.com/theDubW/ScratchML/assets/83472902/6449927c-d2b7-49ce-9a38-335deb6973f8)

## What it does

Our platform is designed to teach machine learning and data analysis principles. The challenge is two-fold: making the learning fun and engaging while also providing a high quality curriculum developed around experiential learning. ScratchML delivers on both aspects by providing a reliable drag-and-drop interface used just like Scratch for model development and data experimentation, and through engineered datasets where the student are guided through exploring the data and reporting findings, students will be much more engaged through trying out a bunch of different approaches to accomplish a mission.

Each lesson comes with a workspace, where students can drag-and-drop models and other blocks to create a no-code, data analysis pipeline. A personalized tutor system is designed to guide the learning process, offering explanations and tips to guide the learning process. This system leverages the Prediction Guard LLM API to provide real-time insights into user decisions and outcomes within lessons. It employs state management to ensure continuous progress while fostering a sandbox-style learning environment.

![img2](https://github.com/theDubW/ScratchML/assets/83472902/2be22066-e1b2-4b49-825c-82f6fe1f13f6)

## How we built it

The tech stack for the project consisted of:
React for the frontend, utilizing the Chakra UI component library and Tailwind CSS for styling.
A Flask server that runs and trains models based on the layout specified by the user.
We also used Intels extension for Scikit-learn/PyTorch to deliver faster training and inference time critical for making the user experience on the site seamless.
Firebase database for storing user data and storage of models that can be evaluated on the fly.
APIs: Prediction Guard LLM API to provide personalized real-time feedback using Neural-Chat-7B.
Models: Scikit-learn and PyTorch
Dev tools: Intel's Developer Cloud for constructing and testing the sandbox model, leveraging the PyTorch optimizations from Intel.

## Challenges we ran into

The largest challenge was to constantly rework the design to build a more intuitive, highly-functional interface. We are software developers by training; it was difficult to settle on a UI/UX design that achieves all of our priorities. Prior approaches for no-code machine learning are primarily designed for use in industry. Although they work well for older users who need to model data, at each stage we were super focused on whether or not each of the design elements were good for students. Furthermore, with this being our first or second hackathon experience, we worked hard to coordinate distributing work, ideating what could be feasibly accomplished in 36 hours, and ensuring that we accomplish our tasks in a timely manner. A final challenge we faced was simple endurance - the last few hours of development were extremely difficult given the sleep deprivation we all suffered from - overcoming this challenge was simply a matter of willpower and perseverance.

![img3](https://github.com/theDubW/ScratchML/assets/83472902/d2e6df7d-9ceb-43fd-b8cd-1c5ef6a9af52)

## Accomplishments that we're proud of

As amateur hackers, we are proud of what we accomplished this weekend - from building a helpful and innovative product from scratch to just the sheer amount of hard work we exhibited - this weekend proved to us that we are each capable of much more than we originally thought. Our team has limited hackathon experience, and we went in with the approach of not compromising on even our most ambitious ideas. We hacked together the base form of ScratchML, which supports all of the critical features that we set out to do at the beginning of the hackathon, and we are super excited to continue to work at the idea and think creatively and collaboratively on ways we can improve the learning experience for students in the future.

## What we learned

One of the largest takeaways from this weekend was simply that we are capable of much more than we originally believed. Getting together a team of passionate and driven individuals with aligned goals is a powerful tool to create and build.

Another lesson we learned in hindsight is the importance of sleep. Sometimes sacrifice can be beneficial, but it’s likely that our excitement in the earlier stages of the weekend came back to bite us during the final stretch.
Finally, this challenge asked all of us to wear a wide variety of hats, working with technologies and frameworks that we have limited experiences with. We learned a variety of different tools and also learned how to quickly rise to the occasion and accomplish the needs of the team.

## What's next for ScratchML

We plan on making the UI more intuitive, adding more lessons, increasing the number of blocks available in the sandbox, and increasing the number of datasets users can play with.
It is also imperative that we continue to think of creative ways to encourage learning. Our vision for the future of education, shared with many leaders in the space, is turning the classroom into a laboratory, where students can experiment and grow through trial-and-error. This requires coordinated collaboration and a lot of learning on our end as well, and we are eager to innovate and learn from innovators in the educational space to grow ScratchML into the go-to platform for young students trying to learn machine learning and data science principles.

![image1](https://github.com/theDubW/ScratchML/assets/83472902/142c76c5-55ea-4004-817e-ea7afe7eb83e)


