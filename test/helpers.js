/*globals describe,it*/
import { message } from '../src/index'
const expect = require('chai').expect

describe('message helper', () => {
  it('should accept just `text` parameter', () => {
    let m = message({ text: 'Hello World' })

    expect(m).to.eql({ type: 'message', text: 'Hello World' })
  })

  it('should accept `text` and `chat` parameters', () => {
    let m = message({ chat: '#general', text: 'Hello World' })

    expect(m).to.eql({ type: 'message', chat: '#general', text: 'Hello World' })
  })

  it('should accept additional parameters', () => {
    let m = message({
      chat: '#general', text: 'Hello World',
      protocolSpecificOption: 'something'
    })

    expect(m).to.eql({
      type: 'message',
      chat: '#general', text: 'Hello World',
      protocolSpecificOption: 'something'
    })
  })

  it('should not accept any less than two parameters', () => {
    expect(() => {
      message('#general')
    }).to.throw(Error)
  })
})
