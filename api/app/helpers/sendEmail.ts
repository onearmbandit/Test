import Mail from '@ioc:Adonis/Addons/Mail'

export const sendMail = async (to: string, subject: string, html: string, data) => {
  await Mail.send((message) => {
    message.from(`${process.env.SMTP_USERNAME}`).to(to).subject(subject).htmlView(html, data)
  })

  return
}

export const sendMailLater = async (to: string, subject: string, html: string, data) => {
  await Mail.sendLater((message) => {
    message.from('info@example.com').to(to).subject(subject).htmlView(html, data)
  })
  return
}
