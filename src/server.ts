import app from "./app";
import logger from "./config/logger";
import { Config } from "./config";

const startServer = async () => {
  const port = Config.PORT || 5500;

  try {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error starting server:", error.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

startServer();
