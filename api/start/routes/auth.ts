import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        //::AuthController routes
        Route.post('/register', 'AuthController.register')
        Route.post('/verify-email', 'AuthController.verifyEmail')

        Route.post('/login', 'AuthController.login')
        Route.post('/forgot-password', 'AuthController.forgotPassword')
        
    }).prefix('/v1')
}).prefix('/api')