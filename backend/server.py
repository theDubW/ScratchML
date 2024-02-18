from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import os
from database_utils import get_data
import json

# from paramiko import SSHClient
# from fabric import Connection

# Assuming evaluate_model function is defined in endpoint_utils or a similar module
from endpoint_utils import (
    gen_data,
    train_and_upload_model,
    evaluate_model,
    generate_ml_experiment_feedback,
)


app = Flask(__name__)
CORS(app)

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

db = firestore.client()
#
# client = SSHClient()
# client.load_system_host_keys("/Users/maxweinreb/.ssh/known_hosts")
print("connecting")
# c = Connection("100.82.12.111", user="ubuntu")
# c.open()
# print("connected")
# check if connected

# print("connected")
# result = c.run("echo YAH")
# print(result.stdout)


# Invoke-WebRequest -Uri http://localhost:5000/gen_data -Method Post -ContentType "application/json" -Body '{"uid": "user_10", "problem_name": "FoolsGold", "n": 10}'
# curl -X POST -H "Content-Type: application/json" -d '{"uid": "user_10", "problem_name": "FoolsGold", "n": 10}' http://localhost:5000/gen_data
@app.route("/gen_data", methods=["POST"])
def gen_user_data():
    data = request.get_json()
    print(data)
    uid = data["uid"]
    problem_name = data["problem_name"]
    n = int(data["n"])
    gen_data(db, uid, problem_name, n, True)
    gen_data(db, uid, problem_name, n, False)
    return jsonify({"status": "success"})


# Invoke-WebRequest -Uri http://localhost:5000/train -Method Post -ContentType "application/json" -Body '{"uid": "user_10", "problem_name": "FoolsGold", "model_name": "Decision Tree", "features": ["Hardness", "Density", "Conductivity", "Shininess", "Shape", "Texture"]}'
# curl -X POST -H "Content-Type: application/json" -d '{"uid": "user_10", "problem_name": "FoolsGold", "model_name": "Decision Tree", "features": ["Hardness", "Density", "Conductivity", "Shininess", "Shape", "Texture"]}' http://localhost:5000/train
@app.route("/train", methods=["POST"])
def train_model():
    data = request.get_json()
    print(data)
    uid = data["uid"]
    problem_name = data["problem_name"]
    model_name = data["model_name"]
    features = data["features"]

    train_and_upload_model(db, uid, problem_name, model_name, features)
    return jsonify({"status": "success"})


# Invoke-WebRequest -Uri http://localhost:5000/evaluate -Method Post -ContentType "application/json" -Body '{"uid": "user_10", "problem_name": "FoolsGold", "model_name": "Decision Tree", "features": ["Hardness", "Density", "Conductivity", "Shininess", "Shape", "Texture"]}'
# curl -X POST -H "Content-Type: application/json" -d '{"uid": "user_10", "problem_name": "FoolsGold", "model_name": "Decision Tree", "features": ["Hardness", "Density", "Conductivity", "Shininess", "Shape", "Texture"]}' http://localhost:5000/evaluate
@app.route("/evaluate", methods=["POST"])
def evaluate_user_model():
    data = request.get_json()
    uid = data["uid"]
    problem_name = data["problem_name"]
    model_name = data["model_name"]
    features = data["features"]

    evaluation_results = evaluate_model(db, uid, problem_name, model_name, features)
    print(evaluation_results)

    # Generate feedback using the evaluation results
    data = get_data(db, uid, problem_name, True)
    print("training data length", len(data))
    feedback = generate_ml_experiment_feedback(
        len(data), features, model_name, evaluation_results["accuracy"]
    )
    print(feedback)
    return jsonify(
        {"status": "success", "result": evaluation_results, "feedback": feedback}
    )


@app.route("/train_sandbox", methods=["POST"])
def train_sandbox():
    # input data should be list of tuples (layer_type, dimensions)
    data = request.get_json()
    print(data)
    layers_tuples = data["layers"]
    print(layers_tuples)
    # convert to enumerated json
    layers_json = {}
    i = 0
    for layer in enumerate(layers_tuples):

        if layer[1][0] == "Input" or layer[1][0] == "Output":
            continue
        layers_json[i] = layer[1]
        i += 1
    print(json.dumps(layers_json))
    # uid = data["uid"]
    # problem_name = data["problem_name"]
    # model_name = user_model_to_model_name(data["model_name"])
    # features = data["features"]

    # train_and_upload_model(db, uid, problem_name, model_name, features)
    return jsonify({"status": "success"})


# bucket = storage.bucket()

# gen_data(db, "user_2", "FoolsGold", 80)
# gen_data(db, "user_2", "FoolsGold", 20, False)
# train_and_upload_model(db, "user_2", "FoolsGold", "logistic_regression")


if __name__ == "__main__":
    app.run(debug=True)
