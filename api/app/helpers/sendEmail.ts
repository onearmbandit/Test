import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export const sendMail = async (to: string, subject: string, html: string, data) => {
  await Mail.send((message) => {
    message.from(Env.get('MAIL_FROM_ADDRESS')).to(to).subject(subject).htmlView(html, data)
  })
  return
}

export const sendMailLater = async (to: string, subject: string, html: string, data) => {
  await Mail.sendLater((message) => {
    message.from(Env.get('MAIL_FROM_ADDRESS')).to(to).subject(subject).htmlView(html, data)
  })
  return
}
