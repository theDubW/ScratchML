import firebase_admin
from firebase_admin import credentials, firestore
import os
from endpoints import gen_data, train_and_upload_model
from typing import Any


def main() -> None:
    # intialize firestore
    # os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
    print(os.getcwd())
    cred = credentials.Certificate("./firebase-admin.json")

    firebase_admin.initialize_app(
        cred,
        {
            "projectId": "scratchml-treehacks",
            # "databaseURL": "http://localhost:8080",
            "storageBucket": "scratchml-treehacks.appspot.com",
            # "auth": {"emulatorHost": "localhost:9099"},
        },
    )
    # firebase_admin.delete_app(db)

    db = firestore.client()
    # bucket = storage.bucket()

    gen_data(db, "user_2", "FoolsGold", 80)
    gen_data(db, "user_2", "FoolsGold", 20, False)
    train_and_upload_model(db, "user_2", "FoolsGold", "logistic_regression")


if __name__ == "__main__":
    main()
