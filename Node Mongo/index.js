const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dboper = require("./operations");
const url = "mongodb://localhost:27017/";
const dbname = "conFusion";
const startScript = "mongod --dbpath=data --bind_ip 127.0.0.1";

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log("Connected successfully to the server");

  const db = client.db(dbname);

  dboper.insertDocument(
    db,
    { name: "Vadoonut", description: "Test" },
    "dishes",
    (result) => {
      console.log("Insert Document: \n", result.ops);

      dboper.findDocuments(db, "dishes", (docs) => {
        console.log("Found documents: \n", docs);

        dboper.updateDocument(
          db,
          { name: "Vadoonut" },
          { description: "Updated test" },
          "dishes",
          (result) => {
            console.log("Updated Document: \n", result.result);

            dboper.findDocuments(db, "dishes", (docs) => {
              console.log("Found updated documents: \n", docs);

              db.dropCollection("dishes", (result) => {
                console.log("Dropped collection ", result);

                client.close();
              });
            });
          }
        );
      });
    }
  );
});
