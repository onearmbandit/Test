import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class OrganizationPolicy extends BasePolicy {
	public async view(user: User, organization) {
		// create array of ids
		let userIds = (await organization.users).map(user => user.id);
		return userIds.includes(user.id)
	}

	public async update(user: User, organization) {
		// create array of ids
		let userIds = (await organization.users).map(user => user.id);
		return userIds.includes(user.id)
	}
}
