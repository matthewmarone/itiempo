import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { RouteWithLayout } from "./components";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";
import {
  EmployeeList as EmployeeListView,
  NotFound as NotFoundView,
  Employee as EmployeeView,
  Home as HomeView,
  Report as ReportView,
} from "./views";

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <RouteWithLayout
        component={HomeView}
        exact
        layout={MainLayout}
        path="/home"
      />
      <RouteWithLayout
        component={EmployeeView}
        exact
        layout={MainLayout}
        path="/employees/:id"
      />
      <RouteWithLayout
        component={EmployeeListView}
        exact
        layout={MainLayout}
        path="/employees"
      />
      <RouteWithLayout
        component={ReportView}
        exact
        layout={MainLayout}
        path="/report"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/page-not-found"
        allowUnauthenticated={true}
      />
      <Redirect to="/page-not-found" />
    </Switch>
  );
};

export default Routes;
