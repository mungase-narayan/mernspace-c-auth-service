import app from "./app";
import { Config } from "./config";

const startServer = async () => {
  const port = Config.PORT || 5500;

  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
