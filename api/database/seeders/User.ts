import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { UserRoles } from 'App/helpers/constants'
import { v4 as uuidv4 } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    try {
      const superAdminRole = await Role.getRoleByName(UserRoles.SUPER_ADMIN)
      await User.createUserWithRole(
        {
          id: uuidv4(),
          firstName: 'Super',
          lastName: 'Admin',
          email: 'superac3@mailinator.com',
          password: 'Pass@1234',
          registrationStep: 1,
          loginType: 'web',
          slug: 'super-admin',
        },
        superAdminRole
      )
    } catch (error) {
      console.log(error.message)
    }
  }
}
