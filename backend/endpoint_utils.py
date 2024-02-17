import numpy as np
import pandas as pd
from typing import Union
from firebase_admin.firestore import Client
from sklearn.base import BaseEstimator
from database_utils import get_data, one_hot_encoding, upload_model_to_storage, download_model_from_storage
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# from firebase_admin import Clien


# generate data for a specific problem for the user
def gen_data(db: Client, uid: str, problem_name: str, n: int, train: bool = True) -> None:    
    # relevant features
    hardness = np.random.randint(10, 40, n)
    density = np.random.randint(1,11, n)
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
            conditions[i] = hardness[i] + (10 + 5 * density[i]) * texture_numerical[i] + np.log(conductivity[i] + 1)
        else:
            conditions[i] = hardness[i] - (10 + 5 * density[i]) * texture_numerical[i] - np.log(conductivity[i] + 1)

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
    cur_data = get_data(db, uid, problem_name, train)
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
    filtered_df = raw_df[features + ['label']]
    
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
        raise ValueError("Bad model type")
    
    model.fit(X, y)

    upload_model_to_storage(uid, problem_name, model_type, model)

def evaluate_model(
    db: Client, uid: str, problem_name: str, model_type: str, features: list
) -> dict:
    # Read raw data
    raw_df = get_data(db, uid, problem_name, train=False)
    
    # Filter the DataFrame to only include the specified features before one-hot encoding
    filtered_df = raw_df[features + ['label']]
    
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