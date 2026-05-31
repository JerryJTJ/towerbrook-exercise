import { Router } from "express";
import { peopleController } from "./people.controller.js";

const PeopleRouter: Router = Router();

PeopleRouter.get("/", peopleController.fetchAllPeople);

export default PeopleRouter;
