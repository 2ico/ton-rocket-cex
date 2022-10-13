import { configureStore } from '@reduxjs/toolkit'
import filterParamReducer from '@/context/currencyPairSlice'

export const store = configureStore({
    reducer: {
        filterParam: filterParamReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch