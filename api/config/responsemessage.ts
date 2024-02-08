
export const COMMON_RESPONSE = {
  getRequestSuccess: 'Data Fetched Successfully',
  permissionError: 'You don\'t have permission for this action',
  unauthorizedAccess: 'Unauthorized access',
  validationFailed: 'Validation failed for given inputs.',
  invalidCredentials: 'Invalid credentials.',
  notFound: 'Not found.',
}

export const AUTH_RESPONSE = {
  serverError: 'Looks like something went wrong. Please try again.',
  logoutSuccess: 'Logout successfully!',
  passwordTokenExpired: 'Password token expired, please try again with new link.',
  updatePasswordSuccess: 'Password updated successfully!',
  resetPasswordSuccess: 'Password reset successfully!',
  forgotPasswordSuccess: 'Reset password link sent successfully!',
  userNotFound: 'User details not found.',
  emailExists: 'An account already exists with this email address.',
  signupSuccess: "Email send successfully. Please check your mail id.",
  loginSuccess: "User Login successfully.",
  emailVerifySccess: 'Email verified successfully.',
  emailTokenExpired: 'Token does not exist or expired.',
  emailUrlVerify: 'Please verify the url.',
  invalidEmail: 'Invalid Email',
  incorrectEmail: 'Incorrect email, please try again',
  incorrectPassword: 'Incorrect password, please try again',
  userNotExist: 'User with this email not exist.',
  userCreated: "New user added successfully.",
  userUpdated: 'User Data updated successfully.',
  createOrganizationSuccess: "Organization created successfully,Please check mail",
  invalidOldPassword: 'Please enter the correct old password.',
  wrongUserEmail: "Wrong email, try again",
  wrongUserPassword: "Wrong password, try again",
  authUserDeleteSuccess: "User delete successfully.",
  notMatchInvitedData: "Entered email is not match with invited email.Please check.",
}


export const ORGANIZATION_RESPONSE = {
  updateOrganizationSuccess: "Organization updated successfully.",
  createOrganizationSuccess: "Organization created successfully",
}

export const SUPPLIER_RESPONSE = {
  updateSupplierReportPeriodSuccess: "Supplier chain reporting period  updated successfully.",
  createSupplierReportPeriodSuccess: "Supplier chain reporting period created successfully",
  supplierReportPeriodDeleteSuccess: "Supplier chain reporting period delete successfully.",
  supplierCSVNotMatch: "The columns in your CSV are not formatted correctly.Download the template to ensure the fields match.",
  bulkCreationSuccess: "Suppliers created successfully.",
  supplyChainReportingPeriodIdExist: "Supply chain reporting period with this ID does not exist.",
  supplierCreateSuccess: "New supplier added successfully.",
  supplierUpdateSuccess: "Supplier details updated successfully.",
  productNotFount: "Supplier product not found.",
  productDeleteSuccess: "Supplier product deleted successfully.",
  productCreateOrUpdateSuccess: "Supplier products created or updated successfully.",
  multipleProductDeleteSuccess: "Selected supplier products deleted successfully.",

}

export const ORGANIZATION_FACILITY_RESPONSE = {
  dataFetchSuccess: "Organization facilities fetched successfully.",
  updateFacilitySuccess: "Organization facility updated successfully.",
  deleteFacilitySuccess: "Organization facility deleted successfully.",
  facilityNotFound: "Organization facility didn't found.",
  createFacilityReportPeriodSuccess: "Facility reporting period created successfully.",
  updateFacilityEmissionSuccess: "Facility reporting period updated successfully.",
  deleteFacilityEmissionSuccess: "Facility reporting period deleted successfully.",
  FacilityEmissionNotFound: "Facility emission didn't found.",
  createFacilityProductSuccess: "Facility products created successfully.",
  equalityCarbonEmissionSuccess: "Equality carbon emission to product line calculated successfully.",
  updateFacilityProductSuccess: "Facility product details updated successfully.",
}


export const FILE_UPLOAD_RESPONSE = {
  serverError: 'Looks like something went wrong. Please try again.',
  uploadSuccess: "File uploaded successfully."
}


export const ABATEMENT_PROJECT_RESPONSE = {
  projectCreateSuccess: "Abatement project created successfully.",
  projectUpdateSuccess: "Abatement project updated successfully."
}
