import { makeLogger } from './utils'
const { info, warn } = makeLogger('forward')

/**
 * Higher-order function that returns a function, which forwards events based on
 * their type to the function on the corresponding key in the given `mapping`
 * object.
 *
 * @param  {Object} mapping
 * @return {Function} that maps events and calls the corresponding function
 */
export default function forward (mapping) {
  return event => {
    const { type } = event
    if (mapping.hasOwnProperty(type)) {
      if (typeof mapping[type] === 'function') {
        info(`forwarded "${type}" event to function "${mapping[type].name}"`)
        return mapping[type](event)
      } else warn(`invalid mapping for "${type}" event (not a function!)`)
    } else warn(`"${type}" event not mapped`)
  }
}
