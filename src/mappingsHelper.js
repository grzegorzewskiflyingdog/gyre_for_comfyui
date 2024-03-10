
export class mappingsHelper {

    getDefaultFields() {
        return [{name:"mergedImage",notInRuleEditor:true},{name:"mask",notInRuleEditor:true},{name:"hasMask"},{name:"prompt"},{name:"negativePrompt"},
        {name:"controlnet[].type"},{name:"controlnet[].image",notInRuleEditor:true},{name:"controlnet[].strength"},{name:"controlnet[].start_percent"},{name:"controlnet[].end_percent"},{name:"controlnet[].model"}]
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
}