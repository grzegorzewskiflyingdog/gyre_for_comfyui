export class rulesExecution {
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
     * @returns {object} {data,hiddenFields}  data and list of hidden fields
     */
    execute(data,fieldList,rules) {
        if (!data) return {data,hiddenFields:{}}
        let hiddenFields=[]
        for(let i=0;i<rules.length;i++) {
            // { fieldName, condition, actionType, rightValue, targetField, actionValue }
            let rule=rules[i]
            let leftValue=data[rule.fieldName]
            let rightValue=rule.rightValue
            let field=this.getField(rule.fieldName,fieldList)
            if (!field) {
              //  console.error("rule execution field not found:",rule.fieldName)
                continue
            }
            // type conversion based on field type
            if (field.type==="checkbox") {
                if (rightValue==="true") rightValue=true
                if (rightValue==="false") rightValue=false
                if (!leftValue) leftValue=false
                if (leftValue) leftValue=true
            }
            if (field.type==="slider" || field.type==="number") {
                if (this.isInteger(field.step)) {
                    leftValue=parseInt(leftValue)
                    rightValue=parseInt(rightValue)
                }
                if (this.isFloat(field.step)) {
                    leftValue=parseFloat(leftValue)
                    rightValue=parseFloat(rightValue)                    
                }
            }
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
                // type conversion based on field type
                if (targetField.type==="checkbox") {
                    if (value==="true") value=true
                    if (value==="false") value=false
                }
                if (targetField.type==="slider" || field.type==="number") {
                    if (this.isInteger(targetField.step)) {
                        value=parseInt(value)
                    }
                    if (this.isFloat(targetField.step)) {
                        value=parseFloat(value)
                    }
                }                
                console.log("setValue",targetFieldName,value)
                data[targetFieldName]=value
            }
            if (rule.actionType==="hideField") {
                hiddenFields.push(rule.targetField)
            }
        }        
        return {data,hiddenFields}
    }

}