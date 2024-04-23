import { rulesExecution } from './rulesExecution.js'
import { loopPreparser } from './loopPreparser.js'


export class valuePreparser {

    constructor(workflow) {
      this.workflow = workflow
      this.loopParser=new loopPreparser(workflow)
      this.rules=new rulesExecution()
      if (!workflow.extra.gyre) return
      this.metadata=workflow.extra.gyre
      this.fieldList=[]
      if (this.metadata.forms && this.metadata.forms.default)  this.fieldList=this.metadata.forms.default.elements
    }


    getNodeById(nodeId) {
        return this.workflow.nodes.find(node => node.id === nodeId)
      }
    /* mergedImage, mask, controlnet[].image
    */
    async getImage(propertyName, arrayName="",index=0) {
        if(window.postMessageAdapter){
            let instance = window.postMessageAdapter.getWorkflowImageRequestServerInstance();
            let res = await instance.getSingleImage(propertyName, arrayName,index);
            return res;
        }
        return null;
    }
    /**
     * get layer image
     * @param {string} layerName , special names: currentLayer, currentLayerAbove, currentLayerBelow
     * @param {string} layerID , as alternative select layer by ID
     */
    async getLayerImage(layerName,layerID) {
        if(window.postMessageAdapter){
            let instance = window.postMessageAdapter.getWorkflowImageRequestServerInstance();
            let res = await instance.getLayerImage(layerName,layerID);
            return res;
        }
        return null;
    }
    /**
     * convert value (e.g. boolean) also get images from frontend
     * @param {*} value 
     * @param {object} field 
     * @param {string} arrayName 
     * @param {number} index 
     * @returns 
     */
    async convertValue(value,field,arrayName="",index=0) {
        if (field.type==="image") {

                if (!arrayName) {
                    console.log("get image for field",field.name)
                    return await this.getImage(field.name)
                } else {
                    let propertyName= field.name.split(".")[1]  // e.g. image from controlnet[].image
                    return await this.getImage(propertyName,arrayName,index) // e.g. image,controlnet,0 for controlnet[0].image            
                }
        }
        if (field.type==="layer_image") {
            return await this.getLayerImage(field.name)
        }
        if (field.type==="drop_layers") {
            let idx=0
            if (field.originalName) {
                idx=field.index
            }
            let arr=value.split(",")
            let layerID=arr[idx]
            return await this.getLayerImage(null,layerID)
        }
        return  this.rules.convertValue(value,field)
    }
    /**
     * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) and set value
     * @param {object} field the field object {name,type,min,max,...}
     * @param {string} fromFieldName full name with array name and index (e.g. "steps" or "controlnet[0].model")
     * @param {*} value 
     */
    async setNodesValue(field,fromFieldName,value) {
        for (let nodeId in this.metadata.mappings) {
            let mappingList=this.metadata.mappings[nodeId]
            let nodeIdInt=parseInt(nodeId)
            let node=this.loopParser.getNodeById(nodeIdInt)
            if (!node) {
                console.log("could not find node with id ",JSON.stringify(nodeIdInt))
            }
            if (node) {
                for(let i=0;i<mappingList.length;i++) {
                    let mapping=mappingList[i]
                    
                    if (mapping && mapping.fromField===fromFieldName) {
                        value=await this.convertValue(value,field)
//                        console.log("setNodesValue",node,value,mapping.toIndex)
                        node.widgets_values[parseInt(mapping.toIndex)]=value
                    }                
                }
            }

        }
    }
    /**
     * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) inside a group and set value
     * @param {object} field the field object {name,type,min,max,...}
     * @param {string} fromFieldName full name with array name without index "controlnet[].model")
     * @param {string} groupName the group name - e.g. controlnet[0], controlnet[1],...
     * @param {string} arrayName  the array name - e.g. controlnet
     * @param {number} arrayName  the index in array (0,1,...)
    * @param {*} value 
     */
    async setNodesValueGroup(field,fromFieldName,groupName,value,arrayName,index) {
        for (let i=0;i<this.workflow.nodes.length;i++) {
            let node=this.workflow.nodes[i]
            if (this.loopParser.isNodeInGroup(node.id,groupName)) { // only nodes in group
                let mappingList=this.metadata.mappings[node.id]
                if(mappingList && mappingList.length) {
                    for (let i = 0; i < mappingList.length; i++) {
                        let mapping = mappingList[i]
                        if (mapping && mapping.fromField === fromFieldName) {
                            value = await this.convertValue(value, field, arrayName, index)
                            node.widgets_values[parseInt(mapping.toIndex)] = value
                        }
                    }
                }
            }
        }
    }

    /**
     * Modify workflow values by using mapping and data from image editor
     * data object has to be filled with
     *  prompt
     *  negativePrompt
     *  hasMask
     *  optional: controlnet array
     * @param {object} data 
     */
    async setValues(data) {
        if (!this.metadata) return
        if (!this.metadata.mappings) return
        for (let name in data) {
            let value=data[name]
            if (!Array.isArray(value)) {
                let field=this.rules.getField(name,this.fieldList)
                await this.setNodesValue(field,field.name,value)
            } else {
                // replace array of object values
                let arrayName=name
                for(let i=0;i<data[arrayName].length;i++) {
                    let element=data[arrayName][i]
                    for(let propName in element) {
                        let fieldName=arrayName+"[]."+propName      // e.g. controlnet[].type
                        let fieldNameIndex=arrayName+"["+i+"]."+propName      // e.g. controlnet[0].type
                        let value=element[propName]
                        let field=this.rules.getField(fieldName,this.fieldList)
                        await this.setNodesValue(field,fieldNameIndex,value)
                        let groupName=arrayName+"["+i+"]"                // e.g. controlnet[0]
                        await this.setNodesValueGroup(field,fieldName,groupName,value,arrayName,i)
                    }
                }
            }
        }

    }
}