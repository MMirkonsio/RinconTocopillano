// auth.js
import { useState, useEffect } from 'react';

// En la función login
export const login = (user) => {
  if (user.id && user.nombre_usuario) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    console.error("El objeto de usuario no tiene los campos necesarios:", user);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user && user.id && user.nombre_usuario) {
      return user;
    }
  }
  return null;
};

export const useAuth = () => {
  const [user, setUser] = useState(getUser() || null);

  const updateUser = () => {
    const storedUser = getUser();

    if (storedUser && storedUser.id && storedUser.nombre_usuario) {
      setUser(storedUser);
    }
  };

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser && storedUser.id && storedUser.nombre_usuario) {
      setUser(storedUser);
    }
  }, []);
  
  

  return { user, updateUser };
};
