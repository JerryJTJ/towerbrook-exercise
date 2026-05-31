import { Router } from "express";
import { companyController } from "./company.controller.js";

const CompanyRouter: Router = Router();

CompanyRouter.get("/", companyController.fetchAllCompanies);
CompanyRouter.get("/:id", companyController.fetchCompanyById);

export default CompanyRouter;
