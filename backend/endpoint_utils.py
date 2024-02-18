import numpy as np
import pandas as pd
from typing import Union
from firebase_admin.firestore import Client
from sklearn.base import BaseEstimator
from database_utils import (
    get_data,
    one_hot_encoding,
    upload_model_to_storage,
    download_model_from_storage,
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from typing import List
import os
import json
import predictionguard as pg


def user_model_to_model_name(user_model: str) -> str:
    if user_model == "Decision Tree":
        return "decision_tree"
    elif user_model == "Logistic Regression":
        return "logistic_regression"
    elif user_model == "K-Nearest Neighbors":
        return "knn"
    else:
        print(user_model)
        raise ValueError("Bad model type")


def gen_data(
    db: Client, uid: str, problem_name: str, n: int, train: bool = True
) -> None:
    # relevant features
    hardness = np.random.randint(10, 40, n)
    density = np.random.randint(1, 11, n)
    conductivity = np.random.randint(1, 11, n)
    textures = np.random.choice(["smooth", "rough"], size=n)

    # irrelevant features
    shininess = np.random.randint(1, 11, n)
    shapes = np.random.choice(["square", "circle", "rectangle", "triangle"], size=n)

    # Assign numerical values to colors based on an arbitrary property (e.g., "warmth")
    texture_values = {"smooth": 0, "rough": 1}
    texture_numerical = np.array([texture_values[t] for t in textures])

    # Calculate condition numbers using the non-linear transformation, now including color
    conditions = [0] * n
    for i in range(n):
        if hardness[i] < 25:
            conditions[i] = (
                hardness[i]
                + (10 + 5 * density[i]) * texture_numerical[i]
                + np.log(conductivity[i] + 1)
            )
        else:
            conditions[i] = (
                hardness[i]
                - (10 + 5 * density[i]) * texture_numerical[i]
                - np.log(conductivity[i] + 1)
            )

    labels = [1 if v > 25 else 0 for v in conditions]

    # Create DataFrame
    new_data = pd.DataFrame(
        {
            "label": labels,
            "hardness": hardness,
            "density": density,
            "conductivity": conductivity,
            "shininess": shininess,
            "shape": shapes,
            "texture": textures,
        }
    )
    print("Getting past")
    cur_data = get_data(db, uid, problem_name, train)
    print("Got past")
    new_data = pd.concat([new_data, cur_data])

    db_firestore = {}
    # Push data to Firebase
    for record in new_data.columns:
        db_firestore[record] = new_data[record].tolist()
    print("pushing to server")
    docName = "train" if train else "test"
    db.collection("Users").document(uid).collection(problem_name).document(docName).set(
        db_firestore, merge=True
    )


def train_and_upload_model(
    db: Client, uid: str, problem_name: str, model_type: str, features: list
) -> None:
    # Read raw data
    raw_df = get_data(db, uid, problem_name, train=True)

    # Filter the DataFrame to only include the specified features before one-hot encoding
    # Assuming 'label' is not included in the features list and is added separately
    filtered_df = raw_df[features + ["label"]]

    # Apply one-hot encoding to the filtered DataFrame
    df = one_hot_encoding(filtered_df)

    X = df.drop("label", axis=1)
    y = df["label"]

    # Determine model type
    if model_type == "decision_tree":
        model = DecisionTreeClassifier()
    elif model_type == "logistic_regression":
        model = LogisticRegression(max_iter=1000)
    elif model_type == "knn":
        model = KNeighborsClassifier()
    else:
        print(model_type)
        raise ValueError("Bad model type")

    model.fit(X, y)

    upload_model_to_storage(uid, problem_name, model_type, model)


def evaluate_model(
    db: Client, uid: str, problem_name: str, model_type: str, features: list
) -> dict:
    # Read raw data
    raw_df = get_data(db, uid, problem_name, train=False)

    # Filter the DataFrame to only include the specified features before one-hot encoding
    filtered_df = raw_df[features + ["label"]]

    # Apply one-hot encoding to the filtered DataFrame
    test_df = one_hot_encoding(filtered_df)

    X_test = test_df.drop("label", axis=1)
    y_test = test_df["label"]

    # Load the model
    model = download_model_from_storage(uid, problem_name, model_type)

    # Make predictions and evaluate
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    # Return evaluation metrics
    return {"accuracy": accuracy}


def setup_predictionguard_token(token: str) -> None:
    os.environ["PREDICTIONGUARD_TOKEN"] = token


def generate_ml_experiment_feedback(n: int, features: List[str], model_type: str, accuracy: float) -> str:
    # Define the initial system message
    system_message = {
        "role": "system",
        "content": """
        As an AI embedded in an educational platform, your role is to assist young students in understanding the basics of machine learning through hands-on experiments. Your responses should strictly follow a structured methodology, guiding students based on their experiment inputs without offering additional information beyond what is necessary.

        When providing feedback, adhere to the following template based on the student's experiment parameters:

        1. If the dataset size (n) is less than 250, respond with:
        "Nice job on starting your experiment! If your accuracy isn't quite where you want it to be, consider how more data might help your model learn better. What happens if you increase your dataset?"

        2. If n > 250 but the chosen features do not include both 'texture' and 'hardness', respond with:
        "Great effort! It looks like you're exploring different features. If you're not seeing the results you hoped for, think about other features you haven't tried yet. There's always room to experiment and find what works best."

        3. If n > 250, features include 'texture' and 'hardness', but the model is not a Decision Tree, respond with:
        "You're doing well by trying out different models. If the accuracy isn't meeting your expectations, think about how changing the model type might impact your results. Different types of models perform better on different data"

        Your feedback must directly correspond to these scenarios without expanding beyond the provided templates. This approach ensures clarity and consistency in guiding students through their machine learning journey, encouraging them to explore and learn through experimentation while adhering to the structured feedback methodology.
        """
    }

    # Define a user message template filled with actual experiment details
    user_message = {
        "role": "user",
        "content": f"I used {features} as features with a dataset size of {n} to train a {model_type} model, and I got an accuracy of {accuracy}."
    }

    # Combine the system message and the user message into the messages list
    messages = [system_message, user_message]

    # Create a chat session with Prediction Guard, using the defined messages
    setup_predictionguard_token("q1VuOjnffJ3NO2oFN8Q9m8vghYc84ld13jaqdF7E")
    result = pg.Chat.create(
        model="Neural-Chat-7B",
        messages=messages
    )

    # Extract the content from the result
    feedback_content = result['choices'][0]['message']['content']

    return feedback_content