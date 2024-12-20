import app from "./app";
import logger from "./config/logger";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";

const startServer = async () => {
  const port = Config.PORT || 5500;

  try {
    AppDataSource.initialize()
      .then(() => {
        logger.info("Database connected successfully!");
        // start the app
      })
      .catch((err) => {
        console.error("Error during Database connection", err);
      });
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error starting server:", error.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    } else logger.error("Internal Server Error");
  }
};

startServer();
