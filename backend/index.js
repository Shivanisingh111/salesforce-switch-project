const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config({ path: "./.env" });

console.log("LOGIN URL:", process.env.LOGIN_URL);

const app = express();

app.use(cors());
app.use(express.json());

let accessToken = "";
let instanceUrl = "";

const codeVerifier = crypto.randomBytes(32).toString("hex");

const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

// LOGIN ROUTE
app.get("/login", (req, res) => {
  const authUrl =
    `${process.env.LOGIN_URL}/services/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${process.env.CLIENT_ID}` +
    `&redirect_uri=${process.env.REDIRECT_URI}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  res.redirect(authUrl);
});

// CALLBACK ROUTE
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      `${process.env.LOGIN_URL}/services/oauth2/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          code: code,
          code_verifier: codeVerifier,
        },
      }
    );

    accessToken = tokenResponse.data.access_token;
    instanceUrl = tokenResponse.data.instance_url;

    console.log("ACCESS TOKEN:", accessToken);
    console.log("INSTANCE URL:", instanceUrl);

    console.log("Logged in Successfully");

    res.redirect("http://localhost:3000/?login=success");
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.send("OAuth Error");
  }
});

// GET VALIDATION RULES
app.get("/validation-rules", async (req, res) => {

  console.log("ACCESS TOKEN:", accessToken);
  console.log("INSTANCE URL:", instanceUrl);

  if (!accessToken || !instanceUrl) {
    return res.status(401).json({
      error: "Please login to Salesforce first"
    });
  }

  try {

    const query = `
      SELECT Id, ValidationName
      FROM ValidationRule
    `;

    const url =
      `${instanceUrl}/services/data/v59.0/tooling/query/?q=${encodeURIComponent(query)}`;

    console.log("FINAL URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response.data.records);
    res.json(response.data.records);

  } catch (error) {

    console.log("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Error fetching validation rules"
    });
  }
});

// TOGGLE RULE
app.patch("/toggle-rule/:id", async (req, res) => {
  try {
    const { active } = req.body;

    await axios.patch(
      `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${req.params.id}`,
      {
        Active: active,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.send("Validation Rule Updated");
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.send("Error updating validation rule");
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000 ");
});