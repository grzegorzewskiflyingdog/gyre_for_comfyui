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
    getArrayName(fieldName) {
        if (!this.checkArray(fieldName)) return
        return fieldName.split("[")[0]  // e.g. controlnet
    }    
    // type conversion based on field type
    convertValue(value,field) {
        if (!field) return ""
        if (field.type==="checkbox" || field.type==="boolean") {
            if (value==="true") return true
            if (value==="false") return false
        }
        if (field.type==="slider" || field.type==="number") {
            console.log("convertValue",field)
            if (this.isFloat(field.step)) {
                return parseFloat(value)
            }
            console.log("isInteger")
            return parseInt(value)

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
    
    isFloat(value) {
        if (typeof value !== 'number' || isNaN(value)) {
          return false; // It's not a number or is NaN (Not a Number)
        }        
        return value % 1 !== 0; // If there's a decimal part, it's a float
      } 
    /**
     * execute rules on real data
     * @param {object} data the form data 
     * @param {array} fieldList the list of field definitions
     * @param {array} rules the rules list
     * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
     * @param {string} arrayName optional: limit rules execution to that array only
     * @returns {object} {data,hiddenFields}  data and list of hidden fields
     */
    execute(data,fieldList,rules,arrayIdx={},arrayName="") {
        if (!data) return {data,hiddenFields:{}}
        let hiddenFields=[]
        for(let i=0;i<rules.length;i++) {
            // { fieldName, condition, actionType, rightValue, targetField, actionValue }
            let rule=rules[i]
            let field=this.getField(rule.fieldName,fieldList)
            if (arrayName==="__ignore_arrays" &&  this.checkArray(field.name)) continue 
            let leftValue=this.getValue(data,rule.fieldName,fieldList,arrayIdx)
            let rightValue=rule.rightValue
            if (!field) {
                console.error("rule execution field not found:",rule.fieldName)
                continue
            }
            if (arrayName && !this.checkArray(field.name)) continue  // array mode, but field is not an array
            if (arrayName && this.getArrayName(field.name)!==arrayName) continue    // other arrays ignore
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