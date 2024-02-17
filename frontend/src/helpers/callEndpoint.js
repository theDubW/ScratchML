// import fetch from 'node-fetch';

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

export function trainModel(uid, problem_name, modelName){
  // console.log("CALLING ENDPOINT");
  const data = {
    "uid": uid,
    "problem_name": problem_name,
    "model_name": modelName
  }
  fetch('http://localhost:5000/train', {
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
  console.log("DONE WITH CALLING ENDPOINT");
}

export function evalModel(uid, problem_name, modelName){
  const data = {
    "uid": uid,
    "problem_name": problem_name,
    "model_name": modelName
  }
  fetch('http://localhost:5000/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
}