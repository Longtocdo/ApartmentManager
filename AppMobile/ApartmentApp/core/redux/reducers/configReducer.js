const initialState = {
    isLoading: false,
  };
  
  const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SHOW_LOADING':
        return { ...state, isLoading: true };
      case 'HIDE_LOADING':
        return { ...state, isLoading: false };
      default:
        return state;
    }
  };
  
  export default loadingReducer;



  export const showLoading = () => ({
    type: 'SHOW_LOADING',
  });
  
  export const hideLoading = () => ({
    type: 'HIDE_LOADING',
  });


  export const loadingActions = {
    showLoading,
    hideLoading
};