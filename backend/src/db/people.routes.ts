import { Router } from "express";
import { peopleController } from "./people.controller.js";

const PeopleRouter: Router = Router();

PeopleRouter.get("/", peopleController.fetchAllPeople);
PeopleRouter.get(
	"/company/:companyId",
	peopleController.fetchAllPeopleByCompanyId,
);
PeopleRouter.get("/:id", peopleController.fetchPersonById);
PeopleRouter.post("/:id/notes", peopleController.updatePeopleNotes);
PeopleRouter.post("/:id/saved", peopleController.updatePeopleSaved);
PeopleRouter.delete("/:id", peopleController.deletePeople);

export default PeopleRouter;
