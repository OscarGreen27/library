import MongoStore from "connect-mongo";

export const getSeesionConfig = () => {
  return {
    secret: process.env["SESSION_SECRET"] || "3x4v2t8Flw2EhaeScxgZN2LF4JU2AtLS",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 40 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env["MONGO_URL"],
      dbName: process.env["SESSION_DB_NAME"],
      collectionName: process.env["SESSION_COLLECTION_NAME"],
      ttl: 40 * 60,
    }).on("error", (err) => {
      console.error("MongoStore error:", err);
    }),
  };
};
