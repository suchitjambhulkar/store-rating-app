const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const storeRoutes = require("./routes/store.routes");
const ratingRoutes = require("./routes/rating.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "Store rating app backend is running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/stores", storeRoutes);

app.use("/api/ratings", ratingRoutes);

module.exports = app;