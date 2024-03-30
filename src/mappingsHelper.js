
export class mappingsHelper {

    getDefaultFields() {
        return [{name:"mergedImage",type:"image",notInRuleEditor:true},{name:"mask",type:"image",notInRuleEditor:true},{name:"hasMask"},{name:"prompt"},{name:"negativePrompt"},
        {name:"controlnet[].type"},{name:"controlnet[].image",type:"image",notInRuleEditor:true},{name:"controlnet[].strength"},{name:"controlnet[].start_percent"},{name:"controlnet[].end_percent"},{name:"controlnet[].model"}]
    }
/**
     * get list of fields which can be used for widget mappings of each ComfyUI node:
     * fields: the form fields, defined by user
     * defaultFields: the fields whoch are usually available 
     * outputFields: the output fields, like an image or multiple images
     */
    getMappingFields(metadata) {
        let fields= []
        if (metadata.forms && metadata.forms.default && metadata.forms.default.elements) fields=metadata.forms.default.elements
        let defaultFields=this.getDefaultFields()
        let outputFields=[{name:"resultImage"}]
        let res= {fields,defaultFields,outputFields}
        return res
    }

    getNodeByType(workflow,type) {
        return workflow.nodes.find(node => node.type === type)
      }
    addMapping(metadata,nodeId,fromField,toField) {
        if (!toField || !fromField) return
        if (!nodeId) return
        if (!metadata.mappings) metadata.mappings={}
        let mappings=metadata.mappings[nodeId]
        if (!mappings) mappings=[]
        mappings.push({ fromField,toField  })
        mappings=mappings
        metadata.mappings[nodeId] = mappings
    }    

    cleanUpMappings(metadata) {
        let fieldNames={}
        let allFields=this.getMappingFields(metadata)
        for(let i=0;i<allFields.fields.length;i++) {
            let field=allFields.fields[i]
            fieldNames[field.name]=true
        }
        for(let i=0;i<allFields.defaultFields.length;i++) {
            let field=allFields.defaultFields[i]
            fieldNames[field.name]=true
        }        
        for(let i=0;i<allFields.outputFields.length;i++) {
            let field=allFields.outputFields[i]
            fieldNames[field.name]=true
        }                
        console.log(fieldNames)
        for (let nodeId in metadata.mappings) {
            let mappings=metadata.mappings[nodeId]
            let filteredArray=[]
            for(let i=0;i<mappings.length;i++) {
                let m=mappings[i]
                console.log(m)
                if (fieldNames[m.fromField]) filteredArray.push(m)
            }
            metadata.mappings[nodeId]=filteredArray            
        }
    }

}