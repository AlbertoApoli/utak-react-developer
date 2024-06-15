import { createContext, useContext, useEffect, useState } from "react";

const initialState = { isOpen: true, handleToggle: () => {} };

const UserInterfaceContext = createContext(initialState);

export function UserInterfaceProvider({ children }) {
  const [isOpen, setIsOpen] = useState(() => {
    const saveState = localStorage.getItem("isOpen");
    return saveState !== null ? JSON.parse(saveState) : true;
  });


  function onToggle() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <UserInterfaceContext.Provider value={{ isOpen, onToggle }}>
      {children}
    </UserInterfaceContext.Provider>
  );
}

export function useUserInterface() {
  const context = useContext(UserInterfaceContext);
  if (context === undefined)
    throw new Error("Context was used outside provider.");
  return context;
}
