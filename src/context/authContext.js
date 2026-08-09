import { createContext } from 'react';


// we keep this on in its own module so that AuthContext.jsx exports only the component and useAuth.js exports only but a hook. 
//this is for a fast refresh
 
export const AuthContext = createContext(null);