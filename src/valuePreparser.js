
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
    /**
     * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) and set value
     * @param {object} field the field object {name,type,min,max,...}
     * @param {string} fromFieldName full name with array name and index (e.g. "steps" or "controlnet[0].model")
     * @param {*} value 
     */
    setNodesValue(field,fromFieldName,value) {
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
                        value=this.rules.convertValue(value,field)
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
    * @param {*} value 
     */
    setNodesValueGroup(field,fromFieldName,groupName,value) {
        for (let i=0;i<this.workflow.nodes.length;i++) {
            let node=this.workflow.nodes[i]
            if (this.loopParser.isNodeInGroup(node.id,groupName)) { // only nodes in group
                let mappingList=this.metadata.mappings[node.id]
                for(let i=0;i<mappingList.length;i++) {
                    let mapping=mappingList[i]
                    if (mapping && mapping.fromField===fromFieldName) {
                        value=this.rules.convertValue(value,field)
                        node.widgets_values[parseInt(mapping.toIndex)]=value
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
                this.setNodesValue(field,field.name,value)
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
                        this.setNodesValue(field,fieldNameIndex,value)
                        let groupName=arrayName+"["+i+"]"                // e.g. controlnet[0]
                        this.setNodesValueGroup(field,fieldName,groupName,value)
                    }
                }
            }
        }

    }
}