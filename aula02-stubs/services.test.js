const Service = require('./services')
const sinon = require('sinon')
const { deepStrictEqual } = require('assert')

const BASE_URL_1 = "https://swapi.dev/api/planets/1/"
const BASE_URL_2 = "https://swapi.dev/api/planets/2/"


//node services.test.js > mocks/{name}.json -> Generate content with result out
const mocks = {
    'tatooine' : require('./mocks/tatooine.json'),
    'alderaan' : require('./mocks/alderaan.json')
}

;
(async() => {
    // {
    //     const service = new Service()
    //     const withoutStubs = await service.makeRequest(BASE_URL_2)
    //     console.log(JSON.stringify(withoutStubs))
    // }

    const service = new Service()
    const stub = sinon.stub(service, service.makeRequest.name)

    stub
        .withArgs(BASE_URL_1)
        .resolves(mocks.tatooine)

    stub
        .withArgs(BASE_URL_2)
        .resolves(mocks.alderaan)    
    
    {
        const expected = { name: 'Tatooine', surfaceWater: '1', appearedIn: 5 }
        const respose = await service.getPlanets(BASE_URL_1)
        deepStrictEqual(respose,expected)
    }

    {
        const expected = { name: 'Alderaan', surfaceWater: '40', appearedIn: 2 }
        const respose = await service.getPlanets(BASE_URL_2)
        deepStrictEqual(respose,expected)
    }

})()