import path from 'path'
import fs from 'fs'
export const deleteFile = (fullPath) => {
    const x = fs.unlinkSync(path.resolve(fullPath))
}