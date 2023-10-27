import { configureStore } from '@reduxjs/toolkit'
import homeReducer from '../features/homeview/controller/home_view_controller'
export  const store = configureStore({
  reducer: {
   home: homeReducer,
  },
})