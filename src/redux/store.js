import { configureStore } from '@reduxjs/toolkit'
import {homeReducer} from '../features/homeview/controller/home_view_controller'
import { combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
export const storee = configureStore({
  reducer:combineReducers({
   home: homeReducer
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(thunk),
})