import { Button, Card,  Input } from "antd";
import { settings } from "../../utils/tools";
import { useState } from "react";
import { fetcher } from "../../utils/helper";

export const CreateForms = ({setShowSkeleton , setLoading , loading  , setModalOpen}) =>{
    const {link_btn_bg , link_btn_color ,link_headtitle } = settings;
    const [field , setField] = useState([]);
    const [formDetail , setFormDetail] = useState({formName:'' , formDescription:''})

    const handleDeleteField = (subItem) =>{
     let tempField = field.filter((item) => item.key !== subItem.key);
     setField(tempField)
     
    }

    const addField = () =>{
       let newField = {
         key: field.length,
         label: '',
         type: "textArea",
         required: false , 
         defaultValue:''
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
        let url = 'http://127.0.0.1:8000/governify/admin/serviceRequestForms';
        let categoryData = {
            name: formDetail.formName ,
            description: formDetail.formDescription ,
            form_data: field
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


    const handleChangeFormDescription = (event) =>{
        setFormDetail({...formDetail , formDescription:event.target.value});

    }



    return (
        <>
        <div title="status visibility manage" style={{  width: '100%' , marginTop:'25px'}}>    
            <div>
            <div class="text-white" style={{ backgroundColor: link_headtitle }}>
                <p class="p-2 m-0 fs-5" style={{display:"flex" , justifyContent:"space-between"}}><strong>Create Form</strong><Button onClick={addField}>+ Add Field</Button></p>
            </div>
            <div class="form_wrapper border border-success p-4 primary-shadow" style={{height:'600px' , overflowY:'auto'}}>
                <Input placeholder="Form name" className="mt-10" onChange={(e)=>handleChangeFormName(e)} addonBefore="Form Name"/>
                <Input placeholder="Form description" className="mt-10" onChange={(e)=>handleChangeFormDescription(e)} addonBefore="Form Description"/>
                <div className="mt-10">
                    {field.map((item , index) =>{
                        return (
                            <Card className="mt-10">
                                <textarea disabled style={{width:'100%'}}></textarea>
                                <Input className="mt-10" placeholder="Label" value={item.label} onChange={(event)=>handleChangeLabel(event ,index)} addonBefore="Label"/>
                                <Button className="mt-10" onClick={()=>handleDeleteField(item)}>Delete</Button>
                            </Card>
                        )
                    })}
                    
                 </div>
                 <div style={{display:'flex' , justifyContent:'end'}}>
                 {field.length > 0 &&  <Button className="mt-10" style={{background:link_btn_bg , color:link_btn_color , border:'none'}} onClick={publishForm}>Publish</Button>}

                 </div>
            </div>
            
            </div>
        </div>

        </>
    )
}