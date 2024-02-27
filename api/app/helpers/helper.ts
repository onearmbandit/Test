import slugify from "slugify";
import Database from "@ioc:Adonis/Lucid/Database";


/**
 * Creates a unique slug from a given title by appending a number if it already exists.
 * 
 * @param titleName - The title to generate the slug from 
 * @returns The unique slug
 */
export const createSlug = async (titleName: string) => {
    let slug = slugify(titleName, { lower: true, remove: /[*+~.()'"!:@,]/g })

    const users = await Database.from("users").where('slug', 'like', `${slug}%`).count('* as total')

    if (users[0].total === 0) {
        return slug
    } else {
        let newSlug = `${slug}-${users[0].total}`
        return newSlug
    }
}
