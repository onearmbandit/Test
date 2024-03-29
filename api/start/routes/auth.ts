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

    // Route.post('/send-email', 'CommonController.sendEmail')

    // social login or signup API
    Route.post('/social-signup', 'AuthController.socialSignupAndLogin')
    Route.post('/social-login', 'AuthController.socialLogin')

    //:: Api for download supplier csv template
    Route.get('/download-supplier-csv', 'FilesController.downloadSupplierCSV')

    Route.post('/upload-image', 'FilesController.uploadImageToS3')

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

      Route.get('/dashboard-data', 'FacilityEmissionsController.getDashboardData')

      Route.resource('/facility-product', 'FacilityProductsController').only(['index', 'store'])
      Route.post(
        '/update-facility-products',
        'FacilityProductsController.updateFacilityMultipleProducts'
      )
      Route.get(
        '/equality-emission-calculation',
        'FacilityProductsController.calculateEqualityCarbonEmission'
      )

      Route.get('/facility-product-name-list', 'FacilityProductsController.getAllProductNames')

      //:: Supplier APIs
      Route.post('/supplier-csv-upload', 'SuppliersController.bulkCreationOfSupplier')
      Route.resource('/supplier-period', 'SupplyChainReportingPeriodsController')
      Route.resource('/suppliers', 'SuppliersController')
      Route.resource('/supplier-products', 'SupplierProductsController')
      Route.post(
        '/remove-multiple-products',
        'SupplierProductsController.deleteMultipleSupplierProducts'
      )
      Route.get(
        '/supplier-period-emission',
        'SupplierProductsController.calculateProductEmissionData'
      )
      Route.get('/supplier-product-type', 'SupplierProductsController.getAllProductTypes')
      Route.get('/supplier-product-name', 'SupplierProductsController.getAllProductNames')

      //;: AbatementProjects APIs
      Route.resource('/abatement-projects', 'AbatementProjectsController').only([
        'index',
        'store',
        'show',
        'update',
        'destroy',
      ])

      Route.resource('/supplier-organizations', 'SupplierOrganizationsController').only(['index'])

      //Invite organization api
      Route.post('/invite-organization', 'OrganizationUsersController.inviteOrganization')

      Route.get('/roles/:name', 'UsersController.getRoleByName')

      Route.get('/export-supplier-data', 'SuppliersController.exportSupplierData')
      // Route.post('/import-supplier-data', 'UsersController.getRoleByName')
    })
      .prefix('/auth')
      .middleware('auth')

    Route.post('/send-test-email', 'DevTestsController.sendTestMail')
  }).prefix('/v1')
}).prefix('/api')
