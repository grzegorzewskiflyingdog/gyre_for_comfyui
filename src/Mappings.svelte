<script>
    import { metadata} from './stores/metadata'
    import Icon from './Icon.svelte'
    import { combo_values } from './stores/combo_values'
 
    let showGyreMappings="none"
    let gyreMappingsDialogLeft="100px"
    let gyreMappingsDialogTop="100px"
    let widgets=[]
    let nodeType=""
    let mappingFields=getMappingFields()
    let nodeId=0
    function openGyreMappings(node,e) {
        console.log("openGyreMappings",node)
        mappingFields=getMappingFields()
        showGyreMappings="block"
        nodeId=node.id
        console.log(node)
        gyreMappingsDialogLeft=e.clientX-100+"px"
        gyreMappingsDialogTop=e.clientY-200+"px"
        widgets=node.widgets
        nodeType=node.type
        if (!$metadata.mappings) $metadata.mappings={}
        mappings=$metadata.mappings[nodeId]
        if (!mappings) mappings=[]
    }

    window.openGyreMappings=openGyreMappings    // expose open function so it can be called from ComfyUI menu extension

    // check of a widget (=a node property) is connected to a form field
    function checkGyreMapping(node,widget) {
        if  (!$metadata.mappings) return
        if (!$metadata.mappings[node.id]) return
        for(let i=0;i<$metadata.mappings[node.id].length;i++) {
            let mapping=$metadata.mappings[node.id][i]
            if (mapping.toField===widget.name) {
                let label=(widget.label || widget.name)
                return label+"="+mapping.fromField
            }
        }
    }
    window.checkGyreMapping=checkGyreMapping

    function setComboValue(widget) {
        if (widget.type!=="combo" || !widget.options  || !widget.options.values || !widget.name ) return
        $combo_values[widget.name]=widget.options.values //widget.options
    }
    window.gyreSetCombovalues=setComboValue


    function closeDialog() {
        showGyreMappings="none"
    }
    /**
     * get list of fields which can be used for widget mappings of each ComfyUI node:
     * fields: the form fields, defined by user
     * defaultFields: the fields whoch are usually available 
     * outputFields: the output fields, like an image or multiple images
     */
    function getMappingFields() {
        let fields= []
        if ($metadata.forms && $metadata.forms.default && $metadata.forms.default.elements) fields=$metadata.forms.default.elements
        let defaultFields=[{name:"mergedImage"},{name:"mask"},{name:"hasMask"},{name:"prompt"},{name:"negativePrompt"}]
        let outputFields=[{name:"resultImage"}]
        let res= {fields,defaultFields,outputFields}
        return res
    }

    let mappings = []
    let fromField=""
    let toField=""
    function addMapping() {
        if (!toField || !fromField) return
        if (!nodeId) return
        mappings.push({ fromField,toField  })
        mappings=mappings
        $metadata.mappings[nodeId] = mappings
        fromField=toField=""
    }    
    function deleteMapping(index) {
        mappings.splice(index, 1);
        mappings=mappings
        $metadata.mappings[nodeId] = mappings
    }
      
</script>

<div id="gyre_mappings" style="display:{showGyreMappings};left:{gyreMappingsDialogLeft};top:{gyreMappingsDialogTop}" >
    <h1>Field Mappings</h1>
        <div>{nodeType}</div>

        <select  bind:value={fromField}>
            <option value="">Select...</option>
            <optgroup label="Form fields">
              {#each mappingFields.fields as field}
                    <option value={field.name}>{field.name}</option>
                {/each}
            </optgroup>
         <optgroup label="Defaults">
                {#each mappingFields.defaultFields as field}
                    <option value={field.name}>{field.name}</option>
                {/each}
            </optgroup>     
            <optgroup label="Outputs">
                {#each mappingFields.outputFields as field}
                    <option value={field.name}>{field.name}</option>
                {/each}
            </optgroup>                    
        </select>
        <Icon name="arrowRight"></Icon>
        <select bind:value={toField} >
            <option value="">Select...</option>
            {#each widgets as widget}
                <option value={widget.name}>{widget.name}</option>
            {/each}
        </select>
        <button on:click={(e) => {addMapping()}}>+ Add</button>     
        {#each mappings as mapping, index}
            <div class="mapping">
                {mapping.fromField} <Icon name="arrowRight"></Icon>{mapping.toField}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="del" on:click={(e) => {deleteMapping()}}><Icon name="removeFromList"></Icon></div>
            </div>
        {/each}
        <div class="close"><Icon name="close" on:click={(e)=>{closeDialog()}}></Icon></div>
</div>

<style>


#gyre_mappings .mapping {
    border: 1px solid white;
    margin-top:10px;
    padding:5px;
    position: relative;
}
#gyre_mappings .mapping .del {
    position: absolute;
    right:10px;
    top: 2px;
}



#gyre_mappings button {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        font-size: 14px;
        min-width: 70px;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }
#gyre_mappings {
    z-index: 200;
    position: fixed;
    left: 10px;
    top: 10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    padding: 20px;
    backdrop-filter: blur(20px) brightness(80%);
    box-shadow: 0 0 1rem 0 rgba(255, 255, 255, 0.2);
    color: white;
    width: 540px;
    display: block;
    border-radius: 10px;
    font-size: 14px;
}
#gyre_mappings {
    display:none;
    width:480px;
    left:200px;
    top:200px;
}
#gyre_mappings select {
    background-color: grey;
    font-size: 14px;
    color: white;
    border: none;
    margin-top: 10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    padding: 3px;
}
#gyre_mappings select {
    background: transparent;
    border: 1px solid white;
    border-radius: 5px;
}
#gyre_mappings select option,#gyre_mappings select optgroup {
    background: black;
}
#gyre_mappings h1 {
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 30px;
}
#gyre_mappings .close {
    position: absolute;
    right: 20px;
    top:20px;
}
</style>