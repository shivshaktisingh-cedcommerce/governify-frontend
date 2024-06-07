import React, { useEffect, useState } from "react";
import HeadTitle from "./home/HeadTitle";
import { SearchBox } from "./common/SearchBox";
import { InternalTab } from "./InternalTab";
import { fetcher } from "../utils/helper";

const Home = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [searchData , setSearchData] = useState([])

  const getDashboardData = async () => {
    try {
      const response = await fetcher(
        "governify/customer/dashboard",
        "GET"
      );
      setDashboardData(response.response); // Assuming response structure is { response: [...] }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error, show message, etc.
    }
  };

  const getSearchedServices= () =>{
    
  }

  useEffect(() => {
    getDashboardData();

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, []);

  useEffect(()=>{
    if(searchData.length > 0){
      getSearchedServices();

    }else{
      getDashboardData();
      console.log('no')

    }
  } ,[searchData])

  return (
    <>
      <HeadTitle />
      <SearchBox setSearchData={setSearchData} searchData={searchData}/>
      <InternalTab data={dashboardData} />
    </>
  );
};

export default Home;
