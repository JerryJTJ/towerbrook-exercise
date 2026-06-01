import { Router } from "express";
import { companyController } from "./company.controller.js";

const CompanyRouter: Router = Router();

CompanyRouter.get("/", companyController.fetchAllCompanies);
CompanyRouter.get("/:id", companyController.fetchCompanyById);
CompanyRouter.post("/:id", companyController.updateCompany);
CompanyRouter.post("/:id/notes", companyController.updateCompanyNotes);
CompanyRouter.post("/:id/saved", companyController.updateCompanySaved);
CompanyRouter.delete("/:id", companyController.deleteCompany);

export default CompanyRouter;
