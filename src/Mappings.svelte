<script>
    import { metadata} from './stores/metadata'
    import Icon from './Icon.svelte'

    let showGyreMappings="none"
    let gyreMappingsDialogLeft="100px"
    let gyreMappingsDialogTop="100px"
    let widgets=[]
    let nodeType=""
    let mappingFields=getMappingFields()
    function openGyreMappings(node,e) {
        console.log("openGyreMappings")
        mappingFields=getMappingFields()
        showGyreMappings="block"
        console.log(node)
        gyreMappingsDialogLeft=e.clientX-100+"px"
        gyreMappingsDialogTop=e.clientY-200+"px"
        widgets=node.widgets
        nodeType=node.type
    }

    window.openGyreMappings=openGyreMappings
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
</script>

<div id="gyre_mappings" style="display:{showGyreMappings};left:{gyreMappingsDialogLeft};top:{gyreMappingsDialogTop}" >
    <h1>Field Mappings</h1>
        <div>{nodeType}</div>
        <select >
            <option value="">Select...</option>
            {#each widgets as widget}
                <option value={widget.name}>{widget.name}</option>
            {/each}
        </select>
        <select >
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
        <div class="close"><Icon name="close"></Icon></div>
</div>

<style>
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
    width:400px;
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