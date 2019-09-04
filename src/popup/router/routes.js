import PageIndex from "./pages/Index";
import PageOptions from "./pages/Options";
import PageService from "./pages/Service";

export default [
  {
    path: "/",
    component: PageIndex
  },
  {
    path: "/options",
    component: PageOptions
  },
  {
    path: "/service",
    component: PageService
  }
];
