import React, { useState } from "react";
import OrganizedEvents from "./components/OrganizedEvents";
import VisitedEvents from "./components/VisitedEvents";
import { buttonOrganized, buttonVisited } from "./style";

type TabNameType = "visited" | "organized";

const EventsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabNameType>("visited");

  const handleTabChange = (tabName: TabNameType): void => {
    setActiveTab(tabName);
  };

  return (
    <div className="h-screen ">
      <div className="pb-[20px] flex justify-center  items-center">
        <button
          className={buttonVisited}
          onClick={() => handleTabChange("visited")}
        >
          Посещаемые мероприятия
        </button>

        <button
          className={buttonOrganized}
          onClick={() => handleTabChange("organized")}
        >
          Организуемые мероприятия
        </button>
      </div>
      {activeTab === "visited" && <VisitedEvents />}
      {activeTab === "organized" && <OrganizedEvents />}
    </div>
  );
};

export default EventsTabs;
