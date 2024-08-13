const generateMessages = (entity) => ({
    notFound: `${entity} not found`,
    alreadyExist: `${entity} already exist`,
    failToCreate: `fail to create ${entity}`,
    failToUpdate: `fail to update ${entity}`,
    createdSuccessfully: `${entity} created successfully`,
    updatedSuccessfully: `${entity} updated successfully`,
    deletedSuccessfully: `${entity} deleted successfully`,

})
export const messages = {
    category: generateMessages('category'),
    subcategory: generateMessages('subcategory'),
    brand: generateMessages('brand'),
    product: generateMessages('product'),
    user: { ...generateMessages('user'), verifyAccount: "account verified successfully" },
    file: { ...generateMessages('file'), required: "file is required" },
    password: { invalidCredential: "invalidCredential" },
    wishlist: { ...generateMessages('wishlist'), addedSuccessfully: "added successfully" },
    review: generateMessages('review'),
    coupon:generateMessages('coupon')
}