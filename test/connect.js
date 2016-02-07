import connect from '../src/index'
const expect = require('chai').expect

const dummyProtocol = (config, register, dispatch) => {
  register('test', () => {
    return 'It works!'
  })

  setTimeout(() => {
    if (config.multipleParams) {
      dispatch('test event', {success: true}, false)
    } else {
      dispatch('test event', {success: true})
    }
  }, 5)
}

describe('connect function', () => {
  describe('core functionality', () => {
    it('should return an error if protocol is not defined', (done) => {
      expect(() => { connect({}) }).to.throw(Error)

      done()
    })

    it('should return an error if the protocol is not a function or a string', (done) => {
      expect(() => { connect({ protocol: 4 }) }).to.throw(Error)

      done()
    })

    it('should return an error if the protocol can not be found', (done) => {
      expect(() => { connect({ protocol: 'somestupidprotocolthatshouldntexist' + Math.floor(Math.random() * 999) }) }).to.throw(Error)

      done()
    })

    it('should return an object with two functions - "on" and "call"', (done) => {
      let c = connect({
        protocol: dummyProtocol
      })

      expect(c.on).to.exist
      expect(c.call).to.exist

      done()
    })
  })

  describe('event dispatcher', () => {
    it('should successfully dispatch the events to be subscribed to', (done) => {
      let c = connect({
        protocol: dummyProtocol
      })

      c.on('test event', () => {
        done()
      })
    })

    it('should pass paraemeters to the event callback', (done) => {
      let c = connect({
        protocol: dummyProtocol
      })

      c.on('test event', (e) => {
        expect(e.success).to.eql(true)

        done()
      })
    })

    it('allow multiple parameters in the event callback', (done) => {
      let c = connect({
        protocol: dummyProtocol,
        multipleParams: true
      })

      c.on('test event', (e, bool) => {
        expect(e.success).to.eql(true)
        expect(bool).to.eql(false)

        done()
      })
    })
  })

  describe('register() and call()', () => {
    it('should throw an error if there\'s no method registered', (done) => {
      let c = connect({
        protocol: dummyProtocol
      })

      expect(() => { c.call('bleh') }).to.throw(Error)

      done()
    })

    it('should return whatever the registered function returns to the user', (done) => {
      let c = connect({
        protocol: dummyProtocol
      })

      expect(c.call('test')).to.eql('It works!')

      done()
    })
  })
})
