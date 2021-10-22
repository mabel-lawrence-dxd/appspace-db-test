const resultRepo = require('./main');

async function getAll(){
    try {        
        console.log('In get all')
        const info = await resultRepo.getEmployees();
        console.log(info);
    } catch (error) {
        console.error(error);
    }
}

getAll();