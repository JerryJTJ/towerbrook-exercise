import { Router } from "express";
import { peopleController } from "./people.controller.js";

const PeopleRouter: Router = Router();

PeopleRouter.get("/", peopleController.fetchAllPeople);
PeopleRouter.get(
	"/company/:companyId",
	peopleController.fetchAllPeopleByCompanyId,
);
PeopleRouter.get("/:id", peopleController.fetchPersonById);

export default PeopleRouter;
