import { Router } from "express";
import { companyController } from "./company.controller.js";

const CompanyRouter: Router = Router();

CompanyRouter.get("/", companyController.getCompanies);

export default CompanyRouter;
