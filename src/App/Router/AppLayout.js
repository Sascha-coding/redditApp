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
import App from "../App";

export default function AppLayout() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route></Route>
                    <Route></Route>
                    <Route></Route>
                    <Route></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}