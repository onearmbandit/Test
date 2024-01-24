
import { MailChimp } from '@mailchimp/mailchimp_marketing';
import View from '@ioc:Adonis/Core/View';

const MAILCHIMP_API_KEY: string = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_SERVER_PREFIX: string = process.env.MAILCHIMP_SERVER_PREFIX || '';
const MAILCHIMP_AUDIENCE_ID: string = process.env.MAILCHIMP_AUDIENCE_ID || '';

  export default class MailchimpService {
    constructor() {
      MailChimp.setConfig({
        apiKey: MAILCHIMP_API_KEY,
        server: MAILCHIMP_SERVER_PREFIX,
      });
    }

    async sendCampaignWithTemplateFile(templatePath: string, recipients: string[]): Promise<boolean> {
      try {
        // Read the content of the template file
        const templateContent: string = await View.render(templatePath);
        console.log("templateContent >> ", templateContent);

        // Create a dynamic template
        const templateId: string | null = await this.createDynamicTemplate(templateContent);
        console.log("templateId >> ", templateId);

        // Send the campaign using the dynamic template ID
        return await this.sendCampaign(templateId, recipients);
      } catch (error) {
        console.error('Mailchimp Error:', error);
        return false;
      }
    }

    async createDynamicTemplate(templateContent: string): Promise<string | null> {
      try {
        const response = await MailChimp.templates.create({
          name: 'Dynamic Template',
          html: templateContent,
        });

        return response.id;
      } catch (error) {
        console.error('Mailchimp Template Creation Error:', error);
        return null;
      }
    }

    async sendCampaign(templateId: string | null, recipients: string[]): Promise<boolean> {
      try {
        console.log("in send campaign");
        if (!templateId) {
          return false;
        }

        const campaign = await MailChimp.campaigns.create({
          type: 'regular',
          recipients: { list_id: MAILCHIMP_AUDIENCE_ID },
          settings: {
            subject_line: 'my test email',
            from_name: 'Mayuri',
            reply_to: 'your@email.com',
          },
          content: {
            template_id: templateId,
          },
        });

        // Send the campaign
        await MailChimp.campaigns.actions.send(campaign.id);

        return true;
      } catch (error) {
        console.error('Mailchimp Error:', error);
        return false;
      }
    }
  }
