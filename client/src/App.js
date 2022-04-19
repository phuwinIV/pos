import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'antd/dist/antd.css';
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import Register from './pages/Register';
import Login from './pages/Login';
import Bills from './pages/Bills';

import Employee from './pages/Employee';

function App() {
   return (
      <div className='App'>
         <BrowserRouter>
            <Routes>
               <Route
                  path='/'
                  element={
                     <ProtectedRoute>
                        <Homepage />{' '}
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/items'
                  element={
                     <ProtectedRoute>
                        {' '}
                        <Items />{' '}
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/bills'
                  element={
                     <ProtectedRoute>
                        <Bills />{' '}
                     </ProtectedRoute>
                  }
               />
               <Route
                  path='/employee'
                  element={
                     <ProtectedRoute>
                        <Employee />{' '}
                     </ProtectedRoute>
                  }
               />

               <Route
                  path='/register'
                  element={
                     <ProtectedRoute>
                        {' '}
                        <Register />{' '}
                     </ProtectedRoute>
                  }
               />
               <Route path='/login' element={<Login />} />
            </Routes>
         </BrowserRouter>
      </div>
   );
}

export default App;

export function ProtectedRoute({ children }) {
   if (localStorage.getItem('posUser')) {
      return children;
   } else {
      return <Navigate to='/login' />;
   }
}
