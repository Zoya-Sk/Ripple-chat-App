import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/Auth";
import { userSlice } from "./slices/User";
import { socketSlice } from "./slices/Socket";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    socketIo: socketSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socketIo.socket"], // socket ko ignore karo
        ignoredActions: ["socketIo/setSocket"],
      },
    }),
});
