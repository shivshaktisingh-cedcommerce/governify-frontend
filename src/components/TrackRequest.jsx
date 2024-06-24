import { useLocation } from "react-router-dom"
import Hero from "./common/Hero"
import { BreadcrumbComponent } from "./common/BreadcrumbComponent";
import { SearchBox } from "./common/SearchBox";
import { RequestComponent } from "./RequestComponent";
import { useEffect, useState  } from "react";
import { fetcher } from "../utils/helper";
import { Button, Radio } from "antd"
import { SortBy } from "./SortBy";
import { FilterBy } from "./FilterBy";
import { ExportBy } from "./ExportBy";
import { Loader } from "./common/Loader";



export const TrackRequest = () =>{
    const [data , setData] = useState([])
    const [boardId , setBoardId] = useState('')
    const [selectedOrder , setSelectedOrder]= useState(1);
    const [selectedFilter , setSelectedFilter]= useState(9);
    const [statusItems , setStatusItems] = useState([]);
    const [searchData , setSearchData]= useState('');
    const [loading , setLoading] = useState(false);
    const [cursor , setCursor] = useState('');

    const items = [
        {
          key: '1',
          label: (
            <Radio.Group onChange={()=>onChangeRadio('ASC')} value={selectedOrder}>
             <Radio value={1}>Asc</Radio>
            </Radio.Group>
    
          ),
        },
        {
          key: '2',
          label: (
            <Radio.Group onChange={()=>onChangeRadio('DESC')} value={selectedOrder}>
             <Radio value={2}>Desc</Radio>
            </Radio.Group>
          ),
        },
        
      ];
      

      const onChangeRadio = (item) =>{
        if(item === 'ASC'){
         setSelectedOrder(1)
        }
        if(item === 'DESC'){
            setSelectedOrder(2)
        }
      }

      const onChangeRadioFilter = (key , value) =>{
        setSelectedFilter(key);
      }

    const location = useLocation();
    const breadCrumbData = location.pathname.split('/'); 

    const getFilterColumns = (items) =>{
        let listOfStatus = {};
     items.forEach((subItem)=>{
        if (subItem.title === 'Overall Status'){
        listOfStatus = JSON.parse(subItem.settings_str)
        }
      })

      let updatedFilterColumn = [{
        key: 1,
        label: (
          <Radio.Group onChange={()=>onChangeRadioFilter(9 ,'All')} value={selectedFilter}>
           <Radio value={9}>All</Radio>
          </Radio.Group>
  
        ),
      }]

      Object.entries(listOfStatus.labels).forEach(([key, value] , index) => {
        updatedFilterColumn.push( {
                  key: index + 2,
                  label: (
                    <Radio.Group onChange={()=>onChangeRadioFilter(key , value)} value={selectedFilter}>
                     <Radio value={key}>{value}</Radio>
                    </Radio.Group>
            
                  ),
                })
    });

        setStatusItems(updatedFilterColumn);
    }

    const onChangeSearchData = (str) =>{
      setSearchData(str);
    }

    const fetchData = async() =>{
      setLoading(true);
        try{
            let url = 'governify/customer/requestTracking';
            let method = 'POST';
            let payload = JSON.stringify({
              "query_params": {
                  "order_by": [
                      {
                          "direction": selectedOrder === 1 ? 'asc' : 'desc',
                          "column_id": "__creation_log__"
                      }
                  ],
                  "rules": [
                      ...(searchData.length > 0 ? [{
                          "column_id": "name",
                          "compare_value": [searchData],
                          "operator": "contains_text"
                      }] : []),
                      ...(selectedFilter !== 9 ? [{
                          "column_id": "status__1",
                          "compare_value": [+selectedFilter]
                      }] : [])
                  ]
              }
          });
                     
            const response = await fetcher(url , method , payload);
            setData(response.response.data.boards[0].items_page.items);
            setBoardId(response.response.data.boards[0].id);
            getFilterColumns(response.response.data.boards[0].columns);
            setCursor(response.response.data.boards[0].items_page.cursor);
            
        }catch(err){
            console.log(err , 'error');
        }finally{
          setTimeout(()=>{
            setLoading(false);
          } , 2000)

        }
    }

    const handleLoadMore = async() =>{
      setLoading(true);
        try{
            let url = 'governify/customer/requestTracking';
            let method = 'POST';
            let payload = JSON.stringify({
              "cursor":cursor ,
              
          });
                     
            const response = await fetcher(url , method , payload);
            console.log(response , 'response');
            let tempData = [...data , ...response.response.data.boards[0].items_page.items];
            console.log(tempData)
            setData(tempData);
            setBoardId(response.response.data.boards[0].id);
            // getFilterColumns(response.response.data.boards[0].columns);
            setCursor(response.response.data.boards[0].items_page.cursor);
            
        }catch(err){
            console.log(err , 'error');
        }finally{
          setTimeout(()=>{
            setLoading(false);
          } , 2000)

    }
  }

    

    useEffect(()=>{
     
        fetchData();
    
    } ,[selectedOrder , selectedFilter , searchData])



    return (
        <div style={{paddingLeft:"16px" , paddingRight:"16px"}}>
          {loading && <Loader/>}
            <Hero
				heading={"Request Tracking"}
				subheading="Track your onboarding progress effortlessly by using our request-tracking center."
				forHome={false}
			/>
            <BreadcrumbComponent data={breadCrumbData} />
            <SearchBox onChangeSearchData={onChangeSearchData} searchData={searchData}/>
            <div style={{display:'flex' , justifyContent:'left' , paddingTop:'8px' , marginBottom:'32px'}}>
                <SortBy items={items}/>
                <FilterBy items={statusItems}/>
                <ExportBy />
            </div>
      <RequestComponent data={data} boardId={boardId} fetchData={fetchData}  />
      <div className="mt-10">
      {!loading && <Button onClick={handleLoadMore}>Load More</Button>}

      </div>
            
        </div>
    )
}