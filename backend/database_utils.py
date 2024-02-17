from io import BytesIO
from joblib import dump
import joblib
import pandas as pd
from firebase_admin import storage


def one_hot_encoding(df: pd.DataFrame):
    # get categorical columns
    cat_columns = df.select_dtypes(include=["object"]).columns
    for col in cat_columns:
        dummies = pd.get_dummies(df[col], prefix=col)

        df = df.drop(col, axis=1)

        df = pd.concat([df, dummies], axis=1)
    # print(cat_columns)
    return df


# return pandas df with one hot encoding from firestore db
def get_data(db, uid, problem_name):
    # data_stream = db.collection("Users").document(uid).collection(problem_name).stream()
    data_stream = db.collection("Users").document(uid).collection(problem_name).stream()
    # assert len(data_stream) == 1
    for doc in data_stream:

        # print(dir(item))
        item_dict = doc.to_dict()
        df = pd.DataFrame.from_dict(item_dict)
        return df
        # print(df)


def upload_model_to_storage(uid, problem_name, model_type, model):
    bucket = storage.bucket()
    blob = bucket.blob(f"models/{uid}/{problem_name}/{model_type}.joblib")
    buffer = BytesIO()
    joblib.dump(model, buffer)
    buffer.seek(0)
    blob.upload_from_string(buffer.getvalue(), content_type="application/octet-stream")
    buffer.close()
    # blob.make
