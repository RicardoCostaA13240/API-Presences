const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const swagger = require("swagger-ui-express");
const db = require("./src/utils/dbconnection");
const studentModel = require("./src/models/student");
const studentController = require("./src/controllers/studentController");

// documentação da API - Open API
// File > Convert and Save as JSON
const openAPIDoc = require("./api-docs/openapi_v6.json");

const PORT = 5000;

// configuração do express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization"); // 'Content-Type');
     res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
     next();
});

// middleware para incluir a documentação OpenAPI
app.use(
     "/api-docs", // a rota onde a documentação ficará disponível
     swagger.serve, // servidor da documentação
     swagger.setup(openAPIDoc) // documento com a especificação da API
);

// routes
app.post("/student", studentController.register);
app.get("/student", studentController.getAll);
app.get("/student/:id", studentController.getOne);
app.get("/student/:id/presences", studentController.getPresencesByStudent);
app.get("/presence", studentController.getPresencesByDay);
app.get("/student/:id/presence", studentController.getPresencesByStudentAndInterval);

app.listen(PORT, () => console.log(`server listennig on http://localhost:${PORT}`));
