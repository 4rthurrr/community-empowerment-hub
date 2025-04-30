import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { PanelLeftOpen, LogOut, Package, ClipboardList, LayoutDashboard, FileBarChart2 } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileBarChart2,
    },
    {
      name: "Features",
      href: "/admin/features",
      icon: Package,
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Community Hub</h2>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 px-4 mt-10">
            <div className="w-full space-y-1">
              {adminNavItems.map((item) => (
                <Button
                  key={item.name}
                  variant={
                    location.pathname === item.href ? "default" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </div>
            <div className="w-full space-y-1 mt-auto mb-5">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <PanelLeftOpen className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white h-full">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Community Hub</h2>
                <p className="text-sm text-muted-foreground">Administrator</p>
              </div>
            </div>
            <div className="flex flex-col flex-1 px-4 mt-10">
              <div className="space-y-1">
                {adminNavItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={
                      location.pathname === item.href ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                ))}
              </div>
              <div className="space-y-1 mt-auto mb-5">
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
