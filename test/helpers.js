/*globals describe,it*/
import { message } from '../src/index'
const expect = require('chai').expect

describe('message helper', () => {
  it('should accept just `text` parameter', () => {
    let m = message('Hello World')

    expect(m).to.eql({ type: 'message', chat: undefined, text: 'Hello World' })
  })

  it('should accept `text` and `chat` parameters', () => {
    let m = message('Hello World', '#general')

    expect(m).to.eql({ type: 'message', chat: '#general', text: 'Hello World' })
  })

  it('should accept additional parameters', () => {
    let m = message('Hello World', '#general', { protocolSpecificOption: 'something' })

    expect(m).to.eql({
      type: 'message',
      chat: '#general', text: 'Hello World',
      protocolSpecificOption: 'something'
    })
  })
})

describe('message helper (object)', () => {
  it('should accept just `text` parameter', () => {
    let m = message({ text: 'Hello World' })

    expect(m).to.eql({ type: 'message', chat: undefined, text: 'Hello World' })
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
})
