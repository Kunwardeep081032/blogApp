// app entry point

import { app } from "./app";
import { PORT } from "./config/config";
import { dbconnect } from "./config/db";
import logger from "./config/logger";

if (process.env.NODE_ENV !== "test") {
  dbconnect()
    .then(() => {
      logger.info("Database connected successfully");
    })
    .catch((error) => {
      logger.error("Database connection failed", error);
      process.exit(1);
    });
}

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
