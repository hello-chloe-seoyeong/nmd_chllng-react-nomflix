import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Tv from "./Routes/Tvshow";
import Search from "./Routes/Search";
import Home from "./Routes/Home";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/:tvId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/:searchId" element={<Search />} />
        </Route>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:movidId" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
