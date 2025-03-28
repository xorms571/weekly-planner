"use client";

import PlannerContainer from "./components/PlannerContainer";


export default function Home() {

  return (
    <div>
      <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold m-auto text-center my-10 px-14">WEEKLY PLANNER</h1>
      <PlannerContainer/>
    </div>
  );
}
