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
    user: generateMessages('user'),
    file: { ...generateMessages('file'), required: "file is required" }
}