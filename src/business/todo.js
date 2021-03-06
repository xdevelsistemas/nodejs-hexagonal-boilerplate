/**
 * reference only imports (for documentation)
 */
// eslint-disable-next-line no-unused-vars
import { Todo, MutateTodoInput, MutateTodoOutput } from './index'
/**
 * code imports
 */
import { v4 as uuidv4 } from 'uuid'
import { toISOString } from './moment'
import { ETodoStatus, EPriority } from './constants'
import R from 'ramda'
// import { EPriority, ETodoStatus } from './constants'
import {
  EClassError,
  throwCustomError,
  // eslint-disable-next-line no-unused-vars
  CustomError
} from '../utils'

/**
 * @description Validate a Todo event on creation
 * @memberof business
 * @function
 * @throws {CustomError}
 * @param {Todo} data imput data for create task
 * @param {string} owner owner of the task
 * @returns {Todo}
 */
export const validateCreateTodo = (data, owner) => {
  const creationDate = toISOString()

  if (R.isNil(data) || R.isNil(data.taskDescription)) {
    return throwCustomError(new Error('invalid entry on field data, missing information'), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  if (R.isNil(owner)) {
    return throwCustomError(new Error('owner is missing'), 'business.protocol.validateCreasteTodo', EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.taskPriority)) && R.not(Object.values(EPriority).includes(data.taskPriority)))) {
    return throwCustomError(new Error(`invalid value for priority: got ${data.taskPriority}`), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.taskStatus)) && R.not(Object.values(ETodoStatus).includes(data.taskStatus)))) {
    return throwCustomError(new Error(`invalid value for status: got ${data.taskStatus}`), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  return {
    // default values if is missing
    taskOrder: 0,
    taskPriority: EPriority.LOW,
    taskStatus: ETodoStatus.NEW,
    ...data,
    // information from system
    taskOwner: owner,
    creationDate,
    id: uuidv4()
  }
}

/**
   * @description Validate a Todo event on update
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {MutateTodoInput} data update task input
   * @param {Todo} originalData current task data
   * @param {string} owner owner of the task
   * @returns {MutateTodoOutput}
   */
export const validateUpdateTodo = (data, originalData, owner) => {
  const lastUpdateDate = toISOString()

  if (R.isNil(originalData)) {
    throwCustomError(new Error('no data for this id'), 'business.protocol.validateUpdateTodo', EClassError.USER_ERROR)
  }

  if (R.isNil(data) || R.isNil(data.taskDescription)) {
    throwCustomError(new Error('invalid entry on field data, missing information'), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  if (R.isNil(owner)) {
    throwCustomError(new Error('owner is missing'), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.taskPriority)) && R.not(Object.values(EPriority).includes(data.taskPriority)))) {
    throwCustomError(new Error(`invalid value for priority: got ${data.taskPriority}`), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  if ((R.not(R.isNil(data.taskStatus)) && R.not(Object.values(ETodoStatus).includes(data.taskStatus)))) {
    throwCustomError(new Error(`invalid value for status: got ${data.taskStatus}`), 'business.protocol.validateCreateTodo', EClassError.USER_ERROR)
  }

  return ['taskOwner', 'id']
    .reduce(
      (reducedData, field) => R.dissoc(field, reducedData),
      {
        ...originalData,
        ...data,
        lastUpdateDate
      }
    )
}

/**
   * @description Validate a Todo event on delete
   * @memberof business
   * @function
   * @throws {CustomError}
   * @param {Todo} originalData current task data
   * @param {string} owner owner of the task
   * @returns {Todo}
   */
export const validateDeleteTodo = (originalData, owner) => {
  if (R.isNil(originalData)) {
    throwCustomError(new Error('no data for this id'), 'business.protocol.validateDeleteTodo', EClassError.USER_ERROR)
  }

  if (R.isNil(owner)) {
    throwCustomError(new Error('owner is missing'), 'business.protocol.validateDeleteTodo', EClassError.USER_ERROR)
  }

  return originalData
}
