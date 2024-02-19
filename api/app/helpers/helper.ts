import slugify from "slugify";
import Database from "@ioc:Adonis/Lucid/Database";


export const createSlug = async (titleName: string) => {
    let slug = slugify(titleName, { lower: true, remove: /[*+~.()'"!:@,]/g })

    const users = await Database.from("users").where('slug', 'like', `${slug}%`).count('* as total')

    if (users[0].total === 0) {
        return slug
    } else {
        let newSlug = `${slug}-${users[0].total }`
        return newSlug
    }
}
