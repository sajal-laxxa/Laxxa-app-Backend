import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 5051;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
