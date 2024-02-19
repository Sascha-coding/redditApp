import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Routes,
    Link,
    BrowserRouter,
  } from "react-router-dom";
import routes from "./Routes";
import AppLayout from "../AppLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout/>}>
                    <Route></Route>
                    <Route></Route>
                    <Route></Route>
                    <Route></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}