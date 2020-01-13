import { AsyncStorage } from 'react-native'
import createDataContext from './createDataContext'
import trackerApi from '../api/tracker'
import { navigate } from '../navigationRef'

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SIGNIN':
            return { ...state, token: action.payload }
        case 'SIGNOUT':
            return { ...state, token: null, errorMessage: '' }
        case 'ADD_ERROR':
            return { ...state, errorMessage: action.payload }
        case 'CLEAR_ERROR_MESSAGE':
            return { ...state, errorMessage: '' }
        default:
            return state
    }
}

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' })
}

const signup = dispatch => async ({ email, password }) => {
    try {
        const response = await trackerApi.post('/signup', { email, password })
        await AsyncStorage.setItem('token', response.data.token)
        dispatch({ type: 'SIGNIN', payload: response.data.token })
        navigate('TrackList')
    } catch (error) {
        dispatch({ type: 'ADD_ERROR', payload: 'Something went wrong with sign up' })
    }
}

const signin = dispatch => async ({ email, password }) => {
    try {
        const response = await trackerApi.post('/signin', { email, password })
        await AsyncStorage.setItem('token', response.data.token)
        dispatch({ type: 'SIGNIN', payload: response.data.token })
        navigate('TrackList')
    } catch (error) {
        dispatch({ type: 'ADD_ERROR', payload: 'Something went wrong with sign in' })
    }
}

const tryLocalSignin = dispatch => async () => {
    try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            dispatch({ type: 'SIGNIN', payload: token })
            navigate('TrackCreate')
        }
    } catch (error) {
        dispatch({ type: 'ADD_ERROR', payload: 'Something went wrong with sign in' })
    }
}

const signout = dispatch => async () => {
    try {
        await AsyncStorage.removeItem('token')
        dispatch({ type: 'SIGNOUT' })
        navigate('loginFlow')
    } catch (error) {
        dispatch({ type: 'ADD_ERROR', payload: 'Something went wrong with sign in' })
    }
}

export const { Context, Provider } = createDataContext(authReducer,
    { signup, signin, signout, signout, tryLocalSignin, clearErrorMessage },
    { token: null, errorMessage: '' })