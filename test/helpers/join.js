import {join} from '../../src/index'
const expect = require('chai').expect

describe('helpers.join', () => {
  it('should accept just one parameter', () => {
    let m = join('#general')

    expect(m).to.eql({ type: 'join', channel: '#general' })
  })

  it('should accept more than two parameters', () => {
    let m = join('#general', 'test')

    expect(m).to.eql({ type: 'join', channel: '#general', '0': 'test' })
  })

  it('should throw when there\'s no parameters passed', () => {
    expect(() => {
      join()
    }).to.throw(Error)
  })
})
