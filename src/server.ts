import app from "./app";
import logger from "./config/logger";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";

const startServer = async () => {
  const PORT = Config.PORT || 5500;

  try {
    AppDataSource.initialize()
      .then(() => {
        logger.info({ msg: "Database connected successfully!" });
        // start the app
      })
      .catch((err) => {
        console.error({ msg: "Error during Database connection", err });
      });
    app.listen(PORT, () => {
      logger.info({ msg: `Server listening on http://localhost:${PORT}` });
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ msg: `Error starting server: ${error.message}` });
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    } else logger.error({ msg: "Internal Server Error" });
  }
};

startServer();
