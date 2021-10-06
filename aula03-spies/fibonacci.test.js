const Fibonacci = require('./fibonacci')
const sinon = require('sinon')
const {deepStrictEqual} = require('assert')
;

(async() => {
    {
        const fibonacci = new Fibonacci()
        const spy = sinon.spy(fibonacci,fibonacci.execute.name)
        //generators retornam iterators, (.next)
        //existem  3 formas  .next, for await e rest/spread
        for await (const i of fibonacci.execute(3)){}

        //inicia no zero
        const expectedCallCount = 4
        deepStrictEqual(spy.callCount, expectedCallCount)
    }
    {
        const fibonacci = new Fibonacci()
        const spy = sinon.spy(fibonacci,fibonacci.execute.name)
        //generators retornam iterators, (.next)
        //existem  3 formas  .next, for await e rest/spread
        const [...results] = fibonacci.execute(5)

        //pega argumentos da chamada 2
        const {args} = spy.getCall(2)
        const expectedResult = [0,1,1,2,3]
        // os parametros devem ser estes no momento da chamada 2
        const expectedParams = Object.values({
            input : 3,
            current: 1,
            next: 2
        })

        deepStrictEqual(args, expectedParams)
        deepStrictEqual(results, expectedResult)
    }

})();