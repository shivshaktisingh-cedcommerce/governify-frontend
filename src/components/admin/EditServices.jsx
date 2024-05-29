import { Button, Input, Select } from "antd";
import { settings } from "../../utils/tools";
import { useEffect, useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { fetcher } from "../../utils/helper";
import ColumnGroup from "antd/es/table/ColumnGroup";

export const EditServices = ({data , setShowSkeleton , setLoading , loading  , setModalOpen}) =>{
    const {link_btn_bg , link_btn_color ,link_headtitle } = settings;
    const [formListing , setFormListing] = useState([]);    
    const [categoryListig , setCategoryListing] = useState([]);    
    const [serviceData , setServiceData] = useState({
        title:data.title ,
        description:data.description ,
        image:{} ,
        form:data.form.id ,
        service_category_id:data.service_categorie.id ,
    })


    const handleCategoryChange = (e) =>{
       setServiceData({...serviceData , service_category_id:e})
    }



    const handleFormChange = (e) =>{
        setServiceData({...serviceData , form:e})
    }


   const handleCreateServices = async() =>{
    // console.log(serviceData.image ,'serviceData')
    let method = "POST";
    let url = 'http://127.0.0.1:8000/governify/admin/serviceRequests/create';

  
    let payload = JSON.stringify({title: serviceData.title , description:serviceData.description , form:serviceData.form , service_categorie_id:serviceData.service_category_id , image: serviceData.image});
    


    try{
        const response = await fetcher(url , method , payload);
        if(response.status){
          setShowSkeleton(true);
          setModalOpen(false);
        }
      }catch(err){
         console.log(err , 'error')
      }
   }




    const getAllForms  = async() =>{
      let method = "GET";
      let url = 'http://127.0.0.1:8000/governify/admin/serviceRequestForms';
       
        try{
          const response = await fetcher(url , method);
            if(response.status){
                setFormListing(response.response.map((item)=>{
                return {label: item.name , value: item.id}
              }));
              setShowSkeleton(false);
            }      
            
        }catch(err){
          throw new Error('Network response was not ok '  , err);
        }finally{
        }
   }

   const getAllCategories  = async() =>{
    let method = 'GET';
    let url = 'http://127.0.0.1:8000/governify/admin/serviceCategories';
    

    try{
      const response = await fetcher(url , method);
        if(response.status){
          setCategoryListing(response.response.map((item)=>{
            return {label: item.title , value: item.id}
          }));
          setShowSkeleton(false);
        }      
        
    }catch(err){
      throw new Error('Network response was not ok '  , err);
    }
}

  const handleTitleChange = (e) =>{
    setServiceData({...serviceData , title:e.target.value});
  }


  const handleDescriptionChange = (e) =>{
    setServiceData({...serviceData , description:e.target.value});
  }

  const handleFileSelect = (data) =>{
    setServiceData({...serviceData , image:data});
  }


   useEffect(()=>{
    getAllForms();
    getAllCategories();
  } ,[])




    return (
        <>

        <div title="status visibility manage" style={{ maxWidth: '550px', width: '100%' , marginTop:'25px'}}>    
            <div>
            <div class="text-white" style={{ backgroundColor: link_headtitle }}>
                <p class="p-2 m-0 fs-5"><strong>Create Services</strong></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <div>
                    
                <ImageUpload onFileSelect={handleFileSelect} image={null} />
                </div>
                <Input placeholder="Service Title" className="mt-30" onChange={handleTitleChange} value={serviceData.title} addonBefore="Title"/>
                <Input placeholder="Service description" className="mt-10" onChange={handleDescriptionChange} value={serviceData.description} addonBefore="Description"/>
                <div className="mt-10">
              <Select
                showSearch
                placeholder='Select Forms'
                style={{width:"100%"}}
                popupMatchSelectWidth={false}
                placement='bottomLeft'
                onChange={handleFormChange}
                options={formListing}
                value={serviceData.form}
              />
              </div>
              <div className="mt-10">
              <Select
              showSearch
                placeholder='Select Category'
                style={{width:"100%"}}
                popupMatchSelectWidth={false}
                placement='bottomLeft'
                onChange={handleCategoryChange}
                options={categoryListig}
                value={serviceData.service_category_id}
              />
              </div>

             
               
                 <div style={{display:'flex' , justifyContent:'center'}} className="mt-60">
                 <Button className="mt-10" style={{background:link_btn_bg , color:link_btn_color , border:'none'}} onClick={handleCreateServices}>Create</Button>

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}