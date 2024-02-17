from io import BytesIO
from joblib import dump
import pandas as pd
from firebase_admin import storage
from firebase_admin.firestore import Client
from sklearn.base import BaseEstimator
from typing import Any



def one_hot_encoding(df: pd.DataFrame) -> pd.DataFrame:
    # get categorical columns
    cat_columns = df.select_dtypes(include=["object"]).columns
    for col in cat_columns:
        dummies = pd.get_dummies(df[col], prefix=col)

        df = df.drop(col, axis=1)

        df = pd.concat([df, dummies], axis=1)
    # print(cat_columns)
    return df


# return pandas df with one hot encoding from firestore db
def get_data(db: Client, uid: str, problem_name: str, train: bool) -> pd.DataFrame:
    # data_stream = db.collection("Users").document(uid).collection(problem_name).stream()
    docName = "train" if train else "test"
    docRef = (
        db.collection("Users").document(uid).collection(problem_name).document(docName)
    )
    doc = docRef.get()

    if doc.exists:
        item_dict = doc.to_dict()
        df = pd.DataFrame.from_dict(item_dict)
        return df
    else:
        return pd.DataFrame()
    # print(df)


def upload_model_to_storage(uid: str, problem_name: str, model_type: str, model: BaseEstimator) -> None:
    bucket = storage.bucket()
    blob = bucket.blob(f"models/{uid}/{problem_name}/{model_type}.joblib")
    buffer = BytesIO()
    dump(model, buffer)
    buffer.seek(0)
    blob.upload_from_string(buffer.getvalue(), content_type="application/octet-stream")
    buffer.close()
    # blob.make
