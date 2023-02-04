import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersModel } from './users.model'
import { Repository } from 'typeorm'
import { UsersDto } from './dto/users.dto'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersModel) private readonly usersModel: Repository<UsersModel>) {}

  async getAll() {
    return await this.usersModel.find({ relations: { rating_to: true } })
  }

  async getById(id: number) {
    const user = await this.usersModel.findOne({
      where: { id },
      relations: {
        countries: true,
              roles: true,
              genders: true,
              languages: true,
              skillsSelected: { skills: true },
              rating_to: { owners: true },
              rating_from: true,
              professionsSelected: { professions: true },
              city: true,
      },
    })

    if (!user) throw new BadRequestException('Пользователь не найден')

    return user
  }

  

  async updateDescription(id: number, dto: UsersDto) {
    const user = await this.getById(id)
    user.about = dto.about
    user.title = dto.title
    await this.usersModel.save(user)
    return
  }

  async updateProfile(id: number, dto: UsersDto) {
    const user = await this.getById(id)

    user.name = dto.name
    user.surname = dto.surname
    user.countries = dto.countriesId
    user.city = dto.cityId
    await this.usersModel.save(user)
    return
  }

  async updatePhoto(id: number, dto: any) {
    const user = await this.usersModel.findOneBy({ id })
    user.avatarPath = dto.avatarPath

    await this.usersModel.save(user)
    return
  }

  async getAllFreelancers() {
    return await this.usersModel.find({
      where: {
        roles: {
          name: 'freelancer',
        },
      },
      relations: {
        rating_to: true,
        city: true,
        countries: true,
        professionsSelected: {
          professions: true,
        },
      },
    })
  }

  async updateView(login: string) {
    const user = await this.usersModel.findOne({
      where: { login },
      relations: {
        countries: true,
        roles: true,
        genders: true,
        languages: true,
        skillsSelected: { skills: true },
        rating_to: { owners: true },
        rating_from: true,
        professionsSelected: { professions: true },
        city: true,
      },
    })

    if (!user) throw new BadRequestException('Пользователь не найден')

    user.view++

    return await this.usersModel.save(user)


  }
}
