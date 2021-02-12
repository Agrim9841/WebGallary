import React, { createContext, useContext, useReducer} from 'react';

//preparing the data layer
export const StateContext = createContext();

//the provider that wraps our app
export const StateProvider=({ reducer, initialState, children }) => (
	<StateContext.Provider value={useReducer(reducer, initialState)}>
		{children}
	</StateContext.Provider>
);

//pull information from the data layer
export const useStateValue = () => useContext(StateContext);