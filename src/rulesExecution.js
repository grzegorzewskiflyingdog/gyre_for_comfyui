import { mappingsHelper } from './mappingsHelper.js'


export class rulesExecution {
    constructor() {
        this.defaultFields=new mappingsHelper().getDefaultFields()

    }
    /**
     * @param {string} fieldName 
     * @param {array} fieldList 
     * @returns {object} the field object
     */
    getField(fieldName,fieldList) {
        if (!fieldList) return
        for(let i=0;i<fieldList.length;i++) {
            let field=fieldList[i]
            if (field.name===fieldName) return field
        }
        for(let i=0;i<this.defaultFields.length;i++) {
            let field=this.defaultFields[i]
            if (field.name===fieldName) return field
        }        
    }
    checkArray(fieldName) {
        return fieldName.includes("[]")
    }
    // type conversion based on field type
    convertValue(value,field) {
        if (field.type==="checkbox" || field.type==="boolean") {
            if (value==="true") return true
            if (value==="false") return false
        }
        if (field.type==="slider" || field.type==="number") {
            if (this.isInteger(field.step)) {
                return parseInt(value)
            }
            if (this.isFloat(field.step)) {
                return parseFloat(value)
            }
        }
        return value
    }
    /**
     * gets value from custim fields and default fields
     * @param {object} data the data object 
     * @param {string} fieldName the field name including array name
     * @param {array} fieldList all custom fields
     * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
     * @returns {*}  the value
     */
    getValue(data,fieldName,fieldList,arrayIdx) {
        let field=this.getField(fieldName,fieldList)
        if (!this.checkArray(fieldName)) {
            let value= data[fieldName]
            return this.convertValue(value,field)
        }
        let arrayName= fieldName.split("[")[0]  // e.g. controlnet
        let propertyName= fieldName.split(".")[1]  // e.g. image
        let i=arrayIdx[arrayName]
        let value= data[arrayName][i][propertyName]
        return  this.convertValue(value,field)
    }

    setValue(data,value,fieldName,fieldList,arrayIdx) {
        let field=this.getField(fieldName,fieldList)
        if (!this.checkArray(fieldName)) {
            data[fieldName]= this.convertValue(value,field)
            return
        }       
        let arrayName= fieldName.split("[")[0]  // e.g. controlnet
        let propertyName= fieldName.split(".")[1]  // e.g. image
        let i=arrayIdx[arrayName]
        value=this.convertValue(value,field)
        data[arrayName][i][propertyName]=value

    }
    isInteger(value) {
        return !isNaN(value) && Number.isInteger(parseInt(value))
    }
    
    isFloat(value) {
        return !isNaN(value) && !Number.isInteger(parseInt(value)) && !isNaN(parseFloat(value))
    }    
    /**
     * execute rules on real data
     * @param {object} data the form data 
     * @param {array} fieldList the list of field definitions
     * @param {array} rules the rules list
     * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
     * @returns {object} {data,hiddenFields}  data and list of hidden fields
     */
    execute(data,fieldList,rules,arrayIdx={}) {
        if (!data) return {data,hiddenFields:{}}
        let hiddenFields=[]
        for(let i=0;i<rules.length;i++) {
            // { fieldName, condition, actionType, rightValue, targetField, actionValue }
            let rule=rules[i]
            let leftValue=this.getValue(data,rule.fieldName,fieldList,arrayIdx)
            let rightValue=rule.rightValue
            let field=this.getField(rule.fieldName,fieldList)
            if (!field) {
                console.error("rule execution field not found:",rule.fieldName)
                continue
            }
            rightValue=this.convertValue(rightValue,field)
            leftValue=this.convertValue(leftValue,field)

            let res=false
            switch (rule.condition) {   // ['==', '!=', '>', '<', '>=', '<=']
                case "===":
                case "==":
                    if (leftValue===rightValue) res=true
                    break
                case "!=":
                case "!==":
                    if (leftValue!==rightValue) res=true
                    break                    
                case ">":
                    if (leftValue>rightValue) res=true
                    break  
                case "<=":
                    if (leftValue<=rightValue) res=true
                    break                             
                case ">=":
                    if (leftValue>=rightValue) res=true
                    break 
                case "<":
                    if (leftValue<rightValue) res=true
                    break 

            }
            console.log("executed:",leftValue,rule.condition,rightValue,res)
            if (!res) continue // rule will be not executed because condition is false
            if (rule.actionType==="setValue") {

                let targetFieldName=rule.targetField
                let targetField=this.getField(targetFieldName,fieldList)
                if (!targetField) {
                    console.error("rule execution target field not found:",targetFieldName)
                    continue                    
                }
                let value=rule.actionValue
                this.setValue(data,value,targetFieldName,fieldList,arrayIdx)
            }
            if (rule.actionType==="hideField") {
                hiddenFields.push(rule.targetField)
            }
        }        
        return {data,hiddenFields}
    }

}