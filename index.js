const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

const HS_API_BASE_URL = "https://api.hubspot.com";
const HS_OBJECT_TYPE = "2-42239005";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
  const animeCharacters = `${HS_API_BASE_URL}/crm/v3/objects/${HS_OBJECT_TYPE}?properties=name,anime,age`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(animeCharacters, { headers });
    const data = resp.data.results;
    res.render("homepage", {
      title: "Anime Characters Homepage | Integrating With HubSpot I Practicum",
      data,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error fetching anime characters:", error);
    res.render("homepage", {
      title: "Anime Characters Homepage | Integrating With HubSpot I Practicum",
      data: [],
      error: "Failed to load characters",
    });
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
  const createUrl = `${HS_API_BASE_URL}/crm/v3/objects/${HS_OBJECT_TYPE}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  const characterData = {
    properties: {
      name: req.body.name,
      anime: req.body.anime,
      age: req.body.age,
    },
  };

  try {
    await axios.post(createUrl, characterData, { headers });
    res.redirect("/");
  } catch (error) {
    console.error("Create Error:", error.response?.data || error.message);
    res.render("updates", {
      title: "Create Anime Character",
      error: "Failed to create character",
    });
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
