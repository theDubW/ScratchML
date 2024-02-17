import numpy as np
import pandas as pd
from database_utils import get_data, one_hot_encoding, upload_model_to_storage
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier

# from firebase_admin import Clien


# generate data for a specific problem for the user
def gen_data(db, uid, problem_name, n):
    n_per_class = n // 2  # Ensure n is even for equal class distribution

    # Generate features
    labels = np.array([0] * n_per_class + [1] * n_per_class)
    hardness = np.concatenate(
        [
            np.random.randint(3, 6, n_per_class),  # Softer for gold
            np.random.randint(1, 4, n_per_class),  # Harder for pyrite
        ]
    )
    density = np.concatenate(
        [
            np.random.uniform(4, 6, n_per_class),  # Closer to pyrite
            np.random.uniform(18, 20, n_per_class),  # Closer to gold
        ]
    )
    conductivity = np.concatenate(
        [
            np.random.randint(1, 4, n_per_class),  # Higher for gold
            np.random.randint(3, 6, n_per_class),  # Lower for pyrite
        ]
    )
    shininess = np.concatenate(
        [
            np.random.randint(3, 6, n_per_class),  # More shiny for gold
            np.random.randint(1, 3, n_per_class),  # Less shiny for pyrite
        ]
    )
    shapes = np.random.choice(["square", "circle", "rectangle"], size=n)
    colors = np.random.choice(["yellow", "bronze yellow", "silver yellow"], size=n)

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
    cur_data = get_data(db, uid, problem_name)
    new_data = pd.concat([new_data, cur_data])

    db_firestore = {}
    # Push data to Firebase
    for record in new_data.columns:
        db_firestore[record] = new_data[record].tolist()
    print("pushing to server")

    db.collection("Users").document(uid).collection(problem_name).document("data").set(
        db_firestore, merge=True
    )


def train_and_upload_model(db, uid, problem_name, model_type):
    # read firebase data
    df = one_hot_encoding(get_data(db, uid, problem_name))
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
