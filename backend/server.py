from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import os
from database_utils import get_data

# Assuming evaluate_model function is defined in endpoint_utils or a similar module
from endpoint_utils import (
    gen_data,
    train_and_upload_model,
    evaluate_model,
    generate_ml_experiment_feedback,
    train_and_upload_sandbox_model,
    evaluate_sandbox_model,
    load_mnist_data
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


# Invoke-RestMethod -Uri 'http://localhost:5000/train_sandbox' -Method Post -ContentType "application/json" -Body '{"uid":"user123","problem_name":"MNIST_Classification","model_name":"Custom_CNN","layer_list":[["conv",6],["conv",16],["linear",120],["linear",84]],"learning_rate":0.0001,"epochs":5,"optimizer_name":"Adam","criterion_name":"Cross Entropy","dataset":"MNIST"}'

@app.route('/train_sandbox', methods=['POST'])
def train_sandbox():
    data = request.get_json() 
    uid = data["uid"]
    problem_name = data["problem_name"]
    model_name = data["model_name"]
    layer_list = data['layer_list']
    learning_rate = data['learning_rate']
    epochs = data['epochs']
    optimizer_name = data['optimizer_name']
    criterion_name = data['criterion_name']
    dataset = data['dataset']

    train_loader, _ = load_mnist_data(32, 0.133, 0.31012)

    train_and_upload_sandbox_model(uid, 
                                   problem_name,
                                   model_name,
                                   layer_list, 
                                   learning_rate, 
                                   epochs, 
                                   optimizer_name,
                                   criterion_name,
                                   train_loader)
    return jsonify({"status": "success"})



# Invoke-RestMethod -Uri 'http://localhost:5000/evaluate_sandbox' -Method Post -ContentType "application/json" -Body '{"uid":"user123","problem_name":"MNIST_Classification","model_name":"Custom_CNN","criterion_name":"Cross Entropy"}'

@app.route('/evaluate_sandbox', methods=['POST'])
def evaluate_sandbox():
    data = request.get_json()
    uid = data["uid"]
    problem_name = data["problem_name"]
    model_name = data["model_name"]
    criterion_name = data['criterion_name']

    _, test_loader = load_mnist_data(32, 0.133, 0.31012)

    evaluation_results = evaluate_sandbox_model(uid, 
                                                problem_name, 
                                                model_name, 
                                                test_loader,
                                                criterion_name)
    print(evaluation_results)
    return jsonify(
        {"status": "success", "result": evaluation_results}
    )



if __name__ == "__main__":
    app.run(debug=True)
