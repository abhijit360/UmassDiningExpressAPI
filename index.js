require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

console.log(process.env.API_KEY);
console.log(process.env.API_URL);
const app = express();
const SB = createClient(process.env.API_URL, process.env.API_KEY);

function displayRoutes(req, res, next) {
  const APIroutes = {
    "/UmassDiningApi/": "displays all routes",
    "/UmassDiningApi/DC=?":
      "displays all stations and meal timings available today",
    "/UmassDiningApi/DiningCommon_name/station_name/meal_time":
      "displays all the food items served at the station at that specific meal time",
    "/UmassDiningApi/DishName": "displays the meta data for dishname",
  };
  res.status(200).json(APIroutes);
}

function getDate() {
  const today = new Date();
  const today_day = today.getUTCDate();
  const today_month = today.getMonth();
  const today_year = today.getFullYear();
  return `${today_year}-${today_month + 1}-${today_day}`;
}

async function displayDC(req, res, next) {
  const DiningCommons = ["worcester", "berkshire", "frank", "hampshire"];
  const DC = req.params.DC;
  const today = getDate();

  if (!isNaN(Number(DC))) {
    res.status(400).json({
      error:
        "DC only takes the following values: worcester, berkshire, frank, hampshire",
    });
  } else if (DiningCommons.indexOf(DC.toLowerCase()) === -1) {
    res.status(400).json({
      error:
        "DC only takes the following values: worcester, berkshire, frank, hampshire",
    });
  } else {
    let { data, error } = await SB.rpc("get_stations_meal_time", {
      dc: DC,
      today: today,
    });

    if (error) {
      res.status(500).json({ error: "Server side error" });
    } else {
      res.status(200).json({
        message: "running",
        station_data: data,
      });
    }
  }
}

async function displayDishes(req, res) {
  const DiningCommons = ["worcester", "berkshire", "frank", "hampshire"];
  const DC = req.params.DC;
  const STN = req.params.stn;
  const MEAL_TIME = req.params.meal_time;
  const today = getDate();
  // check if DC is valid
  if (!isNaN(Number(DC))) {
    res.status(400).json({
      error:
        "DC only takes the following values: worcester, berkshire, frank, hampshire",
    });
  } else if (DiningCommons.indexOf(DC.toLowerCase()) === -1) {
    res.status(400).json({
      error:
        "DC only takes the following values: worcester, berkshire, frank, hampshire",
    });
  } 
  
  let { data, error } = await SB.rpc("get_dishes", {
    dc: DC,
    mealtime: MEAL_TIME,
    stn: STN,
    today: today,
  });

  if (error) {
    res.status(500).json({ error: "Server side error" });
  } else {
    res.status(200).json({
      message: "running",
      station_data: data,
    });
  }


}

async function getDish(req, res) {
    const DiningCommons = ["worcester", "berkshire", "frank", "hampshire"];
  const DC = req.params.DC;
  const STN = req.params.stn;
  const MEAL_TIME = req.params.meal_time;
  const today = getDate();
  const DISH_NAME = req.params.DishName;
  // check if DC is valid
  if (!isNaN(Number(DC))) {
    res.status(400).json({
      error:
        "DC only takes the following values: worcester, berkshire, frank, hampshire",
    });
  } else if (DiningCommons.indexOf(DC.toLowerCase()) === -1) {
    res.status(400).json({
      error:
        "DC only takes the following values: worcester, berkshire, frank, hampshire",
    });
  } 
  
  let { data, error } = await SB.rpc("get_dishmeta", {
    dc: DC,
    dishname: DISH_NAME,
    mealtime: MEAL_TIME,
    stn: STN,
    today: today,
    
  });

  if (error) {
    res.status(500).json({ error: "Server side error" });
  } else {
    res.status(200).json({
      message: "running",
      station_data: data,
    });
  }

  }



app.get("/UMassDiningApi/", displayRoutes);
app.get("/UMassDiningApi/:DC", displayDC);
app.get("/UMassDiningAPI/:DC/:stn/:meal_time", displayDishes);
app.get("/UmassDiningApi/:DC/:stn/:meal_time/:DishName", getDish);

app.listen(5000, () => {
  console.log(`server running on ${5000}`);
  console.log(getDate());
});
