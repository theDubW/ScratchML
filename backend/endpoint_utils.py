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
from sklearn.metrics import accuracy_score, confusion_matrix
from typing import List
import os
import json
import predictionguard as pg


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
            "Label": labels,
            "Hardness": hardness,
            "Density": density,
            "Conductivity": conductivity,
            "Shininess": shininess,
            "Shape": shapes,
            "Texture": textures,
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
    filtered_df = raw_df[features + ["Label"]]

    # Apply one-hot encoding to the filtered DataFrame
    df = one_hot_encoding(filtered_df)

    X = df.drop("Label", axis=1)
    y = df["Label"]

    # Determine model type
    if model_type == "Decision Tree":
        model = DecisionTreeClassifier()
    elif model_type == "Logistic Regression":
        model = LogisticRegression(max_iter=1000)
    elif model_type == "K-Nearest Neighbors":
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
    filtered_df = raw_df[features + ["Label"]]

    # Apply one-hot encoding to the filtered DataFrame
    test_df = one_hot_encoding(filtered_df)

    X_test = test_df.drop("Label", axis=1)
    y_test = test_df["Label"]

    # Load the model
    model = download_model_from_storage(uid, problem_name, model_type)

    # Make predictions and evaluate
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    # Compute confusion matrix
    cm = confusion_matrix(y_test, predictions)
    # Flatten the confusion matrix if it's for binary classification
    cm_flattened = cm.flatten() if cm.size == 4 else cm

    # Return evaluation metrics including the confusion matrix
    return {
        "accuracy": np.round(accuracy, 3),
        "confusion_matrix": cm_flattened.tolist()  # Convert numpy array to list for JSON serialization
    }


def setup_predictionguard_token(token: str) -> None:
    os.environ["PREDICTIONGUARD_TOKEN"] = token


def generate_ml_experiment_feedback(n: int, features: List[str], model_type: str, accuracy: float) -> str:
    system_message_1 = {
        "role": "system",
        "content": """
        Guide students when their dataset size is small. Encourage exploring the impact of dataset size on model accuracy.

        Feedback template:
        "Nice job on starting your experiment! If your accuracy isn't quite where you want it to be, consider how more data might help your model learn better. What happens if you increase your dataset?"
        """
    }
    user_message_template_1 = {
        "role": "user",
        "content": "I used a dataset size of {n}, and got accuracy {accuracy}."
    }

    system_message_2 = {
        "role": "system",
        "content": """
        Focus on guiding students in exploring different feature combinations to improve model accuracy. All available features include: ["hardness", "density", "conductivity", "shininess", "shape", "texture"].

        Feedback template:
        "Great effort! It looks like you're exploring different features. If you're not seeing the results you hoped for, think about other features you haven't tried yet. There's always room to experiment and find what works best."
        """
    }
    user_message_template_2 = {
        "role": "user",
        "content": "I used {features} as features for my model and got accuracy {accuracy}."
    }

    system_message_3 = {
        "role": "system",
        "content": """
        Guide students on the importance of experimenting with different model types when the chosen model isn't yielding the expected accuracy.

        Feedback template:
        "You're making good progress! If the model you chose isn't providing the results you hoped for, consider testing out other models. Each model type has its strengths, and switching it up could reveal what works best for your dataset."
        """
    }
    user_message_template_3 = {
        "role": "user",
        "content": "I trained a {model_type} model and achieved an accuracy of {accuracy}."
    }

    system_message_4 = {
        "role": "system",
        "content": """
        Celebrate the student's achievement and guide them on next steps after achieving satisfactory results.

        Feedback template:
        "Congratulations on achieving such great results! Your experiment shows you're learning the ropes of machine learning. Feel free to experiment more or consider moving on to the next lesson to continue expanding your skills."
        """
    }
    user_message_template_4 = {
        "role": "user",
        "content": "My model achieved an accuracy of {accuracy}."
    }

    # Select the appropriate messages based on input parameters
    if n < 250:
        system_message, user_message_template = system_message_1, user_message_template_1
    elif not all(feature in features for feature in ["Texture", "Hardness"]):
        system_message, user_message_template = system_message_2, user_message_template_2
    elif model_type != "Decision Tree":
        system_message, user_message_template = system_message_3, user_message_template_3
    else:
        system_message, user_message_template = system_message_4, user_message_template_4

    # Format the user message with the experiment details
    user_message = {"role": "user", "content": user_message_template['content'].format(n=n, features=features, model_type=model_type, accuracy=accuracy)}

    # Combine the system message and the user message for the session
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