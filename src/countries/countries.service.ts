import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriesModel } from "../categories/categories.model";
import { Repository } from "typeorm";
import { CountriesModel } from "./countries.model";
import { CountriesController } from "./countries.controller";

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(CountriesModel) private readonly countriesModel: Repository<CountriesModel>) {
  }

  async getCountry() {
    return await this.countriesModel.manager.getTreeRepository(CountriesModel).findRoots()
  }

  async getAll() {
    return await this.countriesModel.manager.getTreeRepository(CountriesModel).findTrees()
  }
}
