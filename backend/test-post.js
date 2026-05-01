// Simple script to POST to /api/test and print status + response
const url = "http://localhost:8080/api/test";
const body = {};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
})
  .then(async (res) => {
    console.log("status", res.status);
    console.log(await res.text());
  })
  .catch((err) => {
    console.error("Error calling local API:", err);
  });