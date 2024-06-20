import { Button, Card,  Input, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { fetcher } from "../../utils/helper";
import { DeleteOutlined } from "@ant-design/icons";

export const CreateForms = ({setShowSkeleton , setLoading , loading  , setModalOpen}) =>{
    const data = JSON.parse(sessionStorage.getItem('settings'));
    const [field , setField] = useState([]);
    const [formDetail , setFormDetail] = useState({formName:''});
    const [categoryListing , setCategoryListing] = useState([]);
    const [servicesListing , setServicesListing] = useState([]);
    const [categoryServicesMapping , setCategoryServicesMapping] = useState([ {
        category_id: '',
        services_id: ''
    }])
 

    const handleDeleteField = (subItem) =>{
     let tempField = field.filter((item) => item.key !== subItem.key);
     setField(tempField)
    }

    const addField = () =>{
       let newField = {
         key: field.length,
         label: '',
         subLabel:'',
         type: "textArea",
         defaultValue:'' ,
         enabled: false ,
         required: false
        }

        let fields = [...field];
        fields.push(newField);
        setField(fields);
    }

    const handleChangeLabel = (event , index) =>{
    const tempField = [...field];
    tempField[index].label = event.target.value;
    setField(tempField)
    
    }

    const publishForm = async() =>{
        let method = 'POST';
        let url = 'governify/admin/serviceRequestForms';
        let categoryData = {
            name: formDetail.formName ,
            form_data: field ,    
            category_services_mapping: categoryServicesMapping
        };

            
        let payload = JSON.stringify(categoryData);
        

    try{
        const response = await fetcher( url , method , payload);
        if(response.status){
          setShowSkeleton(true);
          setModalOpen(false);
        }
      }catch(err){
         console.log(err , 'error')
      }
    }

    const handleChangeFormName = (event) =>{
        setFormDetail({...formDetail , formName:event.target.value});
    }


    const onChangeUploadSettingsEnabled = (index) =>{
        const updatedFields = field.map((item, idx) => {
            if (idx === index) {
                if(item.enabled){
                    return { ...item, type: 'textArea', enabled: false };

                }else{
                    return { ...item, type: 'image', enabled: true };

                }
            } else {
              return { ...item, type: 'textArea', enabled: false };
            }
          });
          setField(updatedFields)
    }

    const onChangeRequiredSettingsEnabled = (index) =>{
      const updatedField = [...field];
      updatedField[index].required = true;
      setField(updatedField)
    }

    const handleChangeLabelOfDocuments = (event , index) =>{
        let tempField = [...field];
        tempField[index].subLabel = event.target.value;
        setField(tempField);
    }


    const getAllCategories  = async() =>{
        let method = "GET";
        let url = 'governify/admin/serviceCategories';
         
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
          }finally{
          }
     }
  
     const getAllServices  = async() =>{
      let method = 'GET';
      let url = 'governify/admin/serviceRequests';
      
  
      try{
        const response = await fetcher(url , method);
          if(response.status){
            setServicesListing(response.response.map((item)=>{
              return {label: item.title , value: item.id}
            }));
            setShowSkeleton(false);
          }      
          
      }catch(err){
        throw new Error('Network response was not ok '  , err);
      }
  }



  const handleCategoryChange = (e , index) =>{
    const tempData = [...categoryServicesMapping];
    tempData[index].category_id = e;  
    setCategoryServicesMapping(tempData)
 }



 const handleServiceChange = (e  , index) =>{
    const tempData = [...categoryServicesMapping];
    tempData[index].services_id = e;  
    setCategoryServicesMapping(tempData)
 }

 const handleAddCatAndServe = () =>{
    const tempData = [...categoryServicesMapping];
    tempData.push({
        category_id: '',
        services_id: ''
    })

    setCategoryServicesMapping(tempData)
 }

 const removeCatAndServe = (index) =>{
    console.log(index)
    const updatedMapping = categoryServicesMapping.slice(0, index).concat(categoryServicesMapping.slice(index + 1));
    setCategoryServicesMapping(updatedMapping);
 }



  
  useEffect(()=>{
    getAllCategories();
    getAllServices();

  } ,[])



    return (
        <>
        <div  style={{  width: '100%' , marginTop:'25px'}}>    
            <div>
            <div class="text-white" style={{ backgroundColor: data.head_title_color }}>
                <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Create Form</strong><Button onClick={addField} style={{border:"none"}}>+ Add Field</Button></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <Input placeholder="Form name" className="mt-10" onChange={(e)=>handleChangeFormName(e)} addonBefore="Form Name"/>
                <div style={{display:"flex" , justifyContent:"end"}} className="mt-10"><Button onClick={handleAddCatAndServe}>Add Category/Services</Button></div>

                <div className="mt-10">
                    {
                        categoryServicesMapping.map((item , index) =>{
                        return (
                            <div key={index}>
                            <div className="mt-10">
                                <Select
                                showSearch
                                placeholder={'Select Category'}
                                style={{width:"100%" , borderRadius:"10px"}}
                                popupMatchSelectWidth={false}
                                placement='bottomLeft'
                                onChange={(e )=>handleCategoryChange(e , index)}
                                options={categoryListing}
                                value={categoryServicesMapping[index].category_id === "" ? "Select Category" : categoryServicesMapping[index].category_id} 
                              />
                            </div>
                            <div className="mt-10">
                                <Select
                                showSearch
                                placeholder='Select Services'
                                style={{width:"100%" , borderRadius:"10px"}}
                                popupMatchSelectWidth={false}
                                placement='bottomLeft'
                                onChange={(e)=>handleServiceChange(e , index)}
                                options={servicesListing}
                                value={categoryServicesMapping[index].services_id === "" ? "Select Service" : categoryServicesMapping[index].services_id} 

                              />
                            </div>
                            <div className="mt-10" style={{display:"flex" , justifyContent:"end"}}>
                            <Button type="text" icon={<DeleteOutlined />}  onClick={()=>removeCatAndServe(index)} />
                            </div>
                            </div>
                        )       
                        })
                    }

                </div>
                

           
                <div className="mt-10">
                    {field.map((item , index) =>{
                        return (
                            <Card className="mt-10">
                                <Input className="mt-10" placeholder="Label" value={item.label} onChange={(event)=>handleChangeLabel(event ,index)} addonBefore="Label"/>
                                <div className="mt-10">
                                <span>Enable Documents Upload</span>
                                <Switch className="ml-10" onChange={()=>onChangeUploadSettingsEnabled(index)} value={item.enabled} />
                                </div>
                                <div className="mt-10">
                                <span>Make Field Required</span>
                                <Switch className="ml-10" onChange={()=>onChangeRequiredSettingsEnabled(index)} value={item.required} />
                                </div>
                                <div className="mt-10">
                                    {item.enabled && <textarea
                                    style={{width:"100%"}}
                                    value={item.subLabel}
                                    onChange={(event)=>handleChangeLabelOfDocuments(event , index)}
                                    placeholder="Enter points (one per line)"
                                    rows={5}
                                    cols={50}
                                    />
                                    }
                                    </div>
                                <Button className="mt-10" onClick={()=>handleDeleteField(item)}>Delete</Button>
                            </Card>
                        )
                    })}
                    
                 </div>
                 <div style={{display:'flex' , justifyContent:'end'}}>
                 {field.length > 0 &&  <Button className="mt-10" style={{background:data.button_bg , color:'#fff' , border:'none'}} onClick={publishForm}>Publish</Button>}

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}