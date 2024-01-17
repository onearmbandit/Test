import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        //::AuthController routes
        Route.post('/register', 'AuthController.register')  //step:1 register
        Route.patch('/user/:id', 'AuthController.updateNewUser') // step:2 register
        Route.post('/organization', 'AuthController.createOrganization') // step:3 register

        //:: Verify email
        Route.post('/verify-email', 'AuthController.verifyEmail')

        Route.post('/login', 'AuthController.login')
        Route.post('/forgot-password', 'AuthController.forgotPassword')
        Route.post('/reset-password', 'AuthController.resetPassword')

        
    }).prefix('/v1')
}).prefix('/api')