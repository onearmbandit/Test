import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {UserRoles} from 'App/helpers/constants'
import Role from 'App/Models/Role'
import { v4 as uuidv4 } from 'uuid';

export default class extends BaseSeeder {
  public async run () {
    await Role.createMany([
      {
        id:uuidv4(),
        name: UserRoles.SUPER_ADMIN,
      },
      {
        id:uuidv4(),
        name: UserRoles.ADMIN,
      },
      {
        id:uuidv4(),
        name: UserRoles.SUB_ADMIN,
      },
      {
        id:uuidv4(),
        name: UserRoles.SUPPLIER,
      }
    ])
  }
}
