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


def user_model_to_model_name(user_model: str) -> str:
    if user_model == "Decision Tree":
        return "decision_tree"
    elif user_model == "Logistic Regression":
        return "logistic_regression"
    elif user_model == "K-Nearest Neighbors":
        return "knn"
    else:
        raise ValueError("Bad model type")


# generate data for a specific problem for the user
def gen_data(
    db: Client, uid: str, problem_name: str, n: int, train: bool = True
) -> None:
    print("GENERATING DATA")
    n_per_class = n // 2

    # Generate labels
    labels = np.array([0] * n_per_class + [1] * n_per_class)

    # Generate features with overlapping and non-linear distributions
    hardness = np.concatenate(
        [
            np.random.normal(5, 1.5, n_per_class) ** 2,  # Non-linear transformation
            np.random.normal(6, 1.5, n_per_class) ** 2,
        ]
    ).astype(float)

    density = np.concatenate(
        [
            np.random.normal(7.0, 0.5, n_per_class),
            np.random.normal(7.5, 0.5, n_per_class),
        ]
    ).astype(float)

    conductivity = np.concatenate(
        [
            np.random.normal(4.0, 0.5, n_per_class)
            ** 3,  # More intense non-linear transformation
            np.random.normal(4.2, 0.5, n_per_class) ** 3,
        ]
    ).astype(float)

    shininess = np.concatenate(
        [
            np.random.normal(3.5, 0.7, n_per_class) ** 2,  # Non-linear transformation
            np.random.normal(3.6, 0.7, n_per_class) ** 2,
        ]
    ).astype(float)

    # Introducing a categorical feature with more choices and non-linear impact
    shapes = np.random.choice(["square", "circle", "rectangle", "triangle"], size=n)
    # Color feature with even more overlap and complex relationships
    colors = np.random.choice(["yellow", "bronze", "gold", "silver", "copper"], size=n)

    # Create DataFrame
    new_data = pd.DataFrame(
        {
            "label": labels,
            "hardness": hardness,
            "density": density,
            "conductivity": conductivity,
            "shininess": shininess,
            "shape": shapes,
            "color": colors,
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
    db: Client, uid: str, problem_name: str, model_type: str
) -> None:
    # read firebase data
    df = one_hot_encoding(get_data(db, uid, problem_name, train=True))
    # print(df)
    X = df.drop("label", axis=1)
    y = df["label"]

    # determine model type
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


def evaluate_model(db: Client, uid: str, problem_name: str, model_type: str) -> dict:
    test_df = one_hot_encoding(get_data(db, uid, problem_name, train=False))
    X_test = test_df.drop("label", axis=1)
    y_test = test_df["label"]

    # Load the model
    model = download_model_from_storage(uid, problem_name, model_type)

    # Make predictions and evaluate
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    # Return evaluation metrics
    return {"accuracy": accuracy}
