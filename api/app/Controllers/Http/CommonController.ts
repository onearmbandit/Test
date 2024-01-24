import { apiResponse } from 'App/helpers/response'
import { MailChimpService } from 'App/Services/M';


export default class UsersController {

  public async sendEmail({ request, response }) {
    try {
      const { recipients } = request.only(['recipients']);

      console.log("recipients >>",recipients)

      const mailChimpService = new MailChimpService();
      console.log("mailChimpService >>",mailChimpService)
      const templatePath = "emails/user_welcome.edge";

      // Send the campaign using the template file path
      const success = await mailChimpService.sendCampaignWithTemplateFile(templatePath, recipients);

      if (success) {
        return apiResponse(response, true, 200, {}, 'Campaign sent successfully!')
      } else {
        return apiResponse(response, true, 500, {}, 'Failed to send campaign')
      }
    } catch (error) {
      console.error('Controller Error:', error);
      return response.status(500).send('Internal server error.');
    }
  }
}
