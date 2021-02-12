export const initialState = {
	user : null,
	search: '',
};

const reducer = (state, action) => {

	switch(action.type) {

		case 'SET_USER':
			return {
				...state,
				user: action.user,
			};

		case 'SET_SEARCH_ITEM':
			return {
				...state,
				search: action.search,
			};

		default:
			return state;
	}
};

export default reducer;