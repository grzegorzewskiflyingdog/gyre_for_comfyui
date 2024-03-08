export class rulesExecution {

    getField(fieldName,fieldList) {
        if (!fieldList) return
        for(let i=0;i<fieldList.length;i++) {
            let field=fieldList[i]
            if (field.name===fieldName) return field
        }
    }
    isInteger(value) {
        return !isNaN(value) && Number.isInteger(parseInt(value));
    }
    
    isFloat(value) {
        return !isNaN(value) && !Number.isInteger(parseInt(value)) && !isNaN(parseFloat(value));
    }    
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
                console.error("rule exeution field not found:",rule.fieldName)
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
            if (!res) continue // rule will be not executed because condition is false
            if (rule.actionType==="setValue") {
                let targetFieldName=rule.targetField
                let targetField=this.getField(targetFieldName)
                if (!targetField) {
                    console.error("rule exeution target field not found:",targetFieldName)
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
                data[targetFieldName]=value
            }
            if (rule.actionType==="hideField") {
                hiddenFields.push(rule.targetField)
            }
        }        
        return {data,hiddenFields}
    }

}