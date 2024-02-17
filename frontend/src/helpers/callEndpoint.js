// import fetch from 'node-fetch';

export function generateData(uid, problemName, n){
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
}