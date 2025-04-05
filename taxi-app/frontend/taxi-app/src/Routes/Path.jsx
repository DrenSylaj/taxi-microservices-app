import UserPage from "../UserPage";
import TestPage from "../components/TestPage";
import SubCategory from "../components/SubCategory";

const pathArray = [
    {
      title: "Dashboard",
      components: [
        {
          name: "UserPage",
          path: "/:userId",
          logo: "🏠",
          components: <UserPage />,
        },
        { name: "TestPage", path: "/", logo: "📊", components: <TestPage /> },
      ],
    },
    {
      title: "User Management",
      components: [
        {
          name: "SubCategory",
          path: "/sub",
          logo: "👥",
          components: <SubCategory />,
        },
      ],
    },
  ];
  export default pathArray