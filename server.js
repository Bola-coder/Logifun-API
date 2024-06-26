require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3000;

async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

syncDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
