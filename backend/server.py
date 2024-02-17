# Start
import firebase_admin
from firebase_admin import credentials, firestore
import os

import endpoints


def main():
    # intialize firestore
    os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
    print(os.getcwd())
    cred = credentials.Certificate("../firebase-admin.json")

    firebase_admin.initialize_app(
        cred,
        {
            "projectId": "scratchml-treehacks",
            "databaseURL": "http://localhost:8080",
            # "auth": {"emulatorHost": "localhost:9099"},
        },
    )
    # firebase_admin.delete_app(db)

    db = firestore.client()

    endpoints.gen_data(db, "user_2", "FoolsGold", 10)


main()
