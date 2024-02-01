import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    //::AuthController routes
    Route.post('/register', 'AuthController.register') //step:1 register
    Route.patch('/user/:id', 'AuthController.updateNewUser') // step:2 register
    Route.post('/organization', 'AuthController.createOrganization') // step:3 register

    //:: Verify email
    Route.post('/verify-email', 'AuthController.verifyEmail')

    Route.post('/login', 'AuthController.login')
    Route.post('/forgot-password', 'AuthController.forgotPassword')
    Route.post('/reset-password', 'AuthController.resetPassword')
    Route.post('/logout', 'AuthController.logout').middleware('auth')

    Route.post('/send-email', 'CommonController.sendEmail')

    // social login or signup API
    Route.post('/social-signup', 'AuthController.socialSignupAndLogin')
    Route.post('/social-login', 'AuthController.socialLogin')

    //:: Api for download supplier csv template
    Route.get('/download-supplier-csv', 'FilesController.download')

    //Auth routes
    Route.group(() => {
      //:: used for setup and update organization
      Route.resource('/organization', 'OrganizationsController').only([
        'update',
        'store',
        'show',
        'index',
      ])

      //:: Profile API
      Route.get('/user', 'UsersController.show')
      Route.patch('/user', 'UsersController.update')
      Route.post('/user', 'UsersController.destroy') //for delete the user but need request data that's why used post method

      //:: Facilities
      Route.resource('/facility', 'FacilitiesController').only([
        'index',
        'store',
        'show',
        'update',
        'destroy',
      ])
      Route.resource('/facility-emission', 'FacilityEmissionsController').only([
        'index',
        'store',
        'show',
        'update',
        'destroy',
      ])

      Route.resource('/facility-product', 'FacilityProductsController').only([
        'store',
      ])
      Route.post('/update-facility-products', 'FacilityProductsController.updateFacilityMultipleProducts')

      //:: Supplier APIs
      Route.post('/supplier-csv-upload', 'SuppliersController.bulkCreationOfSupplier')

      Route.resource('/supplier-period', 'SupplyChainReportingPeriodsController')

      Route.resource('/suppliers', 'SuppliersController')

      Route.resource('/supplier-products', 'SupplierProductsController')
      Route.get(
        '/supplier-period-emission',
        'SupplierProductsController.calculateProductEmissionData'
      )
      Route.get('/supplier-product-type', 'SupplierProductsController.getAllProductTypes')
      Route.get('/supplier-product-name', 'SupplierProductsController.getAllProductNames')

      //Invite organization api
      Route.post('/invite-organization', 'OrganizationUsersController.inviteOrganization')

      Route.get('/roles/:name', 'UsersController.getRoleByName')
    })
      .prefix('/auth')
      .middleware('auth')
  }).prefix('/v1')
}).prefix('/api')
