// import fetch from 'node-fetch';

// import { assert } from "console";

export function generateData(uid, problemName, n){
  // console.log("CALLING ENDPOINT");
  const data = {
    "uid": uid,
    "problem_name": problemName,
    "n": n
  }
  fetch('http://localhost:5000/gen_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
  // console.log("DONE WITH CALLING ENDPOINT");
}

export function trainSandboxModel(uid, curLayers, params){
  //     uid = data["uid"]
    // problem_name = data["problem_name"]
    // model_name = data["model_name"]
    // layer_list = data["layer_list"]
    // learning_rate = data["learning_rate"]
    // epochs = data["epochs"]
    // optimizer_name = data["optimizer_name"]
    // criterion_name = data["criterion_name"]
    // dataset = data["dataset"]
    // # Invoke-RestMethod -Uri 'http://localhost:5000/train_sandbox' -Method Post -ContentType "application/json" 
    // -Body '{"uid":"user123","problem_name":"MNIST_Classification","model_name":"Custom_CNN",
    // "layer_list":[["conv",6],["conv",16],["linear",120],["linear",84]],"learning_rate":0.0001,
    // "epochs":5,"optimizer_name":"Adam","criterion_name":"Cross Entropy","dataset":"MNIST"}'

  // console.log("CALLING ENDPOINT");
  // assert(curLayers.length === params.length);
  const layers = [];
  console.log("curLayers: ", curLayers, "params: ", params);
  for(let i = 0; i<curLayers.length; i++) {
    console.log(curLayers[i][0], params[i])
    layers.push([curLayers[i][0], params[i]]);
  }
  console.log("layers: ", layers);
  const data = {
    "uid": uid,
    "problem_name": "sandbox",
    "model_name": params[0], // model name is the first parameter b/c of input being first layer
    "layer_list": layers,
    "learning_rate": 0.0001,
    "epochs": 10,
    "optimizer_name": "Adam",
    "criterion_name": "Cross Entropy",
    "dataset": "MNIST"
  }
  fetch('http://localhost:5000/train_sandbox', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
  // console.log("DONE WITH CALLING ENDPOINT");

}

export function trainModel(uid, problem_name, modelName, features){
  // console.log("CALLING ENDPOINT");
  const data = {
    "uid": uid,
    "problem_name": problem_name,
    "model_name": modelName,
    "features": features,
  }
  fetch('http://localhost:5000/train', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
  // console.log("DONE WITH CALLING ENDPOINT");
}

export async function evalModel(uid, problem_name, modelName, features) {
  const data = {
    "uid": uid,
    "problem_name": problem_name,
    "model_name": modelName,
    "features": features,
  }
  const res = await fetch('http://localhost:5000/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
}


// uid = data["uid"]
    // problem_name = data["problem_name"]
    // model_name = data["model_name"]
    // criterion_name = data["criterion_name"]

export async function evalSandboxModel(uid, problem_name, model_name, criterion_name){
  const data = {
    "uid": uid,
    "problem_name": problem_name,
    "model_name": model_name,
    "criterion_name": criterion_name
  }
  const res = await fetch('http://localhost:5000/evaluate_sandbox', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
}