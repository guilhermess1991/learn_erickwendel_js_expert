const { readFile } = require('fs/promises');
const { join } = require('path');
const { error } = require('./constants');
const User = require('./User');

const DEFAULT_OPTION = {
    maxLines : 3,
    fields : ["id","name","profession","age"]
}


class File {
    static async csvToJson(filePath){
        const content = await File.getFileContent(filePath);
        const validation = File.isValid(content);
        if(!validation.valid) throw new Error(validation.error);
        const users = File.parseCSVToJSON(content);
        return users;
    }

    static async getFileContent(filePath){    
        return (await readFile(filePath)).toString("utf8");        
    }

    static isValid(csvString, options = DEFAULT_OPTION){        
        const [header , ...fileWithoutHeader] = csvString.split('\r\n')
        const isHeaderValid = header == (options.fields.join(','))
        if(!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        const isContentLengthAccepted = (
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.maxLines
        )

        if(!isContentLengthAccepted){
            return {
                error : error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid : true}
    }

    static parseCSVToJSON(csvString){
        const lines = csvString.split('\r\n');
        // coloca na variavel somente a primeira linha
        const firstLine = lines.shift();
        const header = firstLine.split(',');
        const users = lines.map(line => {
            const columns = line.split(',')
            let user = {}
            for(const index in columns){
                user[header[index]] = columns[index]; 
            }

            return new User(user)
        })
        return users
    }
}

// (async () => {
//     const result = await File.csvToJson('./../mocks/threeItems-valid.csv');
//     //const result = await File.csvToJson('./../mocks/invalid-header.csv');
//     //const result = await File.csvToJson('./../mocks/fourItems-invalid.csv');
//     //const result = await File.csvToJson('./../mocks/emptyField-invalid.csv');    
//     console.log(result);
// })();

module.exports = File;