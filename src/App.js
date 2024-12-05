import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import * as functions from './helper';
import { useAuthContext } from './hooks/auth';
import { library } from '@fortawesome/fontawesome-svg-core'

import { useEffect, useState } from 'react';
import Login from './pages/login/login';
import Session from './pages/session';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

library.add(fab, fas, far)
window.helper = functions;

function App() {
	const { ready, user, dispatch } = useAuthContext();
	const [isNavigate, setIsNavigate] = useState(null);

	const ProtectedRoute = () => {
		if (!user) {
			return <Navigate to='/login' />;
		}
		return <Outlet />;
	}

	const ToNavigate = () => {
		const navigate = useNavigate();
		useEffect(() => {
			if(isNavigate?.path) {
				navigate(isNavigate.path, {
					state: {
						error: isNavigate.error
					}
				})
			}
		}, [isNavigate])
	}

	return ( 
		ready && (
			<BrowserRouter>
				<ToNavigate />
				<Routes>
					<Route path='' element={<Session />}>
						<Route path='' element={<Navigate to={user ? '/dashboard' : '/login'}/>}></Route>
						<Route path='/login' element={user ? <Navigate to={'/dashboard'}/> : <Login />}></Route>
						<Route path='/register' element={<Register />}></Route>
						<Route element={<ProtectedRoute />}>
							<Route path='/dashboard' element={<Dashboard />}></Route>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		)
  	);
}
export default App;
