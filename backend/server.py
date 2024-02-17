# Start
import firebase_admin
from firebase_admin import credentials, firestore, storage
import os
import endpoints


def main():
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

    endpoints.gen_data(db, "user_2", "FoolsGold", 100)
    endpoints.train_and_upload_model(db, "user_2", "FoolsGold", "logistic_regression")


main()
