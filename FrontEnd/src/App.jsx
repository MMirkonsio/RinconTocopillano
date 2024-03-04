import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import Publicaciones from './components/Publicaciones';
import PublicacionScreen from './screens/PublicacionScreen';


function App() {
  return (
    <Router>
      <div className="bg-gray-100 overflow-hidden flex flex-col h-screen dark:bg-gray-900 dark:text-gray-100">
        {/* Aca se mostrará cualquier componente en todas las rutas */}
        <Navbar />

        {/* Rutas */}
        <Routes>
          <Route
            path="/"
            element={
                <HomeScreen />

            }
          />
          <Route
            path="/inicio"
            element={
              <div className="flex items-center justify-center lg:mt-10 lg:ml-auto mt-24 lg:w-5/6">
                <HomeScreen />
              </div>
            }
          />
          <Route
            path="/publicaciones"
            element={
              <div className="flex items-center relative lg:left-80 lg:top-10 m-3 top-24 w-fit">
                <Publicaciones />
              </div>
            }
          />
          <Route
            path="/publicar"
            element={
              <div className="flex items-center relative lg:left-80 lg:top-10 m-3 top-24 ">
                <PublicacionScreen />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
