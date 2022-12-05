export default (state, action) => {
  switch (action.type) {
    case 'ENTERED':
      return {
        ...state,
        entered: true,
        userName: action.payload.userName,
        chatId: action.payload.chatId,
      };
    case 'SET_DATA':
      return {
        ...state,
        users: action.payload.users,
        messages: action.payload.messages,
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};
