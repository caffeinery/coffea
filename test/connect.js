import {connect} from '../src/index'
const expect = require('chai').expect

const dummyProtocol = (config, register, dispatch) => {
  setTimeout(() => {
    if (config.multipleParams) {
      dispatch('test event', {success: true}, false)
    } else {
      dispatch('test event', {success: true})
    }
  }, 5)
}

describe('coffea.connect', () => {
  describe('core functionality', () => {
    it('should return an error if protocol is not defined', (done) => {
      expect(() => { connect({}) }).to.throw

      done()
    })

    it('should return an error if the protocol is not a function or a string', (done) => {
      expect(() => { connect({ protocol: 4 }) }).to.throw

      done()
    })

    it('should return an error if the protocol can not be found', (done) => {
      expect(() => { connect({ protocol: 'somestupidprotocolthatshouldntexist' + Math.floor(Math.random() * 999) }) }).to.throw

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
})
