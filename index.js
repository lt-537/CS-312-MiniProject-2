import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const items = 16;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));

// homepage
app.get("/", async (req, res) => {
    res.render("homepage.ejs");
});

// random recipe page
app.get("/get_recipe", async (req, res) => {
    try{
        // implement the use of axios & get JSON data
        const result = await axios.get(API_URL);
        // drink data
        const drink_data = result.data.drinks[0];
        // drink name
        const drink_name = drink_data.strDrink;
        // drink image
        const img_link = drink_data.strDrinkThumb;
        // drink type (non-alcoholic/alcoholic)
        const drink_type = drink_data.strAlcoholic;
        const ingredients = [];
        const measurements = [];
        // gather all ingredients
        for(let i = 1; i < items; i++){
            const ingre_name = drink_data[`strIngredient${i}`];
            ingredients.push(ingre_name);
        }
        // gather all measurements
        for(let i = 1; i < items; i++){
            const ingre_mesaurement = drink_data[`strMeasure${i}`];
            measurements.push(ingre_mesaurement);
        }
        // gather drink instructions
        const instructions = drink_data.strInstructions;
        
        res.render("recipe.ejs", {
            drinks: drink_data,
            drink: drink_name,
            image: img_link,
            type: drink_type,
            ingredients_list: ingredients,
            measurement_list: measurements,
            drink_instructions: instructions,
        })
    } catch(error) {
        console.error("Failed to make request:", error.message);
        res.render("recipe.ejs", {
        error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});